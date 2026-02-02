import { Router } from "express";
import {
  createSubTask,
  createTask,
  deleteSubTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateSubTask,
  updateTask,
} from "../controllers/task.controllers.js";
import {
  validateProjectPermission,
  verifyJWT,
} from "../middlewares/auth.middleware.js";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
  createSubTaskValidator,
  createTaskValidator,
  mongoIdPathVariableValidator,
  updateSubTaskValidator,
  updateTaskValidator,
} from "../validators/index.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyJWT);

router
  .route("/:projectId")
  .get(
    mongoIdPathVariableValidator("projectId"),
    validate,
    validateProjectPermission(AvailableUserRole),
    getTasks,
  )
  .post(
    validateProjectPermission([
      UserRolesEnum.ADMIN,
      UserRolesEnum.PROJECT_ADMIN,
    ]),
    upload.array("attachments", 10),
    mongoIdPathVariableValidator("projectId"),
    createTaskValidator(),
    validate,
    createTask,
  );

router
  .route("/:projectId/t/:taskId")
  .get(
    validateProjectPermission(AvailableUserRole),
    mongoIdPathVariableValidator("taskId"),
    validate,
    getTaskById,
  )
  .put(
    validateProjectPermission([
      UserRolesEnum.ADMIN,
      UserRolesEnum.PROJECT_ADMIN,
    ]),
    mongoIdPathVariableValidator("taskId"),
    updateTaskValidator(),
    validate,
    updateTask,
  )
  .delete(
    validateProjectPermission([
      UserRolesEnum.ADMIN,
      UserRolesEnum.PROJECT_ADMIN,
    ]),
    mongoIdPathVariableValidator("taskId"),
    validate,
    deleteTask,
  );

router
  .route("/:projectId/t/:taskId/subtasks")
  .post(
    validateProjectPermission([
      UserRolesEnum.ADMIN,
      UserRolesEnum.PROJECT_ADMIN,
    ]),
    mongoIdPathVariableValidator("taskId"),
    createSubTaskValidator(),
    validate,
    createSubTask,
  );

router
  .route("/:projectId/st/:subTaskId")
  .put(
    validateProjectPermission(AvailableUserRole),
    mongoIdPathVariableValidator("subTaskId"),
    updateSubTaskValidator(),
    validate,
    updateSubTask,
  )
  .delete(
    validateProjectPermission([
      UserRolesEnum.ADMIN,
      UserRolesEnum.PROJECT_ADMIN,
    ]),
    mongoIdPathVariableValidator("subTaskId"),
    validate,
    deleteSubTask,
  );

export default router;
