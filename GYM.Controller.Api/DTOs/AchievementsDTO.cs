using GYM.Data.Entities;

namespace GYM.Controller.Api.DTOs;
public class AchievementDTO
{
    public int Id {get; set;}
    public string Name {get; set;} = default!;
    public string Description {get; set;} = default!;
    public string Icon {get; set;} = default!;
    public int Points {get; set;}
    public string Condition_type {get; set;} = default!;
    public int ConditionValue { get; set; }
    public List<User_Achievement> UserAchievements {get; set;} = new();
}