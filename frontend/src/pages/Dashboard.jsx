import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import api from "../api/axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Plus } from "lucide-react";

import { useState } from "react";
import CreateProjectModal from "../components/modals/CreateProjectModal";

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    data: projects,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await api.get("/projects");
      return res.data.data;
    },
  });

  if (isLoading)
    return (
      <div className="p-8 text-center" data-testid="loading-projects">
        Loading projects...
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Dashboard
        </h2>
        <Button
          onClick={() => setIsModalOpen(true)}
          data-testid="create-project-btn"
        >
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects?.length === 0 ? (
          <div className="col-span-full text-center py-10 bg-white rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">
              No projects found. Create one to get started.
            </p>
          </div>
        ) : (
          projects?.map((project) => (
            <Link
              key={project.project._id}
              to={`/project/${project.project._id}`}
            >
              <Card
                className="hover:shadow-md transition-shadow cursor-pointer h-full"
                data-testid={`project-card-${project.project.name}`}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {project.project.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-gray-500 line-clamp-2">
                    {project.project.description || "No description"}
                  </div>
                  <div className="mt-4 text-xs text-gray-400">
                    Role:{" "}
                    <span className="capitalize text-gray-600 font-medium">
                      {project.role}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
