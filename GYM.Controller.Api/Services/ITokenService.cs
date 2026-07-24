using GYM.Data.Entities;

namespace GYM.Controller.Api.Services;

public interface ITokenService
{
    string Issue(int id, string email, Role role);
}