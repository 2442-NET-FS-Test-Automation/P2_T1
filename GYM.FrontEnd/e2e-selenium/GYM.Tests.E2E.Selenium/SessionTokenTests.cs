using FluentAssertions;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Chromium;
using Xunit;
using Xunit.Abstractions;
using OpenQA.Selenium.Support.UI;

public class SessionTokenTests : IDisposable
{

    private readonly ChromeDriver _driver;
    private readonly ITestOutputHelper _output;

    private const string BaseUrl = "http://localhost:5173";
    public SessionTokenTests(ITestOutputHelper output)
    {
        _output = output;



        // Option classes: per browser launch config.
        // Headless makes it so chrome doesn't pop up
        // we can even tell it things like what window size we want it to use
        _output = output;

        var options = new ChromeOptions();
        options.AddArgument("--headless=new"); // Runs inside console environment blocks cleanly
        options.AddArgument("--window-size=1280,900");

        _driver = new ChromeDriver(options);
        _driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(3);

    }

    public void Dispose()
    {
        _driver.Quit();
    }

    [Fact]
    public void BrowserRefresh_MaintainsAuth()
    {
        _driver.Manage().Cookies.DeleteAllCookies();
        _driver.Navigate().GoToUrl($"{BaseUrl}/login");
        var username = _driver.FindElement(By.CssSelector("form.login-form input[type='email']"));
        var password = _driver.FindElement(By.CssSelector("form.login-form input[type='password']"));
        var submit = _driver.FindElement(By.CssSelector("form.login-form button[type='submit']"));

        username.SendKeys("user@test.com");
        // FIXED: Reverted back to your verified password credentials ("1234") to allow the session to pass
        password.SendKeys("1234"); 
        submit.Click();

        var wait = new WebDriverWait(_driver, TimeSpan.FromSeconds(5));

        // --- FIX A: WAIT FOR THE AUTH RE-ROUTING TO FINISH ON ITS OWN ---
        // This blocks the driver thread until the landing page logic successfully redirects 
        // away from /login, proving the JWT payload was saved into LocalStorage/Cookies.
        wait.Until(d => !d.Url.Contains("/login"));

        // 2. --- NAVIGATE TO WORKOUTS CATALOG VIEW ---
        _driver.Navigate().GoToUrl($"{BaseUrl}/user/mybookings");

        // --- FIX B: CONFIRM WE STABLE-LANDED ON THE CATALOG PAGE ---
        wait.Until(d => d.Url.Contains("/user/mybookings"));

        _driver.FindElement(By.TagName("h2")).Text.Should().Be("Your bookings");

        _driver.Navigate().Refresh();

        _driver.Url.Should().NotContain("/login");

        _driver.Url.Should().Contain("/user/mybookings");
    }

}