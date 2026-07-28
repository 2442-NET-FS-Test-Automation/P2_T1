namespace GYM.Data.Entities;

public enum StatusTraining
{
    Postponed, //Something happened, either room unabailable or trainer unabailable
    Finished, //Training is finished
    Active, //Training is happening
    Pending, //Training is shedule
}