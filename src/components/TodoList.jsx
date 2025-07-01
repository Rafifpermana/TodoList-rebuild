import { useState } from "react";
import {
  CalendarDaysIcon,
  ClockIcon,
  ArrowPathIcon,
  CheckCircleIcon as CheckCircleSolid,
  CheckBadgeIcon,
} from "@heroicons/react/24/solid";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline"; // <-- Hapus CircleIcon dari sini

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

  const [editText, setEditText] = useState(todo.text);
  const [editDate, setEditDate] = useState(
    todo.dueDate ? new Date(todo.dueDate) : new Date()
  );
  const [editTime, setEditTime] = useState(
    todo.dueDate ? new Date(todo.dueDate) : new Date()
  );
  const [editRecurrence, setEditRecurrence] = useState(
    todo.recurrence || "none"
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
      onEdit(todo.id, editText, combinedDateTime.toISOString(), editRecurrence);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setEditDate(todo.dueDate ? new Date(todo.dueDate) : new Date());
    setEditTime(todo.dueDate ? new Date(todo.dueDate) : new Date());
    setEditRecurrence(todo.recurrence || "none");
    setIsEditing(false);
  };

  const renderChecklistIcon = () => {
    const isRecurringCompleted =
      todo.isComplete && todo.recurrence && todo.recurrence !== "none";

    if (isRecurringCompleted) {
      return (
        <CheckBadgeIcon
          className="w-6 h-6 text-indigo-500 cursor-pointer flex-shrink-0"
          title={`Completed & Recurring (${todo.recurrence})`}
        />
      );
    }
    if (todo.isComplete) {
      return (
        <CheckCircleSolid className="w-6 h-6 text-green-500 cursor-pointer flex-shrink-0" />
      );
    }
    // --- PERBAIKAN: Gunakan div untuk membuat lingkaran ---
    return (
      <div className="w-6 h-6 border-2 border-slate-400 dark:border-slate-500 rounded-full group-hover:border-slate-600 dark:group-hover:border-slate-300 transition-colors cursor-pointer flex-shrink-0" />
    );
  };

  return (
    <div
      className={`group p-2.5 rounded-lg transition-colors ${
        isOverdue
          ? "bg-red-100/50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50"
          : "bg-white/50 dark:bg-slate-800/50"
      }`}
    >
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full p-2 bg-slate-200 dark:bg-slate-700 rounded-md border-transparent focus:ring-2 focus:ring-blue-500 dark:text-white transition"
            autoFocus
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <DatePicker
                selected={editDate}
                onChange={(date) => setEditDate(date)}
                dateFormat="d MMMM, yyyy"
                customInput={
                  <CustomInput
                    icon={<CalendarDaysIcon className="w-4 h-4" />}
                  />
                }
              />
            </div>
            <div>
              <DatePicker
                selected={editTime}
                onChange={(date) => setEditTime(date)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                dateFormat="h:mm aa"
                customInput={
                  <CustomInput icon={<ClockIcon className="w-4 h-4" />} />
                }
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">
              Recurrence
            </label>
            <select
              value={editRecurrence}
              onChange={(e) => setEditRecurrence(e.target.value)}
              className="w-full p-2 bg-slate-200 dark:bg-slate-700 rounded-md border-transparent focus:ring-2 focus:ring-blue-500 dark:text-white transition"
            >
              <option value="none">None</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div onClick={() => onToggle(todo.id)}>{renderChecklistIcon()}</div>
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
                <div className="flex items-center gap-1.5 mt-0.5">
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
                  {todo.recurrence &&
                    todo.recurrence !== "none" &&
                    !todo.isComplete && (
                      <ArrowPathIcon
                        className="w-3.5 h-3.5 text-blue-500"
                        title={`Recurs ${todo.recurrence}`}
                      />
                    )}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 ml-2">
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-full transition-colors"
            >
              <PencilSquareIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className="p-2 text-red-500/70 hover:text-red-600 hover:bg-red-500/10 rounded-full transition-colors"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoItem;
