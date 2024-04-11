import { Employee } from "./Employee/Employee.js";
import {
  InvalidAccountError,
  InvalidMailError,
  InvalidNameError,
  InvalidPasswordError,
  InvalidPositionError,
  InvalidSalaryError,
  InvalidStartDayError,
  InvalidWorkingHourError,
} from "./Employee/InvalidInfoErrors.js";

/*** Global Var ***/
let Employees = [];
/*** END Global Var ***/

document.querySelector("#btnThemNV").addEventListener("click", () => {
  try {
    var newEmployee = new Employee(packInfo());
  } catch (err) {
    notifyErr(err);
    return;
  }

  console.log("Valid employee, pushing to Employees...");
  Employees.push(newEmployee.getInfo());
  const EmployeesJson = JSON.stringify(Employees);
  localStorage.setItem("DSNV", EmployeesJson);
});

/**
 * Get info from the form, pack into object
 * @returns info object
 */
function packInfo() {
  let info = {
    account: `${document.querySelector("#tknv").value}`,
    name: `${document.querySelector("#name").value}`,
    mail: `${document.querySelector("#email").value}`,
    password: `${document.querySelector("#password").value}`,
    startDay: `${document.querySelector("#datepicker").value}`,
    salary: `${document.querySelector("#luongCB").value}`,
    position: `${document.querySelector("#chucvu").value}`,
    workingHour: `${document.querySelector("#gioLam").value}`,
  };

  return info;
}

function notifyErr(err) {
  switch (Object.getPrototypeOf(err)) {
    case InvalidAccountError.prototype:
      displayError("#tbTKNV", err.message);
      break;
    case InvalidNameError.prototype:
      displayError("#tbTen", err.message);
      break;
    case InvalidMailError.prototype:
      displayError("#tbEmail", err.message);
      break;
    case InvalidPasswordError.prototype:
      displayError("#tbMatKhau", err.message);
      break;
    case InvalidStartDayError.prototype:
      displayError("#tbNgay", err.message);
      break;
    case InvalidSalaryError.prototype:
      displayError("#tbLuongCB", err.message);
      break;
    case InvalidPositionError.prototype:
      displayError("#tbChucVu", err.message);
      break;
    case InvalidWorkingHourError.prototype:
      displayError("#tbGiolam", err.message);
      break;
  }
}

function displayError(id, message) {
  const allNotification = document.querySelectorAll(".sp-thongbao");
  allNotification.forEach((element) => {
    element.textContent = "";
  });
  document.querySelector(id).textContent = message;
  document.querySelector(id).style.display = "block";
}
