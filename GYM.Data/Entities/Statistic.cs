namespace GYM.Data.Entities;

public class Statistic
{
    public int Id {get; set;}
    public int UserId{get; set;} //FK UserId
    public decimal Weight {get;set;} //Weight of the person  
    public decimal Height {get;set;}
    public decimal Strength {get;set;}
    public TimeOnly MileRun{get;set;}
    public DateOnly MeasureAt{get;set;} //When were the measurements taken
}