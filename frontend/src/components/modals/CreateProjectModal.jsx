import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { X } from "lucide-react";

import { toast } from "sonner";

const CreateProjectModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ name: "", description: "" });
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data) => api.post("/projects", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
      setFormData({ name: "", description: "" });
      toast.success("Project created successfully");
      onClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create project");
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
          <CardTitle>Create New Project</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                placeholder="e.g. Website Redesign"
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
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" isLoading={createMutation.isPending}>
                Create Project
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateProjectModal;
