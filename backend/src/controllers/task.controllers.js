import { User } from "../models/user.models.js";
import { Project } from "../models/project.models.js";
import { ProjectMember } from "../models/projectmember.models.js";
import { Task } from "../models/task.models.js";
import { Subtask } from "../models/subtask.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  getPublicIdFromUrl,
} from "../config/cloudinary.js";

const getTasks = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const tasks = await Task.aggregate([
    {
      $match: {
        project: new mongoose.Types.ObjectId(projectId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "assignedTo",
        foreignField: "_id",
        as: "assignedTo",
        pipeline: [
          {
            $project: {
              _id: 1,
              username: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "subtasks",
        localField: "_id",
        foreignField: "task",
        as: "subTasks",
        pipeline: [
          {
            $project: {
              _id: 1,
              title: 1,
              isCompleted: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        assignedTo: {
          $arrayElemAt: ["$assignedTo", 0],
        },
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "Task fetched successfully"));
});
const createTask = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, status } = req.body;
  const { projectId } = req.params;
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }
  const files = req.files || [];
  console.log(`[Task Upload] Received ${files.length} file(s)`);

  // Upload files to Cloudinary
  const attachments = await Promise.all(
    files.map(async (file) => {
      console.log(
        `[Task Upload] Processing: ${file.originalname} (${file.size} bytes)`,
      );
      try {
        const result = await uploadToCloudinary(
          file.buffer,
          file.originalname,
          "project-camp/attachments",
        );
        console.log(`[Task Upload] Success: ${result.secure_url}`);
        return {
          url: result.secure_url,
          publicId: result.public_id,
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
        };
      } catch (error) {
        console.error("[Task Upload] Cloudinary error:", error);
        throw new ApiError(500, "Failed to upload attachment");
      }
    }),
  );

  if (assignedTo) {
    const isMember = await ProjectMember.findOne({
      project: new mongoose.Types.ObjectId(projectId),
      user: new mongoose.Types.ObjectId(assignedTo),
    });
    if (!isMember) {
      throw new ApiError(400, "Assigned user is not a member of this project");
    }
  }

  const task = await Task.create({
    title,
    description,
    project: new mongoose.Types.ObjectId(projectId),
    assignedTo: assignedTo
      ? new mongoose.Types.ObjectId(assignedTo)
      : undefined,
    status,
    assignedBy: new mongoose.Types.ObjectId(req.user._id),
    attachments,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, task, "Task created successfully"));
});
const getTaskById = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await Task.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(taskId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "assignedTo",
        foreignField: "_id",
        as: "assignedTo",
        pipeline: [
          {
            $project: {
              _id: 1,
              username: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "subtasks",
        localField: "_id",
        foreignField: "task",
        as: "subTasks",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "createdBy",
              foreignField: "_id",
              as: "createdBy",
              pipeline: [
                {
                  $project: {
                    _id: 1,
                    username: 1,
                    fullName: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              createdBy: {
                $arrayElemAt: ["$createdBy", 0],
              },
            },
          },
        ],
      },
    },
    {
      $addFields: {
        assignedTo: {
          $arrayElemAt: ["$assignedTo", 0],
        },
      },
    },
  ]);

  if (!task || task.length === 0) {
    throw new ApiError(404, "Task not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, task[0], "Task fetched successfully"));
});
const updateTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { title, description, status, assignedTo } = req.body;

  const task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  if (assignedTo) {
    const isMember = await ProjectMember.findOne({
      project: task.project,
      user: new mongoose.Types.ObjectId(assignedTo),
    });
    if (!isMember) {
      throw new ApiError(400, "Assigned user is not a member of this project");
    }
  }

  const updatePayload = {
    $set: {
      title,
      description,
      status,
      assignedTo: assignedTo
        ? new mongoose.Types.ObjectId(assignedTo)
        : task.assignedTo,
    },
  };

  if (req.file) {
    console.log(
      `[Task Update] File received: ${req.file.originalname} (${req.file.size} bytes)`,
    );
    try {
      const result = await uploadToCloudinary(
        req.file.buffer,
        req.file.originalname,
        "project-camp/attachments",
      );
      console.log(
        `[Task Update] Cloudinary upload success: ${result.secure_url}`,
      );
      const attachment = {
        url: result.secure_url,
        publicId: result.public_id,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
      };
      updatePayload.$push = { attachments: attachment };
    } catch (error) {
      console.error("[Task Update] Cloudinary error:", error);
      throw new ApiError(500, "Failed to upload attachment");
    }
  } else {
    console.log("[Task Update] No file received in request");
  }

  const updatedTask = await Task.findByIdAndUpdate(taskId, updatePayload, {
    new: true,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updatedTask, "Task updated successfully"));
});
const deleteTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await Task.findByIdAndDelete(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  // Delete associated subtasks
  await Subtask.deleteMany({ task: new mongoose.Types.ObjectId(taskId) });

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task deleted successfully"));
});
const createSubTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { title } = req.body;

  const task = await Task.findById(taskId);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  const subtask = await Subtask.create({
    title,
    task: new mongoose.Types.ObjectId(taskId),
    createdBy: new mongoose.Types.ObjectId(req.user._id),
  });

  return res
    .status(201)
    .json(new ApiResponse(201, subtask, "Subtask created successfully"));
});
const updateSubTask = asyncHandler(async (req, res) => {
  const { subTaskId } = req.params;
  const { title, isCompleted } = req.body;

  const subtask = await Subtask.findByIdAndUpdate(
    subTaskId,
    {
      title,
      isCompleted,
    },
    { new: true },
  );

  if (!subtask) {
    throw new ApiError(404, "Subtask not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, subtask, "Subtask updated successfully"));
});
const deleteSubTask = asyncHandler(async (req, res) => {
  const { subTaskId } = req.params;

  const subtask = await Subtask.findByIdAndDelete(subTaskId);

  if (!subtask) {
    throw new ApiError(404, "Subtask not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, subtask, "Subtask deleted successfully"));
});

const deleteAttachment = asyncHandler(async (req, res) => {
  const { projectId, taskId, attachmentId } = req.params;

  // Find the task
  const task = await Task.findById(taskId);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  // Check if task belongs to the project
  if (task.project.toString() !== projectId) {
    throw new ApiError(400, "Task does not belong to this project");
  }

  // Check user's role in the project
  const membership = await ProjectMember.findOne({
    project: new mongoose.Types.ObjectId(projectId),
    user: new mongoose.Types.ObjectId(req.user._id),
  });

  if (!membership) {
    throw new ApiError(403, "You are not a member of this project");
  }

  // Permission check: admin, project admin, or task creator can delete
  const isAdmin = membership.role === UserRolesEnum.ADMIN;
  const isProjectAdmin = membership.role === UserRolesEnum.PROJECT_ADMIN;
  const isTaskCreator = task.assignedBy.toString() === req.user._id.toString();

  if (!isAdmin && !isProjectAdmin && !isTaskCreator) {
    throw new ApiError(
      403,
      "You don't have permission to delete attachments on this task",
    );
  }

  // Find the attachment
  const attachment = task.attachments.id(attachmentId);
  if (!attachment) {
    throw new ApiError(404, "Attachment not found");
  }

  // Try to delete file from Cloudinary or disk
  try {
    if (attachment.publicId) {
      // Cloudinary file - delete from Cloudinary
      await deleteFromCloudinary(attachment.publicId);
    } else if (attachment.url?.startsWith("/images/")) {
      // Legacy local file - delete from disk
      const filePath = path.join(process.cwd(), "public", attachment.url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } else if (attachment.url?.includes("cloudinary.com")) {
      // Cloudinary file without publicId stored - extract and delete
      const publicId = getPublicIdFromUrl(attachment.url);
      if (publicId) {
        await deleteFromCloudinary(publicId);
      }
    }
  } catch (error) {
    console.error("Error deleting file:", error);
    // Continue even if file deletion fails
  }

  // Remove attachment from task
  task.attachments.pull(attachmentId);
  await task.save();

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Attachment deleted successfully"));
});

export {
  createSubTask,
  createTask,
  deleteAttachment,
  deleteTask,
  deleteSubTask,
  getTaskById,
  getTasks,
  updateSubTask,
  updateTask,
};
