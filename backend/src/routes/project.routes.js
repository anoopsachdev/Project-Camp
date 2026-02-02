import { Router } from "express";
import {
  addMembersToProject,
  createProject,
  deleteMember,
  getProjects,
  getProjectById,
  getProjectMembers,
  updateProject,
  deleteProject,
  updateMemberRole,
} from "../controllers/project.controllers.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
  createProjectValidator,
  addMembertoProjectValidator,
  mongoIdPathVariableValidator,
} from "../validators/index.js";
import {
  verifyJWT,
  validateProjectPermission,
} from "../middlewares/auth.middleware.js";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";

const router = Router();
router.use(verifyJWT);

router
  .route("/")
  .get(getProjects)
  .post(createProjectValidator(), validate, createProject);

router
  .route("/:projectId")
  .get(
    mongoIdPathVariableValidator("projectId"),
    validate,
    validateProjectPermission(AvailableUserRole),
    getProjectById,
  )
  .put(
    validateProjectPermission([UserRolesEnum.ADMIN]),
    mongoIdPathVariableValidator("projectId"),
    createProjectValidator(),
    validate,
    updateProject,
  )
  .delete(
    validateProjectPermission([UserRolesEnum.ADMIN]),
    mongoIdPathVariableValidator("projectId"),
    validate,
    deleteProject,
  );

router
  .route("/:projectId/members")
  .get(mongoIdPathVariableValidator("projectId"), validate, getProjectMembers)
  .post(
    validateProjectPermission([UserRolesEnum.ADMIN]),
    mongoIdPathVariableValidator("projectId"),
    addMembertoProjectValidator(),
    validate,
    addMembersToProject,
  );

router
  .route("/:projectId/members/:userId")
  .put(
    validateProjectPermission([UserRolesEnum.ADMIN]),
    mongoIdPathVariableValidator("projectId"),
    mongoIdPathVariableValidator("userId"),
    validate,
    updateMemberRole,
  )
  .delete(
    validateProjectPermission([UserRolesEnum.ADMIN]),
    mongoIdPathVariableValidator("projectId"),
    mongoIdPathVariableValidator("userId"),
    validate,
    deleteMember,
  );

export default router;
