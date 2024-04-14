const { By, Builder, Browser, Select } = require("selenium-webdriver");
const assert = require("assert");

/**
 * FLOW
 * 1. Access website
 * 2. Push "Them nhan vien" button
 * 3. Fill all valid info
 * 4. Fill test fields with test data
 *
 * CHECKPOINT:
 * 1. Wrong format
 * 2. Successful add action status
 * 3. Data are shown correctly in the table
 * 4. Button delete and update displayed
 */
describe("Password Validation tests", function () {
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
  let mailInput;
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

    passwordInput = await driver.findElement(By.id("password"));
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
    assert.equal(account, validAccount);
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

  it("Password input is blank or has only space", async function () {
    let randomLength = Math.round(Math.random() * 3);
    let invalidPassword = "";
    while (randomLength > 0) {
      invalidPassword += " ";
      randomLength--;
    }
    await passwordInputErr(invalidPassword);
  });

  it("Password doesn't have any number", async function () {
    const invalidPassword = validPassword.replace("0", "o");
    passwordInputErr(invalidPassword);
  });

  it("Password doesn't have special character", async function () {
    const invalidPassword = validPassword.replaceAll("$", "s");
    passwordInputErr(invalidPassword);
  });

  it("Password doesn't have uppercase", async function () {
    const invalidPassword = validPassword.replaceAll("P", "p");
    passwordInputErr(invalidPassword);
  });

  it("Password with valid format but have less than 6 characters", async function () {
    const invalidPassword = "Pa$0";
    passwordInputErr(invalidPassword);
  });

  it("Password with valid format but have more than 10 characters", async function () {
    const invalidPassword = validPassword.concat("abcd");
    passwordInputErr(invalidPassword);
  });

  it("Random Password with valid format", async function () {
    let arr = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "k"];
    let randomLength = Math.round(Math.random() * 4 + 6);
    arr = arr.slice(0, randomLength);
    let randomNumberOfSC = Math.round(Math.random() * (arr.length - 2) + 1);
    for (let i = 0; i < randomNumberOfSC; i++) {
      let randomIndex = Math.round(Math.random() * (arr.length - 1));
      arr[randomIndex] = specialCharacters[randomIndex];
    }
    let randomNumberOfNum = Math.round(
      Math.random() * (arr.length - randomNumberOfSC - 1) + 1
    );
    for (let i = 0; i < randomNumberOfNum; i++) {
      let randomIndex = Math.round(Math.random() * (arr.length - 1));
      while (specialCharacters.indexOf(arr[randomIndex]) != -1)
        randomIndex = Math.round(Math.random() * (arr.length - 1));
      arr[randomIndex] = Math.round(Math.random() * 9);
    }
    let randomNumberOfUppercase =
      arr.length - randomNumberOfNum - randomNumberOfSC;
    for (let i = 0; i < randomNumberOfUppercase; i++) {
      let randomIndex = Math.round(Math.random() * (arr.length - 1));
      while (
        specialCharacters.indexOf(arr[randomIndex]) != -1 ||
        typeof arr[randomIndex] == "number"
      ) {
        randomIndex = Math.round(Math.random() * (arr.length - 1));
      }
      arr[randomIndex] = "P";
    }
    let pass = arr.join("");
    console.log(pass);
    passwordInput.clear();
    passwordInput.sendKeys(pass);
    await driver.findElement(By.id("btnThemNV")).click();

    let status = await driver
      .findElement(By.className("modal-status"))
      .getText();
    assert.equal(status, "Tạo nhân viên mới thành công");
  });

  async function passwordInputErr(errPassword) {
    passwordInput.clear();
    await passwordInput.sendKeys(errPassword);
    await driver.findElement(By.id("btnThemNV")).click();
    let passwordTb = await driver.findElement(By.css("#tbMatKhau")).getText();
    assert.equal(
      passwordTb,
      "Password must contains 6-10 characters, at least one number, one uppercase, one special character"
    );
    driver.findElement(By.css("#btnDong")).click();
  }

  after(async () => await driver.quit());
});
