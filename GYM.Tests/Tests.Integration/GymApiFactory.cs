using GYM.Controller.Api;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;

namespace GYM.Tests.Tests.Integration;

//In Memory server. WebApplicationFactory<Program> boots our entiry GYM.Controller.Api
//The real program.cs, middleware, ef core, etc. 

public class GymApiFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        
    }
}


//Una factory para los test.
[CollectionDefinition("Gym API")]
public class GymApiCollection : ICollectionFixture<GymApiFactory>;