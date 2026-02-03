import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import api from "../api/axios";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/Card";
import TaskDetailsModal from "./modals/TaskDetailsModal";
import { toast } from "sonner";
import { CheckCircle2, Circle } from "lucide-react";

const TaskBoard = ({ projectId: propProjectId }) => {
  const { projectId: paramProjectId } = useParams();
  const projectId = propProjectId || paramProjectId;
  const queryClient = useQueryClient();
  const [selectedTask, setSelectedTask] = useState(null);

  const {
    data: tasks,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tasks", projectId],
    queryFn: async () => {
      const res = await api.get(`/tasks/${projectId}`);
      return res.data.data;
    },
    enabled: !!projectId,
  });

  const updateTaskStatusMutation = useMutation({
    mutationFn: ({ taskId, status }) =>
      api.put(`/tasks/${projectId}/t/${taskId}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks", projectId]);
      toast.success("Task status updated");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update task");
      queryClient.invalidateQueries(["tasks", projectId]); // Revert optimistic update
    },
  });

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // No destination or dropped in same place
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    const newStatus = destination.droppableId;
    updateTaskStatusMutation.mutate({
      taskId: draggableId,
      status: newStatus,
    });
  };

  if (isLoading) return <div>Loading tasks...</div>;
  if (isError) return <div className="text-red-500">Error loading tasks</div>;

  const tasksByStatus = {
    todo: tasks?.filter((t) => t.status === "todo") || [],
    in_progress: tasks?.filter((t) => t.status === "in_progress") || [],
    done: tasks?.filter((t) => t.status === "done") || [],
  };

  const columns = [
    { id: "todo", label: "To Do", color: "bg-gray-50" },
    { id: "in_progress", label: "In Progress", color: "bg-blue-50" },
    { id: "done", label: "Done", color: "bg-green-50" },
  ];

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid md:grid-cols-3 gap-6">
          {columns.map((column) => (
            <div key={column.id} className="flex flex-col">
              {/* Column Header */}
              <div
                className={`${column.color} p-4 rounded-t-lg border-b-2 border-gray-200`}
              >
                <h3 className="font-semibold text-gray-700">
                  {column.label}
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({tasksByStatus[column.id].length})
                  </span>
                </h3>
              </div>

              {/* Droppable Column */}
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 p-4 rounded-b-lg min-h-[500px] transition-colors ${
                      snapshot.isDraggingOver ? "bg-blue-100" : column.color
                    }`}
                  >
                    <div className="space-y-3">
                      {tasksByStatus[column.id].length === 0 && (
                        <p className="text-sm text-gray-400 italic text-center py-8">
                          No tasks
                        </p>
                      )}
                      {tasksByStatus[column.id].map((task, index) => (
                        <Draggable
                          key={task._id}
                          draggableId={task._id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`cursor-pointer hover:shadow-md bg-white transition-all ${
                                snapshot.isDragging ? "shadow-xl rotate-2" : ""
                              }`}
                              onClick={() => setSelectedTask(task)}
                            >
                              <CardHeader className="p-4 pb-2">
                                <CardTitle className="text-sm font-medium">
                                  {task.title}
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="p-4 pt-0">
                                <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                                  {task.description}
                                </p>

                                {/* Subtasks Progress */}
                                {task.subTasks && task.subTasks.length > 0 && (
                                  <div className="flex items-center gap-2 mb-3 text-xs">
                                    <div className="flex items-center gap-1 text-gray-600">
                                      <CheckCircle2 className="h-3.5 w-3.5" />
                                      <span>
                                        {
                                          task.subTasks.filter(
                                            (s) => s.isCompleted,
                                          ).length
                                        }
                                        /{task.subTasks.length}
                                      </span>
                                    </div>
                                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-green-500 transition-all"
                                        style={{
                                          width: `${
                                            (task.subTasks.filter(
                                              (s) => s.isCompleted,
                                            ).length /
                                              task.subTasks.length) *
                                            100
                                          }%`,
                                        }}
                                      />
                                    </div>
                                  </div>
                                )}

                                {/* Assignee */}
                                <div className="flex justify-between items-center">
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
                                    <span className="text-xs text-gray-400">
                                      Unassigned
                                    </span>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Task Details Modal */}
      <TaskDetailsModal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
        projectId={projectId}
      />
    </>
  );
};

export default TaskBoard;
