import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { Card, CardContent } from "./ui/Card";
import { Trash2, Edit2 } from "lucide-react";
import EditNoteModal from "./modals/EditNoteModal";
import { toast } from "sonner";

const NotesList = ({ projectId: propProjectId }) => {
  const { projectId: paramProjectId } = useParams();
  const projectId = propProjectId || paramProjectId;
  const queryClient = useQueryClient();
  const [selectedNote, setSelectedNote] = useState(null);

  const {
    data: notes,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["notes", projectId],
    queryFn: async () => {
      const res = await api.get(`/notes/${projectId}`);
      return res.data.data;
    },
    enabled: !!projectId,
  });

  const deleteMutation = useMutation({
    mutationFn: (noteId) => api.delete(`/notes/${projectId}/n/${noteId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["notes", projectId]);
      toast.success("Note deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete note");
    },
  });

  const handleDelete = (noteId) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      deleteMutation.mutate(noteId);
    }
  };

  if (isLoading) return <div>Loading notes...</div>;
  if (isError) return <div className="text-red-500">Error loading notes</div>;

  if (!notes || notes.length === 0) {
    return <div className="text-gray-500 italic">No notes found.</div>;
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <Card key={note._id} className="relative group">
            <CardContent className="p-6">
              <div className="text-sm text-gray-800 whitespace-pre-wrap">
                {note.content}
              </div>
              <div className="mt-4 text-xs text-gray-400 flex justify-between items-center">
                <span>By {note.createdBy?.username || "Unknown"}</span>
                <span>{new Date(note.createdAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
            {/* Action Buttons */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <button
                onClick={() => setSelectedNote(note)}
                className="p-1.5 bg-white rounded shadow hover:bg-blue-50 text-blue-600"
                title="Edit note"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(note._id)}
                className="p-1.5 bg-white rounded shadow hover:bg-red-50 text-red-600"
                title="Delete note"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Edit Note Modal */}
      <EditNoteModal
        isOpen={!!selectedNote}
        onClose={() => setSelectedNote(null)}
        note={selectedNote}
        projectId={projectId}
      />
    </>
  );
};

export default NotesList;
