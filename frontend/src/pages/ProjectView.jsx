import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/Tabs"; // Need to create Tabs component
import { Button } from "../components/ui/Button";
import { Plus, Edit2, Trash2, UserMinus, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import TaskBoard from "../components/TaskBoard";
import NotesList from "../components/NotesList";
import Avatar from "react-avatar";

import CreateTaskModal from "../components/modals/CreateTaskModal";
import CreateNoteModal from "../components/modals/CreateNoteModal";
import InviteMemberModal from "../components/modals/InviteMemberModal";
import EditProjectModal from "../components/modals/EditProjectModal";
import { toast } from "sonner";

const ProjectView = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("tasks");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  const { user } = useAuth();

  const {
    data: projectData,
    isLoading: isProjectLoading,
    isError: isProjectError,
  } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const res = await api.get(`/projects/${projectId}`);
      return res.data.data;
    },
  });

  const { data: members, isLoading: isMembersLoading } = useQuery({
    queryKey: ["projectMembers", projectId],
    queryFn: async () => {
      const res = await api.get(`/projects/${projectId}/members`);
      return res.data.data;
    },
    enabled: !!projectId,
  });

  // Get current user's role in this project
  const currentUserRole = members?.find((m) => m.user._id === user?._id)?.role;
  const isAdmin = currentUserRole === "admin";

  const deleteProjectMutation = useMutation({
    mutationFn: () => api.delete(`/projects/${projectId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
      toast.success("Project deleted successfully");
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete project");
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: (userId) =>
      api.delete(`/projects/${projectId}/members/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["projectMembers", projectId]);
      toast.success("Member removed successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to remove member");
    },
  });

  const changeRoleMutation = useMutation({
    mutationFn: ({ userId, newRole }) =>
      api.put(`/projects/${projectId}/members/${userId}`, { newRole }),
    onSuccess: () => {
      queryClient.invalidateQueries(["projectMembers", projectId]);
      toast.success("Role updated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update role");
    },
  });

  const handleDeleteProject = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this project? This action cannot be undone.",
      )
    ) {
      deleteProjectMutation.mutate();
    }
  };

  const handleRemoveMember = (userId, memberName) => {
    if (window.confirm(`Remove ${memberName} from this project?`)) {
      removeMemberMutation.mutate(userId);
    }
  };

  const handleChangeRole = (userId, currentRole, memberName) => {
    const roles = ["member", "project admin", "admin"];
    const currentIndex = roles.indexOf(currentRole);
    const nextRole = roles[(currentIndex + 1) % roles.length];

    if (
      window.confirm(
        `Change ${memberName}'s role from "${currentRole}" to "${nextRole}"?`,
      )
    ) {
      changeRoleMutation.mutate({ userId, newRole: nextRole });
    }
  };

  if (isProjectLoading)
    return <div className="p-8 text-center">Loading project...</div>;
  if (isProjectError || !projectData)
    return (
      <div className="p-8 text-center text-red-500">Error loading project</div>
    );

  const project = projectData;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
          <p className="text-gray-500 mt-1">{project.description}</p>
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditProjectModalOpen(true)}
              >
                <Edit2 className="h-4 w-4 mr-1" /> Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeleteProject}
                className="text-red-600 hover:text-red-700 hover:border-red-600"
              >
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Simple Tabs Implementation inline for now or create component */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {["Tasks", "Notes", "Team"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${
                  activeTab === tab.toLowerCase()
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
              data-testid={`tab-${tab.toLowerCase()}`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === "tasks" && (
          <div data-testid="tasks-view">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Tasks</h3>
              <Button
                size="sm"
                onClick={() => setIsTaskModalOpen(true)}
                data-testid="add-task-btn"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Task
              </Button>
            </div>
            <TaskBoard projectId={projectId} />
          </div>
        )}

        {activeTab === "notes" && (
          <div data-testid="notes-view">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Notes</h3>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsNoteModalOpen(true)}
                data-testid="add-note-btn"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Note
              </Button>
            </div>
            <NotesList projectId={projectId} />
          </div>
        )}

        {activeTab === "team" && (
          <div data-testid="team-view">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Team Members</h3>
              <Button
                size="sm"
                onClick={() => setIsInviteModalOpen(true)}
                data-testid="invite-member-btn"
              >
                <Plus className="h-4 w-4 mr-1" /> Invite Member
              </Button>
            </div>

            {isMembersLoading ? (
              <div className="p-4 text-center text-gray-500">
                Loading members...
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
                {members?.map((member) => (
                  <div
                    key={member.user._id}
                    className="flex items-center justify-between gap-3 p-4 bg-white rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar
                        name={member.user.fullName || member.user.username}
                        size="40"
                        round={true}
                        textSizeRatio={1.75}
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {member.user.fullName || member.user.username}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {member.role}
                        </p>
                      </div>
                    </div>
                    {isAdmin && member.user._id !== user?._id && (
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleChangeRole(
                              member.user._id,
                              member.role,
                              member.user.fullName || member.user.username,
                            )
                          }
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="Change role"
                        >
                          <ShieldCheck className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleRemoveMember(
                              member.user._id,
                              member.user.fullName || member.user.username,
                            )
                          }
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Remove member"
                        >
                          <UserMinus className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <CreateTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        projectId={projectId}
      />
      <CreateNoteModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        projectId={projectId}
      />
      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        projectId={projectId}
      />
      <EditProjectModal
        isOpen={isEditProjectModalOpen}
        onClose={() => setIsEditProjectModalOpen(false)}
        project={project}
      />
    </div>
  );
};

export default ProjectView;
