using FluentAssertions;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Chromium;
using Xunit;
using Xunit.Abstractions;
using OpenQA.Selenium.Support.UI;

public class TrainerTrainingsTests : IDisposable
{
    private readonly ChromeDriver _driver;
    private readonly WebDriverWait _wait;
    private readonly ITestOutputHelper _output;

    private const string BaseUrl = "http://localhost:5173";

    public TrainerTrainingsTests(ITestOutputHelper output)
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

    private void LoginAsTrainerAndNavigateToTrainings()
    {
        _driver.Navigate().GoToUrl($"{BaseUrl}/login");

        _driver.FindElement(By.CssSelector("input[placeholder='you@email.com']")).SendKeys("trainer@test.com");
        _driver.FindElement(By.CssSelector("input[placeholder='••••••••']")).SendKeys("1234");
        
        // Clic en botón de login por texto aproximado/XPath
        _driver.FindElement(By.XPath("//button[contains(text(), 'Log In')]")).Click();

        // Validar redirección exitosa usando FluentAssertions
        _wait.Until(d => !d.Url.Contains("/login"));
        _driver.Url.Should().NotContain("/login");

        // Navegar a la sección de entrenamientos
        _driver.Navigate().GoToUrl($"{BaseUrl}/admin/trainings");
    }

    [Fact]
    public void Trainer_CanCreateTraining_Successfully()
    {
        // Arrange
        LoginAsTrainerAndNavigateToTrainings();
        string trainingName = "Beginner Fullbody workout Selenium";

        // Act - Abrir modal
        _driver.FindElement(By.XPath("//button[contains(text(), '➕')]")).Click();

        var modalHeader = _wait.Until(d => d.FindElement(By.XPath("//h5[contains(text(), 'Create New Training')]")));
        modalHeader.Displayed.Should().BeTrue();

        // Llenar formulario
        _driver.FindElement(By.CssSelector("input[placeholder='e.g. Upper Body Blast']")).SendKeys(trainingName);
        _driver.FindElement(By.CssSelector("textarea[placeholder='Focus on chest, back and shoulders...']"))
               .SendKeys("Focus on full body, beginner workout");

        // Select de HTML nativo con SelectElement
        var placeSelect = new SelectElement(_driver.FindElement(By.Id("place-input")));
        placeSelect.SelectByText("Gym");

        var difficultyInput = _driver.FindElement(By.CssSelector("input[placeholder='Easy, Medium...']"));
        difficultyInput.Clear();
        difficultyInput.SendKeys("Beginner");

        var caloriesInput = _driver.FindElement(By.CssSelector("[data-cy='calories-input']"));
        caloriesInput.Clear();
        caloriesInput.SendKeys("300");

        var timeInput = _driver.FindElement(By.CssSelector("input[placeholder='00:45:00']"));
        timeInput.Clear();
        timeInput.SendKeys("00:30:00");

        // Selección de Checkboxes
        _driver.FindElement(By.Id("ex-check-1")).Click();
        _driver.FindElement(By.Id("ex-check-2")).Click();

        // Enviar formulario
        _driver.FindElement(By.XPath("//button[contains(text(), 'Create Routine')]")).Click();

        // Assert - Validar en UI que la nueva rutina aparece listada
        var createdCardOrRow = _wait.Until(d => d.FindElement(By.XPath($"//*[contains(text(), '{trainingName}')]")));
        createdCardOrRow.Displayed.Should().BeTrue();
    }

    [Fact]
    public void Trainer_CreateTraining_WithInvalidData_DisplaysErrorOrStaysInModal()
    {
        // Arrange
        LoginAsTrainerAndNavigateToTrainings();

        // Act
        _driver.FindElement(By.XPath("//button[contains(text(), '➕')]")).Click();
        _wait.Until(d => d.FindElement(By.XPath("//h5[contains(text(), 'Create New Training')]")));

        _driver.FindElement(By.CssSelector("input[placeholder='e.g. Upper Body Blast']")).SendKeys("Bad Training");
        
        var caloriesInput = _driver.FindElement(By.CssSelector("[data-cy='calories-input']"));
        caloriesInput.Clear();
        caloriesInput.SendKeys("-300"); // Dato inválido

        _driver.FindElement(By.XPath("//button[contains(text(), 'Create Routine')]")).Click();

        // Assert - En Selenium validamos que el modal siga visible o exista un mensaje de error en pantalla
        var modalHeader = _driver.FindElement(By.XPath("//h5[contains(text(), 'Create New Training')]"));
        modalHeader.Displayed.Should().BeTrue("el modal no debe cerrarse cuando los datos son inválidos");
    }

    [Fact]
    public void Trainer_CanDeleteTraining_AcceptingNativeConfirmAlert()
    {
        // Arrange
        LoginAsTrainerAndNavigateToTrainings();

        // Act - Clic en botón eliminar
        var deleteButton = _wait.Until(d => d.FindElement(By.XPath("//button[contains(text(), '🗑️')]")));
        deleteButton.Click();

        // Manejo de ventana emergente nativa confirm()
        IAlert confirmAlert = _wait.Until(d => d.SwitchTo().Alert());
        
        // Assert en el texto de la alerta con FluentAssertions
        confirmAlert.Text.Should().Contain("¿Estás seguro de que deseas eliminar esta rutina?");
        
        // Aceptar confirmación
        confirmAlert.Accept();
    }
}