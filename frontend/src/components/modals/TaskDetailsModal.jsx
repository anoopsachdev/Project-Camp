import React, { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  X,
  Plus,
  Trash2,
  Check,
  Edit2,
  Paperclip,
  Loader2,
} from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import api from "../../api/axios";
import { toast } from "sonner";

const TaskDetailsModal = ({ isOpen, onClose, task, projectId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [file, setFile] = useState(null);
  const queryClient = useQueryClient();

  // Fetch full task details with subtasks
  const {
    data: taskDetails,
    isLoading: isLoadingDetails,
    isError: isErrorDetails,
  } = useQuery({
    queryKey: ["task", projectId, task?._id],
    queryFn: async () => {
      const res = await api.get(`/tasks/${projectId}/t/${task._id}`);
      return res.data.data;
    },
    enabled: !!task?._id && isOpen,
    retry: 1,
  });

  // Fetch project members for assignment
  const { data: members } = useQuery({
    queryKey: ["projectMembers", projectId],
    queryFn: async () => {
      const res = await api.get(`/projects/${projectId}/members`);
      return res.data.data;
    },
    enabled: !!projectId && isOpen,
  });

  // Initialize from task prop when modal opens
  useEffect(() => {
    if (task && isOpen) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setStatus(task.status || "todo");
      setAssignedTo(task.assignedTo?._id || "");
      setIsEditing(false); // Ensure view mode by default
      setFile(null);
    }
  }, [task, isOpen]);

  // Update with full details when they load
  useEffect(() => {
    if (taskDetails) {
      setTitle(taskDetails.title || "");
      setDescription(taskDetails.description || "");
      setStatus(taskDetails.status || "todo");
      setAssignedTo(taskDetails.assignedTo?._id || "");
    }
  }, [taskDetails]);

  const updateTaskMutation = useMutation({
    mutationFn: (data) => api.put(`/tasks/${projectId}/t/${task._id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks", projectId]);
      queryClient.invalidateQueries(["task", projectId, task._id]);
      toast.success("Task updated successfully");
      setIsEditing(false);
      setFile(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update task");
    },
  });

  // Delete Task Mutation
  const deleteTaskMutation = useMutation({
    mutationFn: () => api.delete(`/tasks/${projectId}/t/${task._id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks", projectId]);
      toast.success("Task deleted successfully");
      onClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete task");
    },
  });

  // Create Subtask Mutation
  const createSubtaskMutation = useMutation({
    mutationFn: (data) =>
      api.post(`/tasks/${projectId}/t/${task._id}/subtasks`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["task", projectId, task._id]);
      toast.success("Subtask added");
      setNewSubtaskTitle("");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to add subtask");
    },
  });

  // Update Subtask Mutation
  const updateSubtaskMutation = useMutation({
    mutationFn: ({ subtaskId, data }) =>
      api.put(`/tasks/${projectId}/st/${subtaskId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["task", projectId, task._id]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update subtask");
    },
  });

  // Delete Subtask Mutation
  const deleteSubtaskMutation = useMutation({
    mutationFn: (subtaskId) =>
      api.delete(`/tasks/${projectId}/st/${subtaskId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["task", projectId, task._id]);
      toast.success("Subtask deleted");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete subtask");
    },
  });

  // Delete Attachment Mutation
  const deleteAttachmentMutation = useMutation({
    mutationFn: (attachmentId) =>
      api.delete(
        `/tasks/${projectId}/t/${task._id}/attachments/${attachmentId}`,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries(["task", projectId, task._id]);
      toast.success("Attachment deleted");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to delete attachment",
      );
    },
  });

  const handleSave = () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("status", status);
    if (assignedTo) {
      formData.append("assignedTo", assignedTo);
    }
    if (file) {
      formData.append("attachment", file);
    }

    // Pass formData directly - axios/api wrapper usually handles content-type for FormData automatically
    // But if our api wrapper expects object for json, checks needed.
    // Assuming api wrapper handles standard axios behavior.

    // For updateTaskMutation, we need to adapt if it expects data object vs FormData.
    // The previous implementation used api.put(..., data). Axios handles FormData automatically.

    updateTaskMutation.mutate(formData);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTaskMutation.mutate();
    }
  };

  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (newSubtaskTitle.trim()) {
      createSubtaskMutation.mutate({ title: newSubtaskTitle.trim() });
    }
  };

  const handleToggleSubtask = (subtask) => {
    updateSubtaskMutation.mutate({
      subtaskId: subtask._id,
      data: { isCompleted: !subtask.isCompleted },
    });
  };

  const handleDeleteSubtask = (subtaskId) => {
    if (window.confirm("Delete this subtask?")) {
      deleteSubtaskMutation.mutate(subtaskId);
    }
  };

  if (!isOpen || !task) return null;

  const subtasks = taskDetails?.subTasks || [];
  const completedCount = subtasks.filter((s) => s.isCompleted).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-900">
              Task Details
            </h2>
            {isLoadingDetails && (
              <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
            )}
          </div>
          <div className="flex items-center gap-2">
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="h-4 w-4 mr-1" /> Edit
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors ml-2"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isEditing ? (
            /* Edit Mode */
            isErrorDetails ? (
              <div className="p-8 text-center">
                <p className="text-red-500 mb-4">
                  Failed to load full task details
                </p>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Back to View
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Task title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    className="w-full min-h-[100px] px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Task description"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assignedTo">Assign To</Label>
                  <select
                    id="assignedTo"
                    className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                  >
                    <option value="">Unassigned</option>
                    {members?.map((member) => (
                      <option key={member.user._id} value={member.user._id}>
                        {member.user.fullName || member.user.username}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="attachment">Add Attachment</Label>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 text-sm">
                      <Paperclip className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Choose file</span>
                      <input
                        id="attachment"
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {file && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-sm bg-gray-50 px-2 py-1 rounded">
                        <span className="truncate">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => setFile(null)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Attachments in Edit Mode */}
                {taskDetails?.attachments?.length > 0 && (
                  <div>
                    <Label className="mb-2 block">Attachments</Label>
                    <div className="flex flex-wrap gap-2">
                      {taskDetails.attachments.map((file, idx) => {
                        // Handle old attachments with "undefined" prefix
                        let cleanUrl = file.url;
                        if (cleanUrl?.startsWith("undefined/")) {
                          cleanUrl = cleanUrl.replace("undefined/", "/");
                        }

                        // Prepend backend base URL if path is relative
                        const backendUrl =
                          import.meta.env.VITE_BACKEND_URL ||
                          "http://localhost:8000";
                        let fileUrl = cleanUrl?.startsWith("http")
                          ? cleanUrl
                          : `${backendUrl}${cleanUrl}`;

                        // For Cloudinary raw uploads, add fl_attachment flag to enable inline viewing
                        if (
                          fileUrl?.includes("cloudinary.com") &&
                          fileUrl?.includes("/raw/upload/")
                        ) {
                          fileUrl = fileUrl.replace(
                            "/upload/",
                            "/upload/fl_attachment/",
                          );
                        }

                        // Display name: use originalName if available, otherwise extract from URL
                        const displayName =
                          file.originalName ||
                          file.url?.split("/").pop() ||
                          `Attachment ${idx + 1}`;

                        return (
                          <div
                            key={file._id || idx}
                            className="flex items-center gap-1 bg-blue-50 rounded overflow-hidden"
                          >
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline px-2 py-1"
                            >
                              {displayName}
                            </a>
                            <button
                              type="button"
                              onClick={() =>
                                deleteAttachmentMutation.mutate(file._id)
                              }
                              disabled={deleteAttachmentMutation.isPending}
                              className="text-red-500 hover:text-red-700 hover:bg-red-100 p-1 transition-colors"
                              title="Delete attachment"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    isLoading={updateTaskMutation.isPending}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            )
          ) : (
            /* View Mode */
            <>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {taskDetails?.title || task.title}
                </h3>
                <p className="text-gray-600 mt-2">
                  {taskDetails?.description ||
                    task.description ||
                    "No description"}
                </p>
              </div>

              <div className="flex gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Status: </span>
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      taskDetails?.status === "done"
                        ? "bg-green-100 text-green-700"
                        : taskDetails?.status === "in_progress"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {taskDetails?.status?.replace("_", " ") || "Todo"}
                  </span>
                </div>
                {taskDetails?.assignedTo && (
                  <div>
                    <span className="text-gray-500">Assigned to: </span>
                    <span className="font-medium">
                      {taskDetails.assignedTo.fullName ||
                        taskDetails.assignedTo.username}
                    </span>
                  </div>
                )}
              </div>

              {/* Attachments */}
              {taskDetails?.attachments?.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <Paperclip className="h-4 w-4" /> Attachments
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {taskDetails.attachments.map((file, idx) => {
                      // Handle old attachments with "undefined" prefix
                      let cleanUrl = file.url;
                      if (cleanUrl?.startsWith("undefined/")) {
                        cleanUrl = cleanUrl.replace("undefined/", "/");
                      }

                      // Prepend backend base URL if path is relative
                      const backendUrl =
                        import.meta.env.VITE_BACKEND_URL ||
                        "http://localhost:8000";
                      let fileUrl = cleanUrl?.startsWith("http")
                        ? cleanUrl
                        : `${backendUrl}${cleanUrl}`;

                      // For Cloudinary raw uploads, add fl_attachment flag to enable inline viewing
                      if (
                        fileUrl?.includes("cloudinary.com") &&
                        fileUrl?.includes("/raw/upload/")
                      ) {
                        fileUrl = fileUrl.replace(
                          "/upload/",
                          "/upload/fl_attachment/",
                        );
                      }

                      // Display name: use originalName if available, otherwise extract from URL
                      const displayName =
                        file.originalName ||
                        file.url?.split("/").pop() ||
                        `Attachment ${idx + 1}`;

                      return (
                        <div
                          key={file._id || idx}
                          className="flex items-center gap-1 bg-blue-50 rounded overflow-hidden"
                        >
                          <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline px-2 py-1"
                          >
                            {displayName}
                          </a>
                          {isEditing && (
                            <button
                              type="button"
                              onClick={() =>
                                deleteAttachmentMutation.mutate(file._id)
                              }
                              disabled={deleteAttachmentMutation.isPending}
                              className="text-red-500 hover:text-red-700 hover:bg-red-100 p-1 transition-colors"
                              title="Delete attachment"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Subtasks Section */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900">
                Subtasks{" "}
                {subtasks.length > 0 &&
                  `(${completedCount}/${subtasks.length})`}
              </h4>
            </div>

            {/* Subtask List */}
            <div className="space-y-2 mb-4">
              {subtasks.length === 0 && (
                <p className="text-sm text-gray-400 italic">No subtasks yet</p>
              )}
              {subtasks.map((subtask) => (
                <div
                  key={subtask._id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleSubtask(subtask)}
                      className={`h-5 w-5 rounded border flex items-center justify-center transition-colors ${
                        subtask.isCompleted
                          ? "bg-green-500 border-green-500 text-white"
                          : "border-gray-300 hover:border-blue-500"
                      }`}
                    >
                      {subtask.isCompleted && <Check className="h-3 w-3" />}
                    </button>
                    <span
                      className={`text-sm ${subtask.isCompleted ? "line-through text-gray-400" : "text-gray-700"}`}
                    >
                      {subtask.title}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteSubtask(subtask._id)}
                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Subtask Form */}
            <form onSubmit={handleAddSubtask} className="flex gap-2">
              <Input
                placeholder="Add a subtask..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                className="flex-1"
              />
              <Button
                type="submit"
                size="sm"
                disabled={!newSubtaskTitle.trim()}
                isLoading={createSubtaskMutation.isPending}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;
