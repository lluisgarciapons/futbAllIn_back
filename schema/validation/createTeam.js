const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.short_name = !isEmpty(data.short_name) ? data.short_name : "";
  data.avatar = !isEmpty(data.avatar) ? data.avatar : "";

  if (!Validator.isLength(data.name, { min: 3, max: 20 })) {
    errors.name = "Name must be between 3 and 20 characters";
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }

  if (!Validator.isLength(data.short_name, { min: 3, max: 3 })) {
    errors.short_name = "Acronym must be exactly 3 characters long";
  }

  if (Validator.isEmpty(data.short_name)) {
    errors.short_name = "Acronym field is required";
  }

  if (Validator.isEmpty(data.avatar)) {
    errors.avatar = "Please choose an avatar for your team";
  }

  return {
    errors: errors,
    isValid: isEmpty(errors)
  };
};
