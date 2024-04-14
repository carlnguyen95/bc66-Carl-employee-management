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
  let validAccount = "12345";
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
  let accountInput;

  before(async function () {
    driver = await new Builder().forBrowser("chrome").build();
  });

  beforeEach(async () => {
    await driver.get("http://127.0.0.1:5501/");
    await driver.executeScript(`window.localStorage.removeItem("DSNV")`);
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
    accountInput = await driver.findElement(By.id("tknv"));
  });

  it("Success adding case", async function () {
    // Resolves Promise and returns boolean value
    let accountInput = await driver.findElement(By.id("tknv"));
    await accountInput.sendKeys(validAccount);
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

  it("Account is duplicated", async function () {
    await accountInput.sendKeys(validAccount);
    await driver.findElement(By.id("btnThemNV")).click();
    await driver.manage().setTimeouts({ implicit: 500 }); //Wait 0.5s
    await driver.findElement(By.id("btnThemNV")).click();
    let accountTb = await driver.findElement(By.css("#tbTKNV")).getText();
    assert.equal(accountTb, "This account exists. Please input another one");
  });

  it("Account has letters", async function () {
    let errAcc = [...validAccount]; //String to array
    let randomIndex = Math.round(Math.random() * 4);
    errAcc[randomIndex] = "A";
    errAcc = errAcc.join("");
    await accountInputErr(errAcc);
  });

  it("Account has special characters", async function () {
    let errAcc = [...validAccount]; //String to array
    let randomIndex = Math.round(Math.random() * 4);
    errAcc[randomIndex] = "#";
    errAcc = errAcc.join("");
    await accountInputErr(errAcc);
  });

  it("Account has mixed characters", async function () {
    let errAcc = [...validAccount]; //String to array
    let randomIndex = Math.round(Math.random() * 4);
    errAcc[randomIndex] = "#";
    randomIndex = Math.round(Math.random() * 4);
    errAcc[randomIndex] = "B";
    errAcc = errAcc.join("");
    await accountInputErr(errAcc);
  });

  it("Account input has less than 4 numbers", async function () {
    let randomLength = Math.round(Math.random() * 3);
    let errAcc = "";
    while (randomLength > 0) {
      errAcc += "1";
      randomLength--;
    }
    await accountInputErr(errAcc);
  });

  it("Account input has more than 6 numbers", async function () {
    let errAcc = validAccount.concat("12");
    await accountInputErr(errAcc);
  });

  async function accountInputErr(errAcc) {
    accountInput.clear();
    await accountInput.sendKeys(errAcc);
    await driver.findElement(By.id("btnThemNV")).click();
    let accountTb = await driver.findElement(By.css("#tbTKNV")).getText();
    assert.equal(
      accountTb,
      "Account must contains 4-6 only numbers and not blank"
    );
  }

  after(async () => await driver.quit());
});
