// src/components/TodoList.jsx
import { useState } from "react";
import not_tick from "../assets/not_tick.png";
import tick from "../assets/tick.png";
import pensil from "../assets/pensil.png";
import delete_icon from "../assets/delete_icon.png";
import { CalendarDaysIcon, ClockIcon } from "@heroicons/react/24/outline";

// Impor DatePicker untuk digunakan di form edit
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

const TodoItem = ({ todo, onToggle, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);

  // State untuk form edit
  const [editText, setEditText] = useState(todo.text);
  const [editDate, setEditDate] = useState(
    todo.dueDate ? new Date(todo.dueDate) : new Date()
  );
  const [editTime, setEditTime] = useState(
    todo.dueDate ? new Date(todo.dueDate) : new Date()
  );

  const isOverdue =
    todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.isComplete;

  const handleSave = () => {
    if (editText.trim() !== "") {
      const combinedDateTime = new Date(
        editDate.getFullYear(),
        editDate.getMonth(),
        editDate.getDate(),
        editTime.getHours(),
        editTime.getMinutes()
      );
      onEdit(todo.id, editText, combinedDateTime.toISOString());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    // Kembalikan state ke nilai semula jika dibatalkan
    setEditText(todo.text);
    setEditDate(todo.dueDate ? new Date(todo.dueDate) : new Date());
    setEditTime(todo.dueDate ? new Date(todo.dueDate) : new Date());
    setIsEditing(false);
  };

  return (
    <div className="p-3 bg-white/80 dark:bg-slate-800/80 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
      {isEditing ? (
        // TAMPILAN SAAT EDIT
        <div className="space-y-3">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full p-2 bg-slate-200 dark:bg-slate-700 rounded-md border-transparent focus:ring-2 focus:ring-blue-500 dark:text-white transition"
            autoFocus
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="relative z-10">
              <DatePicker
                selected={editDate}
                onChange={(date) => setEditDate(date)}
                dateFormat="d MMMM, yyyy"
                customInput={
                  <CustomInput
                    icon={<CalendarDaysIcon className="w-4 h-4" />}
                  />
                }
                popperClassName="react-datepicker-popper-custom"
                popperPlacement="bottom-start"
                popperModifiers={{
                  preventOverflow: {
                    enabled: true,
                    escapeWithReference: false,
                    boundariesElement: "viewport",
                  },
                  flip: {
                    enabled: true,
                  },
                  offset: {
                    enabled: true,
                    offset: "0, 5",
                  },
                }}
              />
            </div>
            <div className="relative z-10">
              <DatePicker
                selected={editTime}
                onChange={(date) => setEditTime(date)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="h:mm aa"
                customInput={
                  <CustomInput icon={<ClockIcon className="w-4 h-4" />} />
                }
                popperClassName="react-datepicker-popper-custom"
                popperPlacement="bottom-start"
                popperModifiers={{
                  preventOverflow: {
                    enabled: true,
                    escapeWithReference: false,
                    boundariesElement: "viewport",
                  },
                  flip: {
                    enabled: true,
                  },
                  offset: {
                    enabled: true,
                    offset: "0, 5",
                  },
                }}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={handleCancel}
              className="px-4 py-1.5 text-sm bg-slate-200 dark:bg-slate-600 rounded-md hover:opacity-80 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Save Changes
            </button>
          </div>
        </div>
      ) : (
        // TAMPILAN NORMAL
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <img
              src={todo.isComplete ? tick : not_tick}
              alt="status"
              className="w-5 h-5 cursor-pointer flex-shrink-0"
              onClick={() => onToggle(todo.id)}
            />
            <div className="flex flex-col min-w-0">
              <span
                className={`truncate ${
                  todo.isComplete
                    ? "line-through text-slate-500 dark:text-slate-400"
                    : isOverdue
                    ? "text-red-500 dark:text-red-400"
                    : "text-slate-700 dark:text-slate-300"
                }`}
              >
                {todo.text}
              </span>
              {todo.dueDate && (
                <span
                  className={`text-xs ${
                    isOverdue
                      ? "text-red-400"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {new Date(todo.dueDate).toLocaleString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {isOverdue && " (overdue)"}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2 ml-2">
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition"
            >
              <img src={pensil} alt="edit" className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className="p-2 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition"
            >
              <img src={delete_icon} alt="delete" className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoItem;
