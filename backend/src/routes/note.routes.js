import { Router } from "express";
import {
  createNote,
  deleteNote,
  getNoteById,
  getNotes,
  updateNote,
} from "../controllers/note.controllers.js";
import {
  validateProjectPermission,
  verifyJWT,
} from "../middlewares/auth.middleware.js";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";
import { validate } from "../middlewares/validator.middleware.js";
import { mongoIdPathVariableValidator } from "../validators/index.js";

const router = Router();

router.use(verifyJWT);

router
  .route("/:projectId")
  .get(
    mongoIdPathVariableValidator("projectId"),
    validate,
    validateProjectPermission(AvailableUserRole),
    getNotes,
  )
  .post(
    validateProjectPermission([UserRolesEnum.ADMIN]),
    mongoIdPathVariableValidator("projectId"),
    validate,
    createNote,
  );

router
  .route("/:projectId/n/:noteId")
  .get(
    validateProjectPermission(AvailableUserRole),
    mongoIdPathVariableValidator("noteId"),
    validate,
    getNoteById,
  )
  .put(
    validateProjectPermission([UserRolesEnum.ADMIN]),
    mongoIdPathVariableValidator("noteId"),
    validate,
    updateNote,
  )
  .delete(
    validateProjectPermission([UserRolesEnum.ADMIN]),
    mongoIdPathVariableValidator("noteId"),
    validate,
    deleteNote,
  );

export default router;
