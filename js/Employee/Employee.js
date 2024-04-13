import {
  InvalidAccountError,
  InvalidNameError,
  InvalidMailError,
  InvalidPasswordError,
  InvalidStartDayError,
  InvalidPositionError,
  InvalidSalaryError,
  InvalidWorkingHourError,
} from "./InvalidInfoErrors.js";

const EMPLOYEE_CLASSES = {
  OUTSTANDING: "Xuất sắc",
  VERYGOOD: "Rất tốt",
  GOOD: "Tốt",
  AVERAGE: "Khá",
};

const POSITION = {
  MANAGER: {
    value: 3,
    title: "Sếp",
  },
  HEAD_DEPT: {
    value: 2,
    title: "Trưởng phòng",
  },
  STAFF: {
    value: 1,
    title: "Nhân viên",
  },
};

export class Employee {
  /*** Private Fields ***/
  #account = "";
  #name = "";
  #mail = "";
  #password = "";
  #startDay = "";
  #position = "";
  #salary = 0;
  #workingHour = 0;
  #totalSalary = 0;
  #classification = EMPLOYEE_CLASSES.AVERAGE;
  /*** END Private Fields ***/

  constructor(info) {
    this.validate(info);
  }

  /*** Methods ***/
  /**
   * Validate then set the fields if valid
   * @param {*} info includes fields: account, name, mail, password, startDay, position, salary, workingHour
   */
  validate(info) {
    this.setAccount(info.account);
    this.setName(info.name);
    this.setMail(info.mail);
    this.setPassword(info.password);
    this.setStartDay(info.startDay);
    this.setSalary(info.salary);
    this.setPosition(info.position);
    this.setWorkingHour(info.workingHour);

    this.calTotalSalary();
    this.classify();
  }

  getInfo() {
    const info = {
      account: this.getAccount(),
      name: this.getName(),
      mail: this.getMail(),
      password: this.getPassword(),
      startDay: this.getStartDay(),
      salary: this.getSalary(),
      position: this.getPosition(),
      workingHour: this.getWorkingHour(),
      totalSalary: this.getTotalSalary(),
      class: this.getClassification(),
    };

    return info;
  }

  isAccountValid(account) {
    if (
      account.length < 4 ||
      account.length > 6 ||
      account.match(/[^0-9]/g) !== null
    )
      return false;

    return true;
  }

  setAccount(account) {
    if (!this.isAccountValid(account)) {
      throw new InvalidAccountError();
    }
    this.#account = `${account}`;
  }

  getAccount() {
    return this.#account;
  }

  isNameValid(name) {
    if (
      name.length === 0 ||
      name.match(/[^a-zA-Z\s]/g) !== null ||
      name.match(/^\s*$/) !== null
    )
      return false;

    return true;
  }

  setName(name) {
    if (!this.isNameValid(name)) {
      throw new InvalidNameError();
    }
    this.#name = name;
  }

  getName() {
    return this.#name;
  }

  isMailValid(mail) {
    if (mail.length === 0 || mail.match(/@/g) === null) return false;

    let arr = mail.split("@");
    if (arr.length > 2) return false;

    let prefix = arr[0];
    let domains = arr[1];
    /**
     * PREFIX
     * Only letters, numbers, "-" or "_" or "."
     * Can't start with special characters
     * Special characters must be followed by one or more letters or numbers
     */
    if (
      prefix.match(/[^a-zA-Z0-9_\-\.]/g) !== null ||
      prefix.match(/(^[_\-\.]|[_\-\.]$)/) !== null ||
      prefix.match(/[_\-\.][^a-zA-Z0-9]/) !== null
    )
      return false;

    /**
     * DOMAIN
     * Only letters, numbers, "-" or "."
     * Contain at least one "."
     * Last portion of the domain must be at least two characters
     */
    if (
      domains.match(/[^a-zA-Z0-9\-\.]/) !== null ||
      domains.match(/\./) === null
    )
      return false;

    arr = domains.split(".");
    let lastPortion = arr[arr.length - 1];
    if (lastPortion.length < 2) return false;

    return true;
  }

