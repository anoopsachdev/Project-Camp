import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { Card, CardContent } from "./ui/Card";
import { Trash, Edit } from "lucide-react";

const NotesList = () => {
  const { projectId } = useParams();

  const {
    data: notes,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["notes", projectId],
    queryFn: async () => {
      const res = await api.get(`/notes/${projectId}`);
      // Backend returns { data: [...] }
      return res.data.data;
    },
  });

  if (isLoading) return <div>Loading notes...</div>;
  if (isError) return <div className="text-red-500">Error loading notes</div>;

  if (!notes || notes.length === 0) {
    return <div className="text-gray-500 italic">No notes found.</div>;
  }

  return (
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
          {/* Actions placeholder */}
        </Card>
      ))}
    </div>
  );
};

export default NotesList;
