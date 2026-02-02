import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/Card";
import { Button } from "./ui/Button"; // Assuming we might add task actions later

const TaskBoard = () => {
  const { projectId } = useParams();
  const queryClient = useQueryClient();

  const {
    data: tasks,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tasks", projectId],
    queryFn: async () => {
      const res = await api.get(`/tasks/${projectId}`);
      // The API returns all tasks. We might want to group them by status on the client.
      return res.data.data;
    },
  });

  if (isLoading) return <div>Loading tasks...</div>;
  if (isError) return <div className="text-red-500">Error loading tasks</div>;

  const tasksByStatus = {
    todo: tasks?.filter((t) => t.status === "todo") || [],
    inProgress: tasks?.filter((t) => t.status === "in-progress") || [], // Check API enum values: 'todo', 'in-progress', 'done' (or similar)
    done: tasks?.filter((t) => t.status === "done") || [],
  };
  // The backend enum is AvailableTaskStatus = ["todo", "in-progress", "done"] (checked in backend/src/utils/constants.js earlier)

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
        <div key={status} className="bg-gray-100 p-4 rounded-lg min-h-[500px]">
          <h3 className="font-semibold text-gray-700 mb-4 capitalize">
            {status.replace("-", " ")}
          </h3>
          <div className="space-y-3">
            {statusTasks.length === 0 && (
              <p className="text-sm text-gray-400 italic">No tasks</p>
            )}
            {statusTasks.map((task) => (
              <Card
                key={task._id}
                className="cursor-pointer hover:shadow-md bg-white"
              >
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {task.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {task.description}
                  </p>
                  <div className="flex justify-between items-center mt-3">
                    {task.assignedTo ? (
                      <div className="flex items-center gap-1">
                        <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-[10px] text-blue-600 font-bold">
                          {task.assignedTo.fullName?.[0] ||
                            task.assignedTo.username?.[0]}
                        </div>
                        <span className="text-xs text-gray-600">
                          {task.assignedTo.username}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">Unassigned</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskBoard;
