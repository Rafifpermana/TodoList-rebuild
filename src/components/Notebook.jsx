// src/components/Notebook.jsx
import { useState } from "react";
import useNotes from "../hooks/useNotes";
import useTodos from "../hooks/useTodos";
import { filterNotes } from "../utils/utils";
import NoteItem from "./NoteList";
import NoteModal from "./ModelNote";
import task from "../assets/task.png";
import add from "../assets/add.png";
import {
  MagnifyingGlassIcon,
  DocumentPlusIcon,
} from "@heroicons/react/24/outline";

const Notebook = () => {
  const { notes, saveNote, deleteNote, currentNote, setCurrentNote } =
    useNotes();
  const {
    newTodoText,
    setNewTodoText,
    addTodo,
    toggleTodo,
    deleteTodo: deleteTodoItem,
    editTodo,
  } = useTodos(currentNote, setCurrentNote);

  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotes = filterNotes(notes, searchQuery);

  return (
    <div className="bg-slate-50/70 dark:bg-slate-900/60 backdrop-blur-xl w-full max-w-7xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-colors duration-300 ring-1 ring-black/5">
      {/* Header */}
      <div className="p-5 md:p-6 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
        {/* Baris Judul */}
        <div className="flex items-center gap-3 mb-4">
          <img className="w-9 h-9" src={task} alt="task" />
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            Smart Notebook
          </h1>
        </div>

        {/* Baris Kontrol */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-grow">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search notes by title, content, or todo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2.5 pl-10 bg-white/80 dark:bg-slate-800/80 rounded-lg text-sm border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition"
            />
          </div>
          <button
            onClick={() => {
              setCurrentNote({ id: null, title: "", content: "", todos: [] });
              setShowModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all shadow flex-shrink-0 flex items-center gap-2"
          >
            <img src={add} alt="add" className="w-5 h-5" />
            <span className="hidden sm:inline">New Note</span>
          </button>
        </div>
      </div>

      {/* Konten Utama (Daftar Catatan) */}
      <div className="p-5 md:p-6 flex-grow overflow-y-auto">
        {filteredNotes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredNotes.map((note) => (
              <NoteItem
                key={note.id}
                note={note}
                onEdit={() => {
                  setCurrentNote(note);
                  setShowModal(true);
                }}
                onDelete={deleteNote}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 dark:text-slate-600">
            <DocumentPlusIcon className="w-20 h-20 mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">
              Your Notebook is Empty
            </h3>
            <p className="mt-1 max-w-xs">
              Looks like you haven't written any notes yet. Click "New Note" to
              get started!
            </p>
          </div>
        )}
      </div>

      {showModal && (
        <NoteModal
          currentNote={currentNote}
          setCurrentNote={setCurrentNote}
          newTodoText={newTodoText}
          setNewTodoText={setNewTodoText}
          addTodo={addTodo}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodoItem}
          editTodo={editTodo}
          onClose={() => setShowModal(false)}
          onSave={() => {
            saveNote();
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
};

export default Notebook;
