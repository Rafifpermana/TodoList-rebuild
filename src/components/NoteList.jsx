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
  ArrowPathIcon, // <-- Tambahkan import ikon ini
} from "@heroicons/react/24/solid";

const NoteItem = ({ note, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Fungsi untuk memotong teks jika terlalu panjang
  const truncateText = (text, maxLength) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Fungsi untuk cek apakah konten perlu di-expand
  const needsExpansion = (text) => {
    return text && text.length > 120;
  };

  // --- Kalkulasi untuk SEMUA to-do ---
  const completedTodos =
    note.todos?.filter((todo) => todo.isComplete).length || 0;
  const totalTodos = note.todos?.length || 0;
  const progressPercentage =
    totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;

  // --- Kalkulasi BARU untuk to-do BERULANG ---
  const recurringTodos =
    note.todos?.filter(
      (todo) => todo.recurrence && todo.recurrence !== "none"
    ) || [];
  const totalRecurringTodos = recurringTodos.length;
  const completedRecurringTodos = recurringTodos.filter(
    (todo) => todo.isComplete
  ).length;
  const recurrenceProgressPercentage =
    totalRecurringTodos > 0
      ? (completedRecurringTodos / totalRecurringTodos) * 100
      : 0;

  // ... (fungsi getUpcomingTodos, getBadgeStyle, formatTimeWarning tetap sama) ...
  const getUpcomingTodos = () => {
    if (!note.todos) return { urgent: [], upcoming: [] };

    const now = new Date();
    const urgent = [];
    const upcoming = [];

    note.todos.forEach((todo) => {
      if (todo.isComplete || !todo.dueDate) return;

      const dueDate = new Date(todo.dueDate);
      const timeDiff = dueDate.getTime() - now.getTime();
      const hoursDiff = timeDiff / (1000 * 3600);
      const daysDiff = timeDiff / (1000 * 3600 * 24);

      if (timeDiff < 0) {
        // Overdue
        urgent.push({ ...todo, status: "overdue", diff: Math.abs(daysDiff) });
      } else if (hoursDiff <= 24) {
        // Due within 24 hours
        urgent.push({ ...todo, status: "urgent", diff: hoursDiff });
      } else if (daysDiff <= 3) {
        // Due within 3 days
        upcoming.push({ ...todo, status: "upcoming", diff: daysDiff });
      }
    });

    return { urgent, upcoming };
  };

  const { urgent, upcoming } = getUpcomingTodos();
  const hasUrgentTodos = urgent.length > 0 || upcoming.length > 0;

  const getBadgeStyle = () => {
    if (urgent.some((todo) => todo.status === "overdue")) {
      return {
        bgColor: "bg-red-500",
        textColor: "text-white",
      };
    } else if (urgent.length > 0) {
      return {
        bgColor: "bg-yellow-500",
        textColor: "text-white",
      };
    } else if (upcoming.length > 0) {
      return {
        bgColor: "bg-blue-500",
        textColor: "text-white",
      };
    }
    return {
      bgColor: "bg-red-500",
      textColor: "text-white",
    };
  };

  const formatTimeWarning = (todo) => {
    if (todo.status === "overdue") {
      const days = Math.floor(todo.diff);
      return `${days} hari terlambat`;
    } else if (todo.status === "urgent") {
      const hours = Math.floor(todo.diff);
      return hours < 1 ? "Kurang dari 1 jam lagi" : `${hours} jam lagi`;
    } else if (todo.status === "upcoming") {
      const days = Math.floor(todo.diff);
      return `${days} hari lagi`;
    }
  };

  const handleExpandToggle = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const badgeStyle = getBadgeStyle();

  return (
    <div
      onClick={onEdit}
      className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-sm p-5 rounded-xl group relative transition-all duration-300 hover:scale-105 hover:shadow-xl border border-slate-200/20 dark:border-slate-700/50 cursor-pointer flex flex-col justify-between min-h-[200px]"
    >
      {/* ... (Badge peringatan todo urgent tidak berubah) ... */}
      {hasUrgentTodos && (
        <div className="absolute -top-2 -right-2 z-10">
          <div className="relative">
            <div
              className={`${badgeStyle.bgColor} ${badgeStyle.textColor} text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-lg animate-pulse`}
            >
              <ExclamationTriangleIcon className="w-3 h-3" />
              <span className="font-bold">
                {urgent.length + upcoming.length}
              </span>
            </div>
            {/* Tooltip untuk menampilkan detail peringatan */}
            <div className="absolute top-full right-0 mt-1 bg-slate-800 dark:bg-slate-700 text-white text-xs p-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none min-w-[180px] z-20">
              <div className="space-y-1">
                {urgent.map((todo, index) => {
                  const iconColor =
                    todo.status === "overdue"
                      ? "text-red-400"
                      : "text-yellow-400";
                  const textColor =
                    todo.status === "overdue"
                      ? "text-red-300"
                      : "text-yellow-300";
                  const timeColor =
                    todo.status === "overdue"
                      ? "text-red-400"
                      : "text-yellow-400";

                  return (
                    <div key={index} className="flex items-center gap-1">
                      <ClockIcon
                        className={`w-3 h-3 flex-shrink-0 ${iconColor}`}
                      />
                      <span className={`truncate ${textColor}`}>
                        {todo.text}
                      </span>
                      <span className={`text-xs ${timeColor}`}>
                        ({formatTimeWarning(todo)})
                      </span>
                    </div>
                  );
                })}
                {upcoming.map((todo, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <ClockIcon className="w-3 h-3 text-blue-400 flex-shrink-0" />
                    <span className="truncate text-blue-300">{todo.text}</span>
                    <span className="text-blue-400 text-xs">
                      ({formatTimeWarning(todo)})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bagian Konten Utama */}
      <div className="flex-1">
        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 pr-4 truncate mb-2">
          {note.title}
        </h3>

        {/* Konten dengan scroll dan expand */}
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

          {/* Tombol Read More/Less */}
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

      {/* Bagian To-do List (jika ada) */}
      {totalTodos > 0 && (
        <div className="mt-4 space-y-3">
          {" "}
          {/* Beri jarak antar progress bar */}
          {/* --- Progress Bar SEMUA TODO --- */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Todo Progress
                </span>
                {hasUrgentTodos && (
                  <div
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${
                      urgent.some((todo) => todo.status === "overdue")
                        ? "bg-red-100 dark:bg-red-900/30"
                        : urgent.length > 0
                        ? "bg-yellow-100 dark:bg-yellow-900/30"
                        : "bg-blue-100 dark:bg-blue-900/30"
                    }`}
                  >
                    <ExclamationTriangleIcon
                      className={`w-3 h-3 ${
                        urgent.some((todo) => todo.status === "overdue")
                          ? "text-red-500"
                          : urgent.length > 0
                          ? "text-yellow-500"
                          : "text-blue-500"
                      }`}
                    />
                    <span
                      className={`text-xs font-medium ${
                        urgent.some((todo) => todo.status === "overdue")
                          ? "text-red-600 dark:text-red-400"
                          : urgent.length > 0
                          ? "text-yellow-600 dark:text-yellow-400"
                          : "text-blue-600 dark:text-blue-400"
                      }`}
                    >
                      {urgent.some((todo) => todo.status === "overdue")
                        ? "Overdue!"
                        : urgent.length > 0
                        ? "Urgent!"
                        : "Upcoming"}
                    </span>
                  </div>
                )}
              </div>
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
          {/* --- Progress Bar BARU untuk TUGAS BERULANG --- */}
          {totalRecurringTodos > 0 && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Repetition Progress
                </span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  <ArrowPathIcon className="w-4 h-4 inline-block mr-1 text-blue-500" />
                  {completedRecurringTodos}/{totalRecurringTodos}
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                <div
                  className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${recurrenceProgressPercentage}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bagian Footer Kartu */}
      <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-700/50">
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {new Date(note.date).toLocaleString("id-ID")}
        </span>
        {/* Tombol Aksi - Selalu tampil di mobile, hover di desktop */}
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
