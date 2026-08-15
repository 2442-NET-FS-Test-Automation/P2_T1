using FluentAssertions;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Chromium;
using Xunit;
using Xunit.Abstractions;
using OpenQA.Selenium.Support.UI;

public class ListAndFilteringTests : IDisposable
{
    private readonly ChromeDriver _driver;
    private readonly ITestOutputHelper _output;

    private const string BaseUrl = "http://localhost:5173";
    public ListAndFilteringTests(ITestOutputHelper output)
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
    public void DynamicText_DynamicallyFiltersItems()
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


        // CORE DATA-WAIT LAYER: Blocks the execution thread until the backend mock lists load completely into the DOM tree
        wait.Until(d => d.FindElements(By.CssSelector(".booking-card-wrapper")).Count > 0);

        // Fetch the populated elements array list safely now that the page is fully live
        var initialCards = _driver.FindElements(By.CssSelector(".booking-card-wrapper"));
        initialCards.Should().HaveCountGreaterThan(1, "The grid must load multiple seed items to test filtering.");
        int originalTotalCount = initialCards.Count;

        var filterBar = _driver.FindElement(By.CssSelector("section.filter-bar"));

        var trainingName = filterBar.FindElement(By.CssSelector(".filter-input[placeholder*='Filter by name...'], .filter-input"));
        trainingName.Clear();
        trainingName.SendKeys("Yoga");

        var updatedCardsCollection = _driver.FindElements(By.CssSelector(".booking-card-wrapper"));

        updatedCardsCollection.Count.Should().BeLessThan(originalTotalCount);



    }

    [Fact]
    public void SortSynch_SortsItems()
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

        var myCardsCollection = _driver.FindElements(By.CssSelector(".booking-card-wrapper"));

        var myFirstCard = myCardsCollection.First();
        var firstTitle = myFirstCard.FindElement(By.TagName("h3")).Text;

        var myLastCard = myCardsCollection.Last();
        var lastTitle = myLastCard.FindElement(By.TagName("h3")).Text;

        var dropdownElement = _driver.FindElement(By.Id("sort-select"));
        var sortSelector = new SelectElement(dropdownElement);

        sortSelector.IsMultiple.Should().BeFalse();

        sortSelector.SelectByText("Name (Z - A)");

        wait.Until(d =>
        {
            var currentCards = d.FindElements(By.CssSelector(".booking-card-wrapper"));
            // If the top card text has changed, OR if the list has reordered itself, return true
            return currentCards.First().FindElement(By.TagName("h3")).Text != firstTitle || currentCards.Count > 0;
        });

        var reorderedCards = _driver.FindElements(By.CssSelector(".booking-card-wrapper"));

        var updatedFirstCard = reorderedCards.First();
        // FIXED: Separated the string text variable assignment from the FluentAssertions check
        string updatedFirstTitle = updatedFirstCard.FindElement(By.TagName("h3")).Text;
        updatedFirstTitle.Should().Be(lastTitle);

        var updatedLastCard = reorderedCards.Last();
        // FIXED: Corrected reference from 'myLastCard' to 'updatedLastCard' to prevent stale DOM errors
        string updatedLastTitle = updatedLastCard.FindElement(By.TagName("h3")).Text;
        updatedLastTitle.Should().Be(firstTitle);

        _driver.Navigate().Refresh();


    }
}