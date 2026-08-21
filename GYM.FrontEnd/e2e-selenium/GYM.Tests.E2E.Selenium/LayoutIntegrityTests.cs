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

    public LayoutIntegrityTests(ITestOutputHelper output)
    {

        _output = output;

        var options = new ChromeOptions();
        options.AddArgument("--headless=new");
        options.AddArgument("--window-size=1280,900");

        _driver = new ChromeDriver(options);
        _driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(3);
    }

    public void Dispose()
    {
        _driver.Quit();
    }

    [Fact]
    public void MobileViewport_StacksButtonsAndMaintainsReadability()
    {
        _driver.Manage().Cookies.DeleteAllCookies();
        _driver.Navigate().GoToUrl($"{BaseUrl}/login");
        var username = _driver.FindElement(By.CssSelector("form.login-form input[type='email']"));
        var password = _driver.FindElement(By.CssSelector("form.login-form input[type='password']"));
        var submit = _driver.FindElement(By.CssSelector("form.login-form button[type='submit']"));

        username.SendKeys("user@test.com");
        password.SendKeys("1234");
        submit.Click();

        var wait = new WebDriverWait(_driver, TimeSpan.FromSeconds(5));
        wait.Until(d => !d.Url.Contains("/login"));
        _driver.Manage().Window.Size = new System.Drawing.Size(375, 667);

        _driver.Navigate().GoToUrl($"{BaseUrl}/user/mybookings");
        wait.Until(d => d.FindElements(By.CssSelector(".booking-card-wrapper")).Count > 0);

        var firstCard = _driver.FindElements(By.CssSelector(".booking-card-wrapper")).First();
        var buttonWrapper = firstCard.FindElement(By.CssSelector(".card-button-wrapper"));

        buttonWrapper.GetCssValue("flex-direction").Should().Be("column",
            "Under narrow viewports, buttons must stack vertically to prevent text clipping.");

        var exerciseTrackButton = buttonWrapper.FindElement(By.CssSelector("button.secondary"));
        exerciseTrackButton.Displayed.Should().BeTrue();
        exerciseTrackButton.Text.Should().Contain("Track Exercises ➔");
    }

    [Fact]
    public void DetailsDrawer_TogglesExpansionAndExposesHiddenContent()
    {
        _driver.Manage().Cookies.DeleteAllCookies();
        _driver.Navigate().GoToUrl($"{BaseUrl}/login");
        var username = _driver.FindElement(By.CssSelector("form.login-form input[type='email']"));
        var password = _driver.FindElement(By.CssSelector("form.login-form input[type='password']"));
        var submit = _driver.FindElement(By.CssSelector("form.login-form button[type='submit']"));

        username.SendKeys("user@test.com");
        password.SendKeys("1234");
        submit.Click();

        var wait = new WebDriverWait(_driver, TimeSpan.FromSeconds(5));
        wait.Until(d => !d.Url.Contains("/login"));

        _driver.Manage().Window.Size = new System.Drawing.Size(1280, 900);

        _driver.Navigate().GoToUrl($"{BaseUrl}/user/mybookings");
        wait.Until(d => d.FindElements(By.CssSelector(".booking-card-wrapper")).Count > 0);

        var targetCardWrapper = _driver.FindElements(By.CssSelector(".booking-card-wrapper")).First();
        var drawerElement = targetCardWrapper.FindElement(By.CssSelector(".booking-card-drawer"));

        targetCardWrapper.GetAttribute("class").Should().NotContain("expanded",
            "The collapsible drawer container must not possess the expanded helper class name string on baseline initialization.");

        var detailsButton = targetCardWrapper.FindElement(By.CssSelector(".card-button-wrapper button.secondary:not([style*='border'])"));

        detailsButton.Should().NotBeNull("The Details action controller element must mount safely onto the card frame.");
        detailsButton?.Text.Should().Be("Details");
        detailsButton.Click();

        wait.Until(d => targetCardWrapper.GetAttribute("class").Contains("expanded"));


        wait.Until(d =>
        {
            var elements = d.FindElements(By.CssSelector(".drawer-description h5"));
            return elements.Count > 0 && elements.First().Displayed;
        });

        var drawerDescriptionHeader = targetCardWrapper.FindElement(By.CssSelector(".drawer-description h5"));
        drawerDescriptionHeader.Text.Should().Be("ABOUT THIS WORKOUT");
        drawerDescriptionHeader.Displayed.Should().BeTrue();
    }
}
