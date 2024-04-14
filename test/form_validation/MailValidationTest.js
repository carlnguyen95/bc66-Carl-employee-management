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
describe("Name Validation tests", function () {
  let driver;
  let validAccount = "12345";
  let validName = "Karl Maynar";
  let validMail = "email@email.com";
  let validPassword = "Pa$$w0rd";
  let validDay = "04/04/2023";
  let validSalary = "20000000";
  let validPosition = {
    title: "Trưởng phòng",
    value: "2",
  };
  let validWorkingHour = "180";
  let nameInput;
  const specialCharacters = [
    "!",
    "@",
    "#",
    "$",
    "%",
    "^",
    "&",
    "*",
    "(",
    ")",
    "-",
    "+",
    "=",
    ">",
    "<",
    ",",
    ".",
  ];

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
    driver.findElement(By.id("tknv")).sendKeys(validAccount);
    driver.findElement(By.id("name")).sendKeys(validName);
    driver.findElement(By.id("email")).sendKeys(validMail);
    driver.findElement(By.id("password")).sendKeys(validPassword);
    driver.findElement(By.id("datepicker")).sendKeys(validDay);
    driver.findElement(By.id("luongCB")).sendKeys(validSalary);
    let postionOption = driver.findElement(By.id("chucvu"));
    let positionSelect = new Select(postionOption);
    await positionSelect.selectByValue(validPosition.value);
    driver.findElement(By.id("gioLam")).sendKeys(validWorkingHour);

    nameInput = await driver.findElement(By.id("name"));
  });

  it("Success adding case", async function () {
    // Resolves Promise and returns boolean value
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
    result = await deleteBtn.isDisplayed();
    assert.equal(result, true);
  });

  it("Name input is blank or has only space", async function () {
    let randomLength = Math.round(Math.random() * 3);
    let errName = "";
    while (randomLength > 0) {
      errName += " ";
      randomLength--;
    }
    await nameInputErr(errName);
  });

  it("Name has special characters", async function () {
    let errName = [...validName]; //String to array
    let randomIndex = Math.round(
      Math.random() * (specialCharacters.length - 1)
    );
    let specialChar = specialCharacters[randomIndex];
    randomIndex = Math.round(Math.random() * (errName.length - 1));
    errName[randomIndex] = specialChar;
    errName = errName.join("");
    await nameInputErr(errName);
  });

  it("Name has number", async function () {
    let errName = [...validName]; //String to array
    let randomNumber = Math.round(Math.random() * 9);
    let randomIndex = Math.round(Math.random() * (errName.length - 1));
    errName[randomIndex] = randomNumber;
    errName = errName.join("");
    await nameInputErr(errName);
  });

  it("Name has mixed characters", async function () {
    let errName = [...validName]; //String to array
    let randomIndex = Math.round(Math.random() * 4);
    errName[randomIndex] = "#";
    randomIndex = Math.round(Math.random() * 4);
    errName[randomIndex] = "9";
    errName = errName.join("");
    await nameInputErr(errName);
  });

  async function nameInputErr(errName) {
    nameInput.clear();
    await nameInput.sendKeys(errName);
    await driver.findElement(By.id("btnThemNV")).click();
    let nameTb = await driver.findElement(By.css("#tbTen")).getText();
    assert.equal(nameTb, "Name must contains only letters and not blank");
  }

  after(async () => await driver.quit());
});
