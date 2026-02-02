import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Search } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import api from "../../api/axios";
import { toast } from "sonner";

const InviteMemberModal = ({ isOpen, onClose, projectId }) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member"); // default role
  const queryClient = useQueryClient();

  const inviteMutation = useMutation({
    mutationFn: (data) => api.post(`/projects/${projectId}/members`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["projectMembers", projectId]);
      toast.success("Member invited successfully");
      onClose();
      setEmail("");
      setRole("member");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to invite member");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    inviteMutation.mutate({ email, role });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            Invite Team Member
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="colleague@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="member">Member</option>
              <option value="project admin">Project Admin</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={inviteMutation.isPending}>
              Invite
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteMemberModal;
