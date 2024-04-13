const { By, Builder, Browser, Select } = require("selenium-webdriver");
const assert = require("assert");

/**
 * FLOW
 * 1. Access website
 * 2. Push "Them nhan vien" button
 * 3. Fill all valid info except account
 * 4. Fill account with test data
 *
 * CHECKPOINT:
 * 1. Wrong format
 * 2. Successful add action status
 * 3. Data are shown correctly in the table
 * 4. Button delete and update displayed
 */
describe("Account Validation tests", function () {
  let driver;
  let validName = "ABC";
  let validMail = "email@email.com";
  let validPassword = "Pa$$w0rd";
  let validDay = "04/04/2023";
  let validSalary = "20000000";
  let validPosition = {
    title: "Trưởng phòng",
    value: "2",
  };
  let validWorkingHour = "180";

  before(async function () {
    driver = await new Builder().forBrowser("chrome").build();
  });

  beforeEach(async () => {
    await driver.get("http://127.0.0.1:5501/");
    await driver.manage().setTimeouts({ implicit: 500 });
    let addBtn = driver.findElement(By.id("btnThem"));
    await addBtn.click();
    await driver.manage().setTimeouts({ implicit: 500 }); //Wait 0.5s
    driver.findElement(By.id("name")).sendKeys(validName);
    driver.findElement(By.id("email")).sendKeys(validMail);
    driver.findElement(By.id("password")).sendKeys(validPassword);
    driver.findElement(By.id("datepicker")).sendKeys(validDay);
    driver.findElement(By.id("luongCB")).sendKeys(validSalary);
    let postionOption = driver.findElement(By.id("chucvu"));
    let positionSelect = new Select(postionOption);
    await positionSelect.selectByValue(validPosition.value);
    driver.findElement(By.id("gioLam")).sendKeys(validWorkingHour);
  });

  it("PASS case", async function () {
    // Resolves Promise and returns boolean value
    let accountInput = await driver.findElement(By.id("tknv"));
    await accountInput.sendKeys("12345");
    await driver.findElement(By.id("btnThemNV")).click();

    let status = await driver
      .findElement(By.className("modal-status"))
      .getText();
    assert.equal(status, "Tạo nhân viên mới thành công");
    await driver.findElement(By.id("btnDong")).click();
    await driver.manage().setTimeouts({ implicit: 500 }); //Wait 0.5s
    let row = await driver.findElement(By.css("#tableDanhSach tr:last-child"));
    let account = await row.findElement(By.css("td:first-child")).getText();
    assert.equal(account, "12345");
    let name = await row.findElement(By.css("td:nth-child(2)")).getText();
    assert.equal(name, validName);
    let mail = await row.findElement(By.css("td:nth-child(3)")).getText();
    assert.equal(mail, validMail);
    let day = await row.findElement(By.css("td:nth-child(4)")).getText();
    assert.equal(day, validDay);
    let position = await row.findElement(By.css("td:nth-child(5)")).getText();
    assert.equal(position, validPosition.title);
    let salary = await row.findElement(By.css("td:nth-child(6)")).getText();
    assert.equal(salary, validPosition.value * validSalary);
    let updateBtn = await row.findElement(By.css(".update-btn"));
    let result = await updateBtn.isDisplayed();
    assert.equal(result, true);
    let deleteBtn = await row.findElement(By.css(".delete-btn"));
    result = await updateBtn.isDisplayed();
    assert.equal(result, true);
  });

  after(async () => await driver.quit());
});
