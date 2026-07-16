namespace GYM.Data.Entities;

public class User
{
    public int Id {get;  set;}
    public string Email {get; set;} = ""; //Email
    public string Phone{get; set;} = ""; //Phone number
    public string Password {get; set;} = "";
    public Role Role {get; set;} //Role of the user: User or Trainer

}