using GYM.Controller.Api.DTOs;
namespace GYM.Controller.Api.Services;

public interface IReportService
{
    Task<UserReportDTO?> GenerateUserReportAsync(int userId);
}