import pensil from "../assets/pensil.png";
import delete_icon from "../assets/delete_icon.png";
import not_tick from "../assets/not_tick.png";
import tick from "../assets/tick.png";

const NoteItem = ({ note, onEdit, onDelete }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg relative group transition-colors duration-300">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-lg">{note.title}</h3>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
          >
            <img src={pensil} alt="Edit" className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
          >
            <img src={delete_icon} alt="Delete" className="w-5 h-5" />
          </button>
        </div>
      </div>

      <p className="text-gray-600 dark:text-gray-300 text-sm whitespace-pre-wrap mb-3">
        {note.content}
      </p>

      {(note.todos || []).length > 0 && (
        <div className="border-t pt-3">
          <div className="text-xs text-gray-500 mb-2">Todo List:</div>
          <div className="space-y-2">
            {(note.todos || []).slice(0, 3).map((todo) => (
              <div key={todo.id} className="flex items-center gap-2 text-sm">
                <img
                  src={todo.isComplete ? tick : not_tick}
                  alt="status"
                  className="w-4 h-4"
                />
                <span
                  className={`${
                    todo.isComplete
                      ? "line-through text-gray-400 dark:text-gray-500"
                      : "text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {todo.text}
                </span>
              </div>
            ))}
            {(note.todos || []).length > 3 && (
              <div className="text-xs text-gray-400 dark:text-gray-500">
                + {(note.todos || []).length - 3} todo lainnya...
              </div>
            )}
          </div>
        </div>
      )}

      <div className="text-xs text-gray-400 dark:text-gray-500 mt-2">
        {note.date}
      </div>
    </div>
  );
};

export default NoteItem;
