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

const CreateNoteModal = ({ isOpen, onClose }) => {
  const { projectId } = useParams();
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data) => api.post(`/notes/${projectId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["notes", projectId]);
      setContent("");
      toast.success("Note added successfully");
      onClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to add note");
    },
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate({ content });
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
          <CardTitle>Create New Note</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="content">Content</Label>
              <textarea
                id="content"
                className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                placeholder="Write your note here..."
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" isLoading={createMutation.isPending}>
                Add Note
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateNoteModal;
