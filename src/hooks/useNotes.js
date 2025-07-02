// src/hooks/useNotes.js
import { useEffect, useState } from "react";
import { db, auth } from "../firebase"; // Impor db dan auth
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  where,
  orderBy,
} from "firebase/firestore";

const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState({
    id: null,
    title: "",
    content: "",
    todos: [],
    date: "",
  });
  const user = auth.currentUser;
  useEffect(() => {
    if (!user) {
      setNotes([]);
      return;
    }
    const notesCollection = collection(db, "notes");
    const q = query(
      notesCollection,
      where("userId", "==", user.uid),
      orderBy("date", "desc")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notesData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setNotes(notesData);
    });
    return () => unsubscribe();
  }, [user]);

  // Menyimpan atau mengupdate catatan
  const saveNote = async () => {
    if (!user || !currentNote.title.trim()) return;

    // --- IMPROVEMENT: Simpan tanggal dalam format ISO ---
    const dateToSave = new Date().toISOString();

    if (currentNote.id) {
      // Update catatan yang ada
      const noteDoc = doc(db, "notes", currentNote.id);
      await updateDoc(noteDoc, {
        title: currentNote.title,
        content: currentNote.content,
        todos: currentNote.todos || [],
        date: dateToSave, // Gunakan format ISO
      });
    } else {
      // Tambah catatan baru
      const newNoteData = {
        title: currentNote.title,
        content: currentNote.content,
        todos: currentNote.todos || [],
        date: dateToSave, // Gunakan format ISO
        userId: user.uid,
      };
      await addDoc(collection(db, "notes"), newNoteData);
    }

    setCurrentNote({ id: null, title: "", content: "", todos: [] });
  };

  // Menghapus catatan
  const deleteNote = async (id) => {
    if (!user) return;
    const noteDoc = doc(db, "notes", id);
    await deleteDoc(noteDoc);
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
