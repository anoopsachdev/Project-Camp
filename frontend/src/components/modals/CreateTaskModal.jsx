import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { X } from "lucide-react";

import { toast } from "sonner";

const CreateTaskModal = ({ isOpen, onClose }) => {
  const { projectId } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo",
  });
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data) => api.post(`/tasks/${projectId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks", projectId]);
      setFormData({ title: "", description: "", status: "todo" });
      toast.success("Task created successfully");
      onClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create task");
    },
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-md relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
        <CardHeader>
          <CardTitle>Create New Task</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                placeholder="e.g. Design Homepage"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Optional description"
              />
            </div>
            {/* Status select could be added here, defaulting to todo */}
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" isLoading={createMutation.isPending}>
                Create Task
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateTaskModal;
