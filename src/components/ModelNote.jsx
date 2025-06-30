// src/components/ModelNote.jsx
import { useState } from "react";
import TodoItem from "./TodoList";
import save from "../assets/save.png";
import add from "../assets/add.png";
import cancel from "../assets/cancel.png";
import { CalendarDaysIcon, ClockIcon } from "@heroicons/react/24/outline";

// Impor komponen dan CSS dari react-datepicker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const NoteModal = ({
  currentNote,
  setCurrentNote,
  newTodoText,
  setNewTodoText,
  addTodo,
  toggleTodo,
  deleteTodo,
  editTodo,
  onClose,
  onSave,
}) => {
  // State dipisah untuk tanggal dan waktu
  const [dueDate, setDueDate] = useState(new Date());
  const [dueTime, setDueTime] = useState(new Date());

  const handleAddTodo = () => {
    if (!newTodoText.trim()) return;

    // Gabungkan tanggal dari dueDate dan waktu dari dueTime
    const combinedDateTime = new Date(
      dueDate.getFullYear(),
      dueDate.getMonth(),
      dueDate.getDate(),
      dueTime.getHours(),
      dueTime.getMinutes()
    );

    addTodo(newTodoText, combinedDateTime.toISOString());
    setNewTodoText("");
  };

  // Komponen input kustom untuk DatePicker agar bisa menampilkan ikon
  const CustomInput = ({ value, onClick, icon }) => (
    <div className="relative">
      <button
        type="button"
        onClick={onClick}
        className="w-full text-left p-2 pl-10 bg-slate-200 dark:bg-slate-700 rounded-md border-transparent focus:ring-2 focus:ring-blue-500 dark:text-white transition"
      >
        {value}
      </button>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400">
        {icon}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-20">
      <div className="bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-xl w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] ring-1 ring-black/5">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            {currentNote.id ? "Edit Note" : "New Note"}
          </h2>
        </div>

        <div className="p-5 overflow-y-auto">
          <input
            type="text"
            placeholder="Note Title"
            value={currentNote.title}
            onChange={(e) =>
              setCurrentNote((prev) => ({ ...prev, title: e.target.value }))
            }
            className="w-full p-3 mb-4 bg-white/80 dark:bg-slate-800/80 rounded-lg text-md font-semibold border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition"
          />
          <textarea
            placeholder="Content of Notes..."
            value={currentNote.content}
            onChange={(e) =>
              setCurrentNote((prev) => ({ ...prev, content: e.target.value }))
            }
            className="w-full p-3 h-32 bg-white/80 dark:bg-slate-800/80 rounded-lg border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 resize-none dark:text-white"
          />

          <div className="mt-6">
            <h3 className="font-medium mb-3 text-slate-800 dark:text-white">
              Todo List
            </h3>

            <div className="p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg space-y-3">
              <input
                type="text"
                placeholder="Add a new todo..."
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddTodo()}
                className="w-full p-2 bg-slate-200 dark:bg-slate-700 rounded-md border-transparent focus:ring-2 focus:ring-blue-500 dark:text-white transition"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1 block">
                    Due Date
                  </label>
                  <DatePicker
                    selected={dueDate}
                    onChange={(date) => setDueDate(date)}
                    dateFormat="d MMMM, yyyy"
                    customInput={
                      <CustomInput
                        icon={<CalendarDaysIcon className="w-5 h-5" />}
                      />
                    }
                  />
                </div>
                {/* Input Waktu Terpisah */}
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1 block">
                    Due Time
                  </label>
                  <DatePicker
                    selected={dueTime}
                    onChange={(date) => setDueTime(date)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="h:mm aa"
                    customInput={
                      <CustomInput icon={<ClockIcon className="w-5 h-5" />} />
                    }
                  />
                </div>
              </div>
              <button
                onClick={handleAddTodo}
                className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <img src={add} alt="add" className="w-5 h-5" />
                <span>Add Todo</span>
              </button>
            </div>

            {/* Daftar Todo yang Sudah Ada */}
            <div className="space-y-2 mt-4">
              {(currentNote.todos || [])
                .slice()
                .sort((a, b) => b.id - a.id)
                .map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={toggleTodo}
                    onEdit={editTodo}
                    onDelete={deleteTodo}
                  />
                ))}
            </div>
          </div>
        </div>

        {/* ... Tombol Cancel dan Save tidak berubah ... */}
        <div className="p-5 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition"
          >
            <img
              src={cancel}
              alt="cancel"
              className="w-5 h-5 mx-auto sm:hidden"
            />
            <span className="hidden sm:inline">Cancel</span>
          </button>
          <button
            onClick={onSave}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow"
          >
            <img src={save} alt="Save" className="w-5 h-5 mx-auto sm:hidden" />
            <span className="hidden sm:inline">Save</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteModal;
