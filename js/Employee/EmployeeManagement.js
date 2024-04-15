import { Employee } from "./Employee.js";
import { InvalidAccountError, InvalidMailError } from "./InvalidInfoErrors.js";

export class EmployeeManagement {
  /*** Private Fields ***/
  #EmployeeList = [];
  name = "";
  /*** END Private Fields ***/

  constructor(name = "EmployeeManagement") {
    const data = localStorage.getItem("DSNV");
    let EmployeesJson = data !== null ? JSON.parse(data) : [];
    this.#EmployeeList = EmployeesJson.map((employeeInfo) => {
      return new Employee(employeeInfo);
    });
    this.name = name;
  }

  getEmployeeList() {
    return this.#EmployeeList;
  }

  checkDuplicate(info, onlyMail = false) {
    this.#EmployeeList.forEach((employee) => {
      if (!onlyMail) {
        if (employee.getAccount() === info.account)
          throw new InvalidAccountError(
            "This account exists. Please input another one",
          );
      }
      //Check if there is an account registered with this mail
      if (
        employee.getMail() === info.mail &&
        employee.getAccount() !== info.account
      )
        throw new InvalidMailError(
          "This mail exists. Please input another one",
        );
    });
  }

  saveLocal() {
    const EmployeesJson = JSON.stringify(
      this.#EmployeeList.map((employee) => {
        return employee.getInfo();
      }),
    );
    localStorage.setItem("DSNV", EmployeesJson);
  }

  validateAddEmployee(info) {
    this.checkDuplicate(info);
    const newEmployee = new Employee(info); //validate form and throw errors here
    this.#EmployeeList.push(newEmployee);
    this.saveLocal();
  }

  updateEmployeeByIndex(index, info) {
    if (!this.#EmployeeList.hasOwnProperty(index)) {
      console.error(`EmployeeList doesn't have the index ${index}`);
      return;
    }
    this.checkDuplicate(info);
    let updateEmployee = new Employee(info);
    this.#EmployeeList[index] = updateEmployee;
  }

  updateEmployee(info) {
    const index = this.searchIndexOfEmployees("account", info.account);
    this.checkDuplicate(info, true);
    const newEmployee = new Employee(info);
    this.#EmployeeList[index] = newEmployee;
    this.saveLocal();
  }

  removeEmployee(account) {
    const index = this.searchIndexOfEmployees("account", account);

    if (index.length === 1) {
      this.#EmployeeList.splice(index, 1);
      this.saveLocal();
    } else {
      throw new Error(`Can't find the employee with account number ${account}`);
    }
  }

  searchIndexOfEmployees(type, searchKey) {
    let indexArr = [];
    for (let i in this.#EmployeeList) {
      const info = this.#EmployeeList[i].getInfo();
      if (!info.hasOwnProperty(type))
        throw new Error(`"${type}" is an invalid search type`);
      if (type === "position") {
        if (info[type].title === searchKey) {
          indexArr.push(i);
        }
      } else {
        if (info[type] === searchKey) {
          indexArr.push(i);
        }
      }
    }

    //Double-check if there is duplicate mail/account
    if (type === "account" || type === "mail") {
      if (indexArr.length > 1)
        throw new Error(
          `There are ${indexArr.length} with same ${type} in EmployeeList`,
        );
    }

    return indexArr;
  }

  partialSearchIndexOfEmployees(type, searchKey) {
    let indexArr = [];
    for (let i in this.#EmployeeList) {
      const info = this.#EmployeeList[i].getInfo();
      if (!info.hasOwnProperty(type))
        throw new Error(`"${type}" is an invalid search type`);
      if (type === "position") {
        if (info[type].title.search(searchKey) != -1) {
          indexArr.push(i);
        }
      } else {
        if (info[type].search(searchKey) != -1) {
          indexArr.push(i);
        }
      }
    }

    return indexArr;
  }

  searchInfoEmployee(type, searchKey) {
    let info = {};
    const indexArr = this.searchIndexOfEmployees(type, searchKey);
    indexArr.forEach((index) => {
      info[index] = this.#EmployeeList[index];
    });

    /**
     * Don't have to check duplicate for account or array since searchIndexOfEmployee did it
     */
    return info;
  }

  partialSearchInfoEmployee(type, searchKey) {
    let info = [];

    const indexArr = this.partialSearchIndexOfEmployees(type, searchKey);
    indexArr.forEach((index) => {
      info.push(this.#EmployeeList[index]);
    });

    return info;
  }
}