  setMail(mail) {
    if (!this.isMailValid(mail)) {
      throw new InvalidMailError();
    }
    this.#mail = mail;
  }

  getMail() {
    return this.#mail;
  }

  /**
   * Valid password has:
   * 1. 6-10 characters
   * 2. At least One number
   * 3. At least One upper letter
   * 4. At least One speacial character
   * @param {*} password string
   * @returns
   */
  isPasswordValid(password) {
    if (
      password.length < 6 ||
      password.length > 10 ||
      password.match(/[0-9]/) === null ||
      password.match(/[A-Z]/) === null ||
      password.match(/[^a-zA-Z0-9]/) === null
    )
      return false;

    return true;
  }

  setPassword(password) {
    if (!this.isPasswordValid(password)) {
      throw new InvalidPasswordError();
    }
    this.#password = password;
  }

  getPassword() {
    return this.#password;
  }

  isStartDayValid(startDay) {
    //TODO
    //Check format
    const day = new Date(`${startDay}`);
    if (day.toString() === "Invalid Date") return false;

    //The set day can't be in the future
    if (Date.now() - day.getTime() < 0) return false;

    return true;
  }

  setStartDay(startDay) {
    if (!this.isStartDayValid(startDay)) {
      throw new InvalidStartDayError();
    }
    this.#startDay = startDay;
  }

  getStartDay() {
    return this.#startDay;
  }

  isPositionValid(position) {
    for (let i in POSITION) {
      if (Number(position.value) === POSITION[i].value) {
        return true;
      }
    }

    return false;
  }

  setPosition(position) {
    if (!this.isPositionValid(position)) {
      throw new InvalidPositionError();
    }
    for (let i in POSITION) {
      if (Number(position.value) === POSITION[i].value)
        this.#position = POSITION[i];
    }
  }

  getPosition() {
    return this.#position;
  }

  isSalaryValid(salary) {
    if (typeof salary == "number") salary = salary.toString();
    if (
      salary.length === 0 ||
      salary.match(/[^0-9]/) !== null ||
      salary * 1 < 1000000 ||
      salary * 1 > 20000000
    )
      return false;

    return true;
  }

  setSalary(salary) {
    if (!this.isSalaryValid(salary)) {
      throw new InvalidSalaryError();
    }
    this.#salary = salary * 1;
  }

  getSalary() {
    return this.#salary;
  }

  isWorkingHourValid(workingHour) {
    if (typeof workingHour == "number") workingHour = workingHour.toString();
    if (
      workingHour.length === 0 ||
      workingHour.match(/[^0-9\.]/) !== null ||
      workingHour * 1 < 80 ||
      workingHour * 1 > 200
    )
      return false;

    return true;
  }

  setWorkingHour(workingHour) {
    if (!this.isWorkingHourValid(workingHour)) {
      throw new InvalidWorkingHourError();
    }
    this.#workingHour = workingHour * 1;
  }

  getWorkingHour() {
    return this.#workingHour;
  }

  calTotalSalary() {
    this.#totalSalary = this.#salary * this.#position.value;
  }

  getTotalSalary() {
    return this.#totalSalary;
  }

  classify() {
    const time = parseFloat(this.#workingHour);
    if (this.#workingHour < 160)
      this.#classification = EMPLOYEE_CLASSES.AVERAGE;
    else if (this.#workingHour < 176)
      this.#classification = EMPLOYEE_CLASSES.GOOD;
    else if (this.#workingHour < 192)
      this.#classification = EMPLOYEE_CLASSES.VERYGOOD;
    else this.#classification = EMPLOYEE_CLASSES.OUTSTANDING;
  }

  getClassification() {
    return this.#classification;
  }

  /*** END Methods ***/
}
