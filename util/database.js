const mongoose = require('mongoose');
//Schema
const empSchema = mongoose.Schema({
  //No validations for now
  EMPLOYEE_ID: Number,
  FIRST_NAME: String,
  LAST_NAME: String,
  EMAIL: String,
  PHONE_NUMBER: String,
  HIRE_DATE: String,
  JOB_ID: String,
  SALARY: Number,
  COMMISSION_PCT: String,
  MANAGER_ID: String,
  DEPARTMENT_ID: Number,
});

//Model
const Employee = mongoose.model('Employee', empSchema);
module.exports = Employee;
