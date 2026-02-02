import { body, param } from "express-validator";
import { AvailableUserRole, AvailableTaskStatus } from "../utils/constants.js";

const userRegisterValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLowercase()
      .withMessage("Username must be in lower case")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters long"),
    body("password").trim().notEmpty().withMessage("Password is required"),
    body("fullName").optional().trim(),
  ];
};

const userLoginValidator = () => {
  return [
    body("email").optional().isEmail().withMessage("Email is invalid"),
    body("password").notEmpty().withMessage("Password is required"),
  ];
};

const userChangeCurrentPasswordValidator = () => {
  return [
    body("oldPassword").notEmpty().withMessage("Old password is required"),
    body("newPassword").notEmpty().withMessage("New password is required"),
  ];
};

const userForgotPasswordValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
  ];
};

const userResetForgotPasswordValidator = () => {
  return [
    body("newPassword").notEmpty().withMessage("New password is required"),
  ];
};

const createProjectValidator = () => {
  return [
    body("name").trim().notEmpty().withMessage("Project name is required"),
    body("description").optional().trim(),
  ];
};

const addMembertoProjectValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .isEmail()
      .withMessage("Valid email is required"),
    body("role").optional().isIn(AvailableUserRole).withMessage("Invalid role"),
  ];
};

const mongoIdPathVariableValidator = (idName) => {
  return [
    param(idName).notEmpty().isMongoId().withMessage(`Invalid ${idName}`),
  ];
};

const createTaskValidator = () => {
  return [
    body("title").trim().notEmpty().withMessage("Task title is required"),
    body("description").optional().trim(),
    body("status")
      .optional()
      .isIn(AvailableTaskStatus)
      .withMessage("Invalid status"),
    body("assignedTo").optional().isMongoId().withMessage("Invalid user ID"),
  ];
};

const updateTaskValidator = () => {
  return [
    body("title")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Task title cannot be empty"),
    body("description").optional().trim(),
    body("status")
      .optional()
      .isIn(AvailableTaskStatus)
      .withMessage("Invalid status"),
    body("assignedTo").optional().isMongoId().withMessage("Invalid user ID"),
  ];
};

const createSubTaskValidator = () => {
  return [
    body("title").trim().notEmpty().withMessage("Subtask title is required"),
  ];
};

const updateSubTaskValidator = () => {
  return [
    body("title")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Subtask title cannot be empty"),
    body("isCompleted")
      .optional()
      .isBoolean()
      .withMessage("isCompleted must be a boolean"),
  ];
};

export {
  userRegisterValidator,
  userLoginValidator,
  userChangeCurrentPasswordValidator,
  userForgotPasswordValidator,
  userResetForgotPasswordValidator,
  createProjectValidator,
  addMembertoProjectValidator,
  mongoIdPathVariableValidator,
  createTaskValidator,
  updateTaskValidator,
  createSubTaskValidator,
  updateSubTaskValidator,
};
