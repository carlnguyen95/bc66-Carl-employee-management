import { EmployeeManagement } from "./Employee/EmployeeManagement.js";
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
let controller = new EmployeeManagement("controller");

const tblBody = document.querySelector("#tableDanhSach");
const accountInput =  document.querySelector("#tknv");
const nameInput =  document.querySelector("#name");
const mailInput =  document.querySelector("#email");
const passwordInput =  document.querySelector("#password");
const startDayInput =  document.querySelector("#datepicker");
const salaryInput =  document.querySelector("#luongCB");
const positionInput =  document.querySelector("#chucvu");
const workingHourInput =  document.querySelector("#gioLam");
const myModal = document.querySelector("#myModal");
const addBtn = document.querySelector("#btnThem");
const addEmployeeBtn = document.querySelector("#btnThemNV");
const updateEmployeeBtn = document.querySelector("#btnCapNhat");
/*** END Global Var ***/

window.onload = () => {
  renderEmloyeesTable();
}

addBtn.addEventListener("click", () => {
  clearAllFormInput();
  clearAllInvalidNoti();
  clearModalStatus();
  updateEmployeeBtn.classList.add("d-none");
  addEmployeeBtn.classList.remove("d-none");
})

/**
 * Add Employee
 */
addEmployeeBtn.addEventListener("click", () => {
  try {
    const info = packInfo();
    controller.validateAddEmployee(info);
  } catch (err) {
    notifyErr(err);
    return;
  }

  clearAllInvalidNoti();
  renderEmloyeesTable();
});

/**
 * Delete Employee and update on row
 */
tblBody.addEventListener("click", (e) => {
  if (e.target.matches(".delete-btn")) {
    const delBtn = e.target;

    // Get employee info of that row
    const employee = delBtn.parentNode.parentNode;
    const account = employee.querySelector("td").textContent;

    // Find employee in Employess array
    controller.removeEmployee(account);
    renderEmloyeesTable();
  }

  if (e.target.matches(".update-btn")) {
    clearAllInvalidNoti();
    clearModalStatus();
    const updateBtn = e.target;
    // Get employee info of that row
    const employee = updateBtn.parentNode.parentNode;
    const account = employee.querySelector("td").textContent;

    // Find employee with the account, display on form
    const objInfo = controller.searchInfoEmployee("account", account);
    const info = Object.values(objInfo)[0];
    accountInput.value = info.account;
    nameInput.value = info.name;
    mailInput.value = info.mail;
    passwordInput.value = info.password;
    startDayInput.value = info.startDay;
    positionInput.value = info.position.value;
    salaryInput.value = info.salary;
    workingHourInput.value = info.workingHour;
    accountInput.readOnly = true;
    addEmployeeBtn.classList.add("d-none");
    updateEmployeeBtn.classList.remove("d-none");
  }
})

updateEmployeeBtn.addEventListener("click", () => {
  try {
    const info = packInfo();
    controller.updateEmployee(info);
  }
  catch (err) {
    notifyErr(err);
    clearModalStatus();
    return;
  }

  setModalStatus("Cập nhật thành công");
  clearAllInvalidNoti();
  renderEmloyeesTable();
})


/**
 * Get info from the form, pack into object
 * @returns info object
 */
function packInfo() {
  let info = {
    account: `${accountInput.value}`,
    name: `${nameInput.value}`,
    mail: `${mailInput.value}`,
    password: `${passwordInput.value}`,
    startDay: `${startDayInput.value}`,
    salary: `${salaryInput.value}`,
    position: {
      value: `${positionInput.value}`,
      title: `${positionInput.textContent}`,
    },
    workingHour: `${workingHourInput.value}`,
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
    default:
      throw new Error("Unregconized error!!!" + err.message);
  }
}

function displayError(id, message) {
  clearAllInvalidNoti();
  document.querySelector(id).textContent = message;
  document.querySelector(id).style.display = "block";
}

function clearAllInvalidNoti() {
  const allNotification = document.querySelectorAll(".sp-thongbao");
  allNotification.forEach((element) => {
    element.textContent = "";
    element.style.display = "none";
  });
}

/**
 * Render table content when there is update on Employees array
 */
function renderEmloyeesTable() {
  tblBody.innerHTML = "";
  controller.getEmployeeList().forEach((employee) => {
    const info = employee.getInfo();
    const rowContent = `
      <tr>
        <td>${info.account}</td>
        <td>${info.name}</td>
        <td>${info.mail}</td>
        <td>${info.startDay}</td>
        <td>${info.position.title}</td>
        <td>${info.totalSalary}</td>
        <td>${info.class}</td>
        <td>
          <button 
            class="btn btn-success update-btn" 
            data-toggle="modal" 
            data-target="#myModal"
          >Sửa</button>
          <button class="btn btn-danger delete-btn">Xóa</button>
        </td>
      </tr>
    `;
    tblBody.innerHTML += rowContent;
  })
}

function clearAllFormInput() {
  const form = myModal.querySelector("form");
  form.reset();
  accountInput.readOnly = false;
  clearModalStatus();
}

function setModalStatus(message) {
  document.querySelector(".modal-status").textContent = message;
}

function clearModalStatus() {
  document.querySelector(".modal-status").textContent = "";
}