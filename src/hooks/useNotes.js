import { useEffect, useState } from "react";

const useNotes = () => {
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem("notes");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentNote, setCurrentNote] = useState({
    id: null,
    title: "",
    content: "",
    todos: [],
    date: "",
  });

  useEffect(() => {
    try {
      localStorage.setItem("notes", JSON.stringify(notes));
    } catch (error) {
      console.error("Gagal menyimpan catatan:", error);
    }
  }, [notes]);

  const saveNote = () => {
    if (!currentNote.title.trim()) return;

    const newNote = {
      ...currentNote,
      id: currentNote.id || Date.now(),
      date: new Date().toLocaleString(),
      todos: currentNote.todos || [],
    };

    setNotes(
      (prev) =>
        currentNote.id
          ? [newNote, ...prev.filter((note) => note.id !== currentNote.id)] // Catatan yang diedit dipindahkan ke paling atas
          : [newNote, ...prev] // Catatan baru ditambahkan di paling atas
    );

    setCurrentNote({ id: null, title: "", content: "", todos: [] });
  };

  const deleteNote = (id) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  return {
    notes,
    setNotes,
    saveNote,
    deleteNote,
    currentNote,
    setCurrentNote,
  };
};

export default useNotes;
