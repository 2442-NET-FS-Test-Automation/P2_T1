using FluentAssertions;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Chromium;
using Xunit;
using Xunit.Abstractions;
using OpenQA.Selenium.Support.UI;

public class userStatsTests : IDisposable
{
    private readonly ChromeDriver _driver;
    private readonly WebDriverWait _wait;
    private readonly ITestOutputHelper _output;
    private const string BaseUrl = "http://localhost:5173";
    public userStatsTests(ITestOutputHelper _output)
    {
        // Option classes: per browser launch config.
        // Headless makes it so chrome doesn't pop up
        // we can even tell it things like what window size we want it to use
        _output = output;

        var options = new ChromeOptions();
        options.AddArgument("--headless=new"); // Runs inside console environment blocks cleanly
        options.AddArgument("--window-size=1280,900");

        _driver = new ChromeDriver(options);
        _driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(3);

        // Explicit wait for SPA element sync
        _wait = new WebDriverWait(_driver, TimeSpan.FromSeconds(10));
    }
    public void Dispose()
    {
        _driver.Quit();
    }

    private void LoginAsUserAndNavigateToStats()
    {
        _driver.Navigate().GoToUrl($"{BaseUrl}/login");

        _driver.FindElement(By.CssSelector("input[placeholder='you@email.com']")).SendKeys("user@test.com");
        _driver.FindElement(By.CssSelector("input[placeholder='••••••••']")).SendKeys("1234");
        
        // Clic en botón de login por texto aproximado/XPath
        _driver.FindElement(By.XPath("//button[contains(text(), 'Log In')]")).Click();

        // Validar redirección exitosa usando FluentAssertions
        _wait.Until(d => !d.Url.Contains("/login"));
        _driver.Url.Should().NotContain("/login");

        // Navegar a la sección de entrenamientos
        _driver.Navigate().GoToUrl($"{BaseUrl}/user/stadistics");
    }

    [Fact]
    public void User_CanCreateStats_Successfully()
    {
        LoginAsUserAndNavigateToStats();

        // Table rows
        var initialTblRows = _driver.FindElements(By.CssSelector(".stats-table tbody tr"));

        // counting table rows
        int originalTotalCount = initialTblRows.Count;

        _driver.FindElement(By.XPath("//button[contains(text(), 'Create new record')]")).Click();

        var modalHeader = _wait.Until(d => d.FindElement(By.XPath("//h5[contains(text(), 'Create new record')]")));
        modalHeader.Displayed.Should().BeTrue();

        // Fill form
        _driver.FindElement(By.Id("weight")).SendKeys("65");
        _driver.FindElement(By.Id("height")).SendKeys("182");
        _driver.FindElement(By.Id("strength")).SendKeys("200");
        _driver.FindElement(By.Id("age")).SendKeys("25");
        _driver.FindElement(By.Id("milerun")).SendKeys("06:10");

        // save
        _driver.FindElement(By.XPath("//button[contains(text(), 'Save record')]")).Click();

        // waits until the number of rows increments
        _wait.Until(d => d.FindElements(By.CssSelector(".stats-table tbody tr")).Count == originalTotalCount + 1);

        var lastRow = _driver.FindElements(By.CssSelector(".stats-table tbody tr")).Last();
        lastRow.Should().Contain("65").And.Contain("182");
    }

    [Fact]
    public void User_CanCreateStats_BadRequest()
    {
        LoginAsUserAndNavigateToStats();

        _driver.FindElement(By.XPath("//button[contains(text(), 'Create new record')]")).Click();

        var modalHeader = _wait.Until(d => d.FindElement(By.XPath("//h5[contains(text(), 'Create new record')]")));
        modalHeader.Displayed.Should().BeTrue();

        _driver.FindElement(By.XPath("//button[contains(text(), 'Save record')]")).Click();

        var toastError = _wait.Until(d => 
        d.FindElement(By.CssSelector(".toast-error, .Toastify__toast--error, .toast.bg-danger"))
        );

        toastError.Displayed.Should().BeTrue();
    }
}