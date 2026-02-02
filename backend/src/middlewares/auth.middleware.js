import { User } from "../models/user.models.js";
import { ProjectMember } from "../models/projectmember.models.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken -emailVerificationToken -emailVerficationExpiry",
    );
    // in your decoded token, you have your _id, email and username. because your acccess token was encoded/signed by jwt using user details with a secret.
    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, "Invalid access token");
  }
});

export const validateProjectPermission = (roles = []) => {
  return asyncHandler(async (req, res, next) => {
    const { projectId } = req.params;
    const userId = req.user._id;

    const projectMember = await ProjectMember.findOne({
      project: new mongoose.Types.ObjectId(projectId),
      user: new mongoose.Types.ObjectId(userId),
    });

    if (!projectMember) {
      throw new ApiError(
        403,
        "You do not have permission to access this project",
      );
    }

    if (roles.length > 0 && !roles.includes(projectMember.role)) {
      throw new ApiError(
        403,
        "You do not have permission to perform this action",
      );
    }

    req.projectMember = projectMember;
    next();
  });
};
