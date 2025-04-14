import { useState } from "react";
import useNotes from "../hooks/useNotes";
import useTodos from "../hooks/useTodos";
import { filterNotes } from "../utils/utils";
import NoteItem from "./NoteList";
import NoteModal from "./ModelNote";
import task from "../assets/task.png";

const Notebook = () => {
  const { notes, saveNote, deleteNote, currentNote, setCurrentNote } =
    useNotes();

  const {
    newTodoText,
    setNewTodoText,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
  } = useTodos(currentNote, setCurrentNote);

  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden transition-colors duration-300">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-gray-700 dark:to-gray-800">
        <div className="flex items-center gap-2">
          <img className="w-10" src={task} alt="task" />
          <h1 className="text-2xl font-semibold text-white">Smart Notebook</h1>
        </div>
      </div>

      {/* Konten Utama */}
      <div className="p-6">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Search for notes or todo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm border-none focus:ring-2 focus:ring-blue-500 dark:text-white"
          />
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all"
          >
            New Notes
          </button>
        </div>

        <div className="space-y-4 max-h-[500px] overflow-y-auto">
          {filterNotes(notes, searchQuery)?.map((note) => (
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
      </div>

      {showModal && (
        <NoteModal
          currentNote={currentNote}
          setCurrentNote={setCurrentNote}
          newTodoText={newTodoText}
          setNewTodoText={setNewTodoText}
          addTodo={addTodo}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
          editTodo={editTodo}
          onClose={() => {
            setShowModal(false);
            setCurrentNote({ id: null, title: "", content: "", todos: [] });
          }}
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
