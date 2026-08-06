
using FluentAssertions;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Chromium;

public class CatalogTests : IDisposable
{

    private readonly ChromeDriver _driver;
    public CatalogTests()
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
    public void LoginAndBooking_UsesAuth()
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
        _driver.Navigate().GoToUrl("http://localhost:5173/user/booking");


        var cardsCollection = _driver.FindElements(By.CssSelector(".booking-card-wrapper"));
        var firstCard = cardsCollection.First();
        var workoutName = firstCard.FindElement(By.TagName("h3")).Text;
        workoutName.Should().NotBeNullOrEmpty();

        firstCard.FindElement(By.CssSelector("button.primary")).Click();
        _driver.Navigate().GoToUrl("http://localhost:5173/user/mybookings");
        var myCardsCollection = _driver.FindElements(By.CssSelector(".exercise-list .booking-card-wrapper"));
        var myFirstCard = myCardsCollection.First();
        var myWorkoutName = myFirstCard.FindElement(By.TagName("h3")).Text;
        myWorkoutName.Should().NotBeNullOrEmpty();

        myWorkoutName.Should().Be(workoutName);
    }

}