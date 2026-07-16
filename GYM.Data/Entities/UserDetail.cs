namespace GYM.Data.Entities;

public class UserDetail
{
    public int Id {get; set;}
    public int UserId{get; set;} //FK
    public string Name{get;set;} = "";
    public string Surname {get;set;} = "";
    public DateTime JoinAt{get;set;}
    public User User{get;set;} = default!;
}