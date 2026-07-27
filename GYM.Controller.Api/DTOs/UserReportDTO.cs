namespace GYM.Controller.Api.DTOs;
public class UserReportDTO
{
    public int UserId { get; set; }
    public string GeneratedAt { get; set; } = DateTime.Now.ToString("yyyy-MM-dd HH:mm");
    

    public int TotalMeasurementsTaken { get; set; }
    public decimal AverageWeight { get; set; }
    public decimal WeightChange { get; set; } // Current weight minus first weight
    public string BestMileRun { get; set; } = string.Empty;

    // Detailed Historic Trend Data Rows
    public List<StatsDTO> History { get; set; } = new();
}
