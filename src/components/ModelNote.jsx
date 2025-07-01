// src/components/ModelNote.jsx
import { useState } from "react";
import TodoItem from "./TodoList";
import save from "../assets/save.png";
import add from "../assets/add.png";
import cancel from "../assets/cancel.png";
import { CalendarDaysIcon, ClockIcon } from "@heroicons/react/24/outline";
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
  const [activeTab, setActiveTab] = useState("note");
  const [dueDate, setDueDate] = useState(new Date());
  const [dueTime, setDueTime] = useState(new Date());
  const [recurrence, setRecurrence] = useState("none"); // State untuk frekuensi tugas berulang

  const handleAddTodo = () => {
    if (!newTodoText.trim()) return;

    const combinedDateTime = new Date(
      dueDate.getFullYear(),
      dueDate.getMonth(),
      dueDate.getDate(),
      dueTime.getHours(),
      dueTime.getMinutes()
    );

    addTodo(newTodoText, combinedDateTime.toISOString(), recurrence); // Tambahkan frekuensi ke fungsi addTodo
    setNewTodoText("");
    setRecurrence("none"); // Reset frekuensi setelah menambahkan tugas
  };

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
      <div className="bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-xl w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] ring-1 ring-black/5">
        <div className="border-b border-slate-200 dark:border-slate-800">
          <div className="p-5 pb-0">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
              {currentNote.id ? "Edit Note" : "New Note"}
            </h2>
          </div>
          <div className="flex border-b border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab("note")}
              className={`px-6 py-3 font-medium text-sm transition-all relative ${
                activeTab === "note"
                  ? "text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-800 border-b-2 border-blue-600 dark:border-blue-400"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50"
              }`}
            >
              📝 Note Content
            </button>
            <button
              onClick={() => setActiveTab("todo")}
              className={`px-6 py-3 font-medium text-sm transition-all relative ${
                activeTab === "todo"
                  ? "text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-800 border-b-2 border-blue-600 dark:border-blue-400"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50"
              }`}
            >
              ✅ Todo List
              {currentNote.todos && currentNote.todos.length > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                  {currentNote.todos.length}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {activeTab === "note" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Note Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter note title..."
                    value={currentNote.title}
                    onChange={(e) =>
                      setCurrentNote((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="w-full p-3 bg-white/80 dark:bg-slate-800/80 rounded-lg text-md font-semibold border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Note Content
                  </label>
                  <textarea
                    placeholder="Write your note content here..."
                    value={currentNote.content}
                    onChange={(e) =>
                      setCurrentNote((prev) => ({
                        ...prev,
                        content: e.target.value,
                      }))
                    }
                    className="w-full p-3 h-96 bg-white/80 dark:bg-slate-800/80 rounded-lg border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 resize-none dark:text-white"
                  />
                </div>
              </div>
            )}

            {activeTab === "todo" && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                  ✅ Todo List
                  {currentNote.todos && currentNote.todos.length > 0 && (
                    <span className="text-sm font-normal text-slate-600 dark:text-slate-400">
                      ({currentNote.todos.length} items)
                    </span>
                  )}
                </h3>

                <div className="p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg space-y-3">
                  <input
                    type="text"
                    placeholder="Add a new todo..."
                    value={newTodoText}
                    onChange={(e) => setNewTodoText(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddTodo()}
                    className="w-full p-3 bg-slate-200 dark:bg-slate-700 rounded-md border-transparent focus:ring-2 focus:ring-blue-500 dark:text-white transition"
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
                          <CustomInput
                            icon={<ClockIcon className="w-5 h-5" />}
                          />
                        }
                      />
                    </div>
                  </div>

                  {/* Dropdown untuk memilih frekuensi tugas berulang */}
                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1 block">
                      Recurrence
                    </label>
                    <select
                      value={recurrence}
                      onChange={(e) => setRecurrence(e.target.value)}
                      className="w-full p-3 bg-slate-200 dark:bg-slate-700 rounded-md border-transparent focus:ring-2 focus:ring-blue-500 dark:text-white transition"
                    >
                      <option value="none">None</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  <button
                    onClick={handleAddTodo}
                    className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center justify-center gap-2"
                  >
                    <img src={add} alt="add" className="w-5 h-5" />
                    <span>Add Todo</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {(currentNote.todos || []).length === 0 ? (
                    <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                      <div className="text-4xl mb-2">📝</div>
                      <p>No todos yet. Add your first todo above!</p>
                    </div>
                  ) : (
                    (currentNote.todos || [])
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
                      ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-5 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition flex items-center gap-2"
          >
            <img src={cancel} alt="cancel" className="w-5 h-5" />
            <span>Cancel</span>
          </button>
          <button
            onClick={onSave}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow flex items-center gap-2"
          >
            <img src={save} alt="Save" className="w-5 h-5" />
            <span>Save</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteModal;
