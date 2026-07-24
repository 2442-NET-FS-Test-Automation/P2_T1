namespace GYM.Controller.Api.DTOs;
public class StatsDTO
{
    public int Id {get; set;}
    public int UserId{get; set;}
    public decimal Weight {get;set;} 
    public decimal Height {get;set;}
    public decimal Strength {get;set;}
    public TimeOnly MileRun{get;set;}
    public DateOnly MeasureAt{get;set;} 
    public int Age {get; set;}
}