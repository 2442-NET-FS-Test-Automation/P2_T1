using FluentAssertions;
using GYM.Controller.Api.DTOs;
using GYM.Controller.Api.Services;
using GYM.Data.Entities;
using GYM.Data.Repositories;
using Moq;
using Xunit;

namespace GYM.Tests.Unit.Services;

public class BookingServiceTests
{
    // Employs your target-typed new expression layout rule contract definition format
    private readonly Mock<IBookingRepository> _bookingRepo = new();

    [Fact]
    public async Task CreateBookingAsync_With200OkStatus()
    {
        // ARRANGE
        var dto = new BookingDTO
        {
            TrainingId = 3,
            UserId = 1,
            Status = BookingStatus.Booked,
            ExerciseTime = new DateTime(2026, 07, 28, 1, 0, 0)
        };

        var dbBooking = new Booking
        {
            Id = 1020,
            TrainingId = dto.TrainingId,
            UserId = dto.UserId,
            Status = dto.Status,
            ExerciseTime = dto.ExerciseTime ?? DateTime.Now,
            DoneAt = null
        };

        _bookingRepo
            .Setup(r => r.AddBooking(It.IsAny<Booking>()))
            .ReturnsAsync(dbBooking);

        var sut = new BookingService(_bookingRepo.Object);

        // ACT
        var result = await sut.AddBookingAsync(dto);

        // ASSERT
        result.Should().NotBeNull();
        result.Id.Should().Be(1020);
        result.TrainingId.Should().Be(dto.TrainingId);
        result.UserId.Should().Be(dto.UserId);
        result.Status.Should().Be(dto.Status);

        _bookingRepo.Verify(r => r.AddBooking(It.IsAny<Booking>()), Times.Once);
    }

    // Invalid update transaction where target entity does not exist in backend
    [Fact]
    public async Task UpdateStatus_WithMissingId_WithBad400Status()
    {
        // ARRANGE
        int missingBookingId = 9999;
        
        // Setup repository layer tracking mock to return null context
        _bookingRepo
            .Setup(r => r.GetBookingById(missingBookingId))
            .ReturnsAsync((Booking?)null);

        var sut = new BookingService(_bookingRepo.Object);

        // ACT
        var result = await sut.UpdateStatus(missingBookingId, 1);

        // ASSERT
        result.Should().BeNull();

        // Verifying that it never triggered a save mutation to the database layer
        _bookingRepo.Verify(r => r.UpdateBooking(It.IsAny<Booking>()), Times.Never);
    }

    [Fact]
    public async Task UpdateStatus_WhenMovingToCompleted_SetsDoneAtTimestamp()
    {
        // ARRANGE
        int bookingId = 1020;
        var dbBooking = new Booking
        {
            Id = bookingId,
            TrainingId = 3,
            UserId = 1,
            Status = BookingStatus.Working,
            ExerciseTime = DateTime.Now,
            DoneAt = null
        };

        _bookingRepo
            .Setup(r => r.GetBookingById(bookingId))
            .ReturnsAsync(dbBooking);
            
        _bookingRepo
            .Setup(r => r.UpdateBooking(It.IsAny<Booking>()))
            .ReturnsAsync((Booking b) => b);

        var sut = new BookingService(_bookingRepo.Object);

        // ACT
        var result = await sut.UpdateStatus(bookingId, 2); // 2 maps to Completed state

        // ASSERT
        result.Should().NotBeNull();
        result.Status.Should().Be(BookingStatus.Completed);
        result.DoneAt.Should().NotBeNull();
        result.DoneAt.Value.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(5));

        _bookingRepo.Verify(r => r.UpdateBooking(It.IsAny<Booking>()), Times.Once);
    }

    // Invalid, out-of-bounds status index integer passed to transaction pipeline
    [Fact]
    public async Task UpdateStatus_WithInvalidStatusCode_ReturnsNull()
    {
        // ARRANGE
        int bookingId = 1020;
        var dbBooking = new Booking 
        { 
            Id = bookingId, 
            Status = BookingStatus.Booked 
        };

        _bookingRepo
            .Setup(r => r.GetBookingById(bookingId))
            .ReturnsAsync(dbBooking);

        var sut = new BookingService(_bookingRepo.Object);

        // ACT
        var result = await sut.UpdateStatus(bookingId, 99); // 99 is invalid/unmapped status code

        // ASSERT
        result.Should().BeNull();
        _bookingRepo.Verify(r => r.UpdateBooking(It.IsAny<Booking>()), Times.Never);
    }
}
