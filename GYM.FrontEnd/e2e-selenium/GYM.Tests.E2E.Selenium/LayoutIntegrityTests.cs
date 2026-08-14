using FluentAssertions;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Chromium;
using Xunit;
using Xunit.Abstractions;
using OpenQA.Selenium.Support.UI;

public class LayoutIntegrityTests : IDisposable
{

    private readonly ChromeDriver _driver;
    private readonly ITestOutputHelper _output;

    private const string BaseUrl = "http://localhost:5173";
    public CatalogTests(ITestOutputHelper output)
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
    public void LoginAndBooking_UsesAuth()
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
        _driver.Navigate().GoToUrl($"{BaseUrl}/user/booking");

        // --- FIX B: CONFIRM WE STABLE-LANDED ON THE CATALOG PAGE ---
        wait.Until(d => d.Url.Contains("/user/booking"));


        var cardsCollection = _driver.FindElements(By.CssSelector(".booking-card-wrapper"));
        var firstCard = cardsCollection.First();
        var workoutName = firstCard.FindElement(By.TagName("h3")).Text;
        workoutName.Should().NotBeNullOrEmpty();

        firstCard.FindElement(By.CssSelector("button.primary")).Click();
        _driver.Navigate().GoToUrl($"{BaseUrl}/user/mybookings");
        var myCardsCollection = _driver.FindElements(By.CssSelector(".exercise-list .booking-card-wrapper"));
        var myFirstCard = myCardsCollection.First();
        var myWorkoutName = myFirstCard.FindElement(By.TagName("h3")).Text;
        myWorkoutName.Should().NotBeNullOrEmpty();

        myWorkoutName.Should().Be(workoutName);
    }

}