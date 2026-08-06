using FluentAssertions;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Chromium;

public class RouteProtectionMatrix : IDisposable
{

    private readonly ChromeDriver _driver;
    public RouteProtectionMatrix()
    {
        //Option classes : per browser launch config
        //Headless makes it so chrome doesnt pop up
        //we can even tell it things like what window size we want to use
        var options = new ChromeOptions();
        options.AddArgument("--headless=new");
        options.AddArgument("--window-size=1280,900");

        //Creating our driver with the options above
        _driver = new ChromeDriver(options);

        //We can also use the constructor to configure an implicit wait
        //We will set it so each FindElement(s) retries for up to 2s before
        //failing. Proper explicit waits will be deemed later on
        _driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(2);

        _driver.Navigate().GoToUrl("http://localhost:5173/");

    }

    public void Dispose()
    {
        _driver.Quit();
    }

    [Fact]
    public void OpeningThePersonalBooking_ShowsCatalog()
    {
        _driver.Navigate().GoToUrl("http://localhost:5173/login");

        // Our SPA has no id or name attributes - so we're gonna use A LOT
        // of css selectors. Hint: you should ad those ID selectors
        var username = _driver.FindElement( // Could also just ask for the input we named username
            By.CssSelector("form.login-form input[type='email']"));
        var password = _driver.FindElement(
            By.CssSelector("form.login-form input[type='password']"));
        var submit = _driver.FindElement(By.CssSelector("form.login-form button[type='submit']"));

        // Drive the elements.
        username.SendKeys("user@test.com");
        password.SendKeys("1234");
        submit.Click();
        //Act - a real navigation in a real browser
        _driver.Navigate().GoToUrl("http://localhost:5173/user/mybookings");

        //Assert - the document title and the header react renders
        _driver.FindElement(By.TagName("h2")).Text.Should().Be("Your bookings");
    }

    [Fact]
    public void OpeningThePersonalBooking_NonAuth()
    {
        _driver.Manage().Cookies.DeleteAllCookies();
        _driver.Navigate().GoToUrl("http://localhost:5173/user/mybookings");

        //Assert - the document title and the header react renders
        _driver.FindElement(By.TagName("h2")).Text.Should().Be("Log in to your account");
    }
}
