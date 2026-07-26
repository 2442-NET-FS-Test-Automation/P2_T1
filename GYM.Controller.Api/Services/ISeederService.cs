
public interface ISeederService
{
    Task<bool> SeedInfo(List<RegisterUserDTOs> registerUserDTOs);
}