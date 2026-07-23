using GYM.Data.Entities;

namespace GYM.Controller.Api.Services;

public interface ITokenService
{
    string Issue(string email, Role role);
}