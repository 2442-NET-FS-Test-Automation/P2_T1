using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using GYM.Controller.Api.DTOs;
using GYM.Data.Entities;
using GYM.Tests.Tests.Integration;
using Xunit;

namespace GYM.Tests.Integration.Api;

[Collection("Gym API")]
public class BookingsTesting
{
    private readonly HttpClient _client;

    public BookingsTesting(GymApiFactory factory)
    {
        _client = factory.CreateClient();
    }

    private record TokenResponse(string? token);

    // GET - Verifies if booking exists in DB and returns populated tables graph
    [Fact]
    public async Task GetBookingById_With200OkStatus()
    {
        // Arrange
        int existingBookingId = 1020;

        // Act
        var response = await _client.GetAsync($"/api/Booking/bookings/{existingBookingId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var booking = await response.Content.ReadFromJsonAsync<BookingDTO>();
        booking.Should().NotBeNull();
        booking!.Id.Should().Be(existingBookingId);
        booking.Trainings.Should().NotBeEmpty("The response graph must include eager-loaded routine collections.");
    }

    // GET - Invalid ID -> Not Found
    [Theory]
    [InlineData(-5)]
    [InlineData(88888)] // Non-existent booking entry ID matching database constraints
    public async Task GetBookingById_With404NotFoundStatus(int nonExistingId)
    {
        // Act
        var response = await _client.GetAsync($"/api/Booking/bookings/{nonExistingId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    // POST - Client user requests an active workout template reservation row
    [Fact]
    public async Task CreateBooking_With201CreatedStatus()
    {
        // Arrange
        var dto = new BookingDTO
        {
            TrainingId = 3,
            UserId = 1,
            Status = BookingStatus.Booked,
            ExerciseTime = new DateTime(2026, 07, 28, 1, 0, 0)
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/Booking/bookings", dto);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);
        
        var payload = await response.Content.ReadFromJsonAsync<BookingDTO>();
        payload.Should().NotBeNull();
        payload!.Id.Should().BeGreaterThan(0, "The relational database must generate an identity primary key auto-increment token.");
        payload.UserId.Should().Be(dto.UserId);
    }

    // PATCH - Modifies current lifestyle status state indices anonymously via route segments
    [Fact]
    public async Task UpdateBookingStatus_With200OkStatus()
    {
        // Arrange
        int targetBookingId = 1020;
        int nextStatusValueIndex = 1; // 1 maps directly to 'Working' tracking state configurations

        // Act - Targets route shape: [HttpPatch("bookings-status/{id}/{newStatus}")]
        var response = await _client.PatchAsync($"/api/Booking/bookings-status/{targetBookingId}/{nextStatusValueIndex}", null);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var payload = await response.Content.ReadFromJsonAsync<BookingDTO>();
        payload.Should().NotBeNull();
        payload!.Status.Should().Be(BookingStatus.Working, "The updated object payload must reflect the mutated lifestyle state parameter.");
    }

    // DELETE - Evicts reservation record block out of scheduling list
    [Fact]
    public async Task DeleteBooking_With24NoContentStatus()
    {
        // Arrange
        int bookingIdToDelete = 1040; // Presumes clean transaction seed block rows exist

        // Act
        var response = await _client.DeleteAsync($"/api/Booking/bookings/{bookingIdToDelete}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }
}
