export class InvalidAccountError extends Error {
  constructor(message = "Account must contains 4-6 numbers") {
    super(message);
  }
}

export class InvalidNameError extends Error {
  constructor(message = "Name must contains only letters") {
    super(message);
  }
}

export class InvalidMailError extends Error {
  constructor(message = "Wrong email format") {
    super(message);
  }
}

export class InvalidPasswordError extends Error {
  constructor(
    message = "Password must contains 6-10 characters, at least one number, one uppercase, one special character"
  ) {
    super(message);
  }
}

export class InvalidStartDayError extends Error {
  constructor(message = "Wrong day format (Please follow format mm/dd/yyyy)") {
    super(message);
  }
}

export class InvalidPositionError extends Error {
  constructor(message = "Position must be choosed") {
    super(message);
  }
}

export class InvalidSalaryError extends Error {
  constructor(message = "Salary must be a number between 1mil and 20mil") {
    super(message);
  }
}

export class InvalidWorkingHourError extends Error {
  constructor(message = "Working hour must be a number between 80 and 200") {
    super(message);
  }
}
