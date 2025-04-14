import { useState } from "react";
import not_tick from "../assets/not_tick.png";
import tick from "../assets/tick.png";
import pensil from "../assets/pensil.png";
import delete_icon from "../assets/delete_icon.png";

const TodoItem = ({ todo, onToggle, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editDueDate, setEditDueDate] = useState(todo.dueDate || "");
  const isOverdue =
    todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.isComplete;

  const handleSave = () => {
    if (editText.trim() !== "") {
      onEdit(todo.id, editText, editDueDate);
      setIsEditing(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <div className="flex items-center gap-2 flex-1">
        <img
          src={todo.isComplete ? tick : not_tick}
          alt="status"
          className="w-5 h-5 cursor-pointer"
          onClick={() => onToggle(todo.id)}
        />

        {isEditing ? (
          <div className="flex flex-col gap-2 w-full">
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSave()}
              className="flex-1 p-1 bg-white dark:bg-gray-600 rounded border border-gray-300 dark:border-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              autoFocus
            />
            <input
              type="date"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
              className="p-1 bg-white dark:bg-gray-600 rounded border border-gray-300 dark:border-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={handleSave}
              className="text-white bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded"
            >
              Simpan
            </button>
          </div>
        ) : (
          <div className="flex flex-col flex-1">
            <span
              className={`${
                todo.isComplete
                  ? "line-through text-gray-500 dark:text-gray-400"
                  : isOverdue
                  ? "text-red-500 dark:text-red-400"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              {todo.text}
              {isOverdue && <span className="ml-1">(overdue)</span>}
            </span>
            {todo.dueDate && (
              <span
                className={`text-xs ${
                  todo.isComplete
                    ? "text-gray-400 dark:text-gray-500"
                    : isOverdue
                    ? "text-red-400 dark:text-red-300"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {new Date(todo.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="p-1 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <img src={pensil} alt="edit" className="w-5 h-5" />
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
        >
          <img src={delete_icon} alt="delete" className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
