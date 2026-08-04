using FluentAssertions;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Chromium;

public class SmokeTests : IDisposable
{
    //Our first selenium test: 
    //We need on instance of our driver . matched to our browser
    private readonly ChromeDriver _driver;
    public SmokeTests()
    {
        //Option classes : per browser launch config
        //Headless makes it so chrome doesnt pop up
        //we can even tell it things like what window size we want to use
        var options = new ChromeOptions();
        options.AddArgument("--headless=new");
        options.AddArgument("--window-size=1280,900");

        //Creating our driver with the options above
        _driver = new ChromeDriver();

        //We can also use the constructor to configure an implicit wait
        //We will set it so each FindElement(s) retries for up to 2s before
        //failing. Proper explicit waits will be deemed later on
        _driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(2);
    }

    public void Dispose()
    {
        _driver.Quit();
    }

    [Fact]
    public void OpeningTheSpa_ShowsTitleAndHeading()
    {
        //Act - a real navigation in a real browser
        _driver.Navigate().GoToUrl("http://localhost:5173/");

        //Assert - the document title and the header react renders
        _driver.Title.Should().Be("GYM-QUEST");
    }
}
