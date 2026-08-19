using GYM.Controller.Api;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;

namespace GYM.Tests.Tests.Integration;

// Our tests use an in memory server. WebApplicationFactory<Program> boots 
// our ENTIRE Library.ControllerApi - its real Program.cs, real middleware pipeline
// real EF Core, etc. The "server" lives inside the test process. CreateClient()
// hands back an HttpClient that is wired straight into it: no port, no network,
// it hits it in memory. 

// Program here is the API's entry point - Program.cs in Library.ControllerAPI. 
public class GymApiFactory : WebApplicationFactory<Program>
{
    // We are going to fake ONE thing in our entire integration test suite
    // the call to the dummyjson.com api. 
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
    }
}


// Collection Fixture: ONE factory (one in memory server, one EF setup, etc)
// shared by every class that uses the appropriate tag [Collection("Library API")]
// This avoids us having to boot the server up once per test class that needs it
[CollectionDefinition("GYM API")]
public class GymApiCollection : ICollectionFixture<GymApiFactory>;