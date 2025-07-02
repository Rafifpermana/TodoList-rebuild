// src/components/NoteList.jsx
import { useState } from "react";
import pensil from "../assets/pensil.png";
import delete_icon from "../assets/delete_icon.png";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid";

const NoteItem = ({ note, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  if (!note || !note.id) {
    return null;
  }

  const { todos = [] } = note;

  // --- KALKULASI DIKELOMPOKKAN ---

  // 1. Kalkulasi Progress Semua Todo
  const totalTodos = todos.length;
  const completedTodos = todos.filter((todo) => todo.isComplete).length;
  const progressPercentage =
    totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;

  // 2. Kalkulasi Progress Todo Berulang
  const recurringTodos = todos.filter(
    (todo) => todo.recurrence && todo.recurrence !== "none"
  );
  const totalRecurringTodos = recurringTodos.length;
  const completedRecurringTodos = recurringTodos.filter(
    (todo) => todo.isComplete
  ).length;
  const recurrenceProgressPercentage =
    totalRecurringTodos > 0
      ? (completedRecurringTodos / totalRecurringTodos) * 100
      : 0;

  // 3. Kalkulasi untuk Badge Notifikasi
  const activeRecurringTodosCount = recurringTodos.filter(
    (todo) => !todo.isComplete
  ).length;

  const getUpcomingTodos = () => {
    if (!todos) return { urgent: [], upcoming: [] };
    const now = new Date();
    const urgent = [];
    const upcoming = [];
    todos.forEach((todo) => {
      if (todo.isComplete || !todo.dueDate) return;
      const dueDate = new Date(todo.dueDate);
      const timeDiff = dueDate.getTime() - now.getTime();
      const hoursDiff = timeDiff / (1000 * 3600);
      const daysDiff = timeDiff / (1000 * 3600 * 24);
      if (timeDiff < 0) {
        urgent.push({ ...todo, status: "overdue", diff: Math.abs(daysDiff) });
      } else if (hoursDiff <= 24) {
        urgent.push({ ...todo, status: "urgent", diff: hoursDiff });
      } else if (daysDiff <= 3) {
        upcoming.push({ ...todo, status: "upcoming", diff: daysDiff });
      }
    });
    return { urgent, upcoming };
  };

  const { urgent, upcoming } = getUpcomingTodos();
  const hasUrgentTodos = urgent.length > 0 || upcoming.length > 0;

  const getBadgeStyle = () => {
    if (urgent.some((todo) => todo.status === "overdue"))
      return { bgColor: "bg-red-500", textColor: "text-white" };
    if (urgent.length > 0)
      return { bgColor: "bg-yellow-500", textColor: "text-white" };
    if (upcoming.length > 0)
      return { bgColor: "bg-blue-500", textColor: "text-white" };
    return { bgColor: "bg-red-500", textColor: "text-white" };
  };

  const formatTimeWarning = (todo) => {
    if (todo.status === "overdue")
      return `${Math.floor(todo.diff)} hari terlambat`;
    if (todo.status === "urgent") return `${Math.floor(todo.diff)} jam lagi`;
    if (todo.status === "upcoming") return `${Math.floor(todo.diff)} hari lagi`;
  };

  const handleExpandToggle = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const needsExpansion = (text) => {
    return text && text.length > 120;
  };

  const badgeStyle = getBadgeStyle();

  return (
    <div
      onClick={onEdit}
      className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-sm p-5 rounded-xl group relative transition-all duration-300 hover:scale-105 hover:shadow-xl border border-slate-200/20 dark:border-slate-700/50 cursor-pointer flex flex-col justify-between min-h-[200px]"
    >
      <div className="absolute -top-2 -right-2 z-10 flex items-start gap-2">
        {activeRecurringTodosCount > 0 && (
          <div className="relative">
            <div className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
              <ArrowPathIcon className="w-3 h-3" />
              <span className="font-bold">{activeRecurringTodosCount}</span>
            </div>
          </div>
        )}

        {hasUrgentTodos && (
          <div className="relative">
            <div
              className={`${badgeStyle.bgColor} ${badgeStyle.textColor} text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-lg animate-pulse`}
            >
              <ExclamationTriangleIcon className="w-3 h-3" />
              <span className="font-bold">
                {urgent.length + upcoming.length}
              </span>
            </div>
            <div className="absolute top-full right-0 mt-1 bg-slate-800 dark:bg-slate-700 text-white text-xs p-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none min-w-[220px] z-20">
              <div className="space-y-1">
                {urgent.map((todo, index) => (
                  <div key={index} className="flex items-center gap-1.5">
                    <ClockIcon
                      className={`w-3 h-3 flex-shrink-0 ${
                        todo.status === "overdue"
                          ? "text-red-400"
                          : "text-yellow-400"
                      }`}
                    />
                    <span
                      className={`truncate ${
                        todo.status === "overdue"
                          ? "text-red-300"
                          : "text-yellow-300"
                      }`}
                    >
                      {todo.text}
                    </span>
                    {todo.recurrence && todo.recurrence !== "none" && (
                      <span className="flex items-center gap-1 text-purple-300 bg-purple-900/50 px-1.5 py-0.5 rounded-full text-[10px]">
                        <ArrowPathIcon className="w-2.5 h-2.5" />
                        {todo.recurrence}
                      </span>
                    )}
                    <span
                      className={`text-xs ml-auto ${
                        todo.status === "overdue"
                          ? "text-red-400"
                          : "text-yellow-400"
                      }`}
                    >
                      ({formatTimeWarning(todo)})
                    </span>
                  </div>
                ))}
                {upcoming.map((todo, index) => (
                  <div key={index} className="flex items-center gap-1.5">
                    <ClockIcon className="w-3 h-3 text-blue-400 flex-shrink-0" />
                    <span className="truncate text-blue-300">{todo.text}</span>
                    {todo.recurrence && todo.recurrence !== "none" && (
                      <span className="flex items-center gap-1 text-purple-300 bg-purple-900/50 px-1.5 py-0.5 rounded-full text-[10px]">
                        <ArrowPathIcon className="w-2.5 h-2.5" />
                        {todo.recurrence}
                      </span>
                    )}
                    <span className="text-blue-400 text-xs ml-auto">
                      ({formatTimeWarning(todo)})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1">
        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 pr-4 truncate mb-2">
          {note.title}
        </h3>
        <div className="relative">
          <div
            className={`text-slate-600 dark:text-slate-400 text-sm whitespace-pre-wrap break-words transition-all duration-300 ${
              isExpanded
                ? "max-h-32 overflow-y-auto pr-2 custom-scrollbar"
                : "h-12 overflow-hidden"
            }`}
          >
            {isExpanded ? note.content : truncateText(note.content, 120)}
          </div>
          {needsExpansion(note.content) && (
            <button
              onClick={handleExpandToggle}
              className="mt-1 text-blue-500 dark:text-blue-400 text-xs font-medium hover:text-blue-600 dark:hover:text-blue-300 transition-colors flex items-center gap-1"
            >
              {isExpanded ? (
                <>
                  <span>Show less</span>
                  <ChevronUpIcon className="w-3 h-3" />
                </>
              ) : (
                <>
                  <span>Read more</span>
                  <ChevronDownIcon className="w-3 h-3" />
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {totalTodos > 0 && (
        <div className="mt-4 space-y-3">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Todo Progress
              </span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                <CheckCircleIcon className="w-4 h-4 inline-block mr-1 text-green-500" />
                {completedTodos}/{totalTodos}
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  progressPercentage === 100 ? "bg-green-500" : "bg-red-500"
                }`}
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
          {totalRecurringTodos > 0 && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Repetition Progress
                </span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  <ArrowPathIcon className="w-4 h-4 inline-block mr-1 text-purple-500" />
                  {completedRecurringTodos}/{totalRecurringTodos}
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                <div
                  className="bg-purple-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${recurrenceProgressPercentage}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-700/50">
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {note.date
            ? new Date(note.date).toLocaleString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : ""}
        </span>
        <div className="flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note.id);
            }}
            className="p-1.5 bg-red-500/10 dark:bg-red-500/20 hover:bg-red-500/20 dark:hover:bg-red-500/30 rounded-full text-red-500 transition-all duration-200 hover:scale-110"
            title="Delete Note"
          >
            <img src={delete_icon} alt="Delete" className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-1.5 bg-blue-500/10 dark:bg-blue-500/20 hover:bg-blue-500/20 dark:hover:bg-blue-500/30 rounded-full text-blue-500 transition-all duration-200 hover:scale-110"
            title="Edit Note"
          >
            <img src={pensil} alt="Edit" className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteItem;
