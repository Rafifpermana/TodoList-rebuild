import { useRef, useState } from "react";
import TodoItem from "./TodoList";
import save from "../assets/save.png";
import add from "../assets/add.png";
import cancel from "../assets/cancel.png";

const PopupConfirmation = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-xl p-6">
        <div className="flex flex-col items-center gap-4">
          <h3 className="text-lg font-medium dark:text-white">Confirm Save</h3>
          <p className="text-gray-600 dark:text-gray-300 text-center">
            Are you sure you want to save this note?
          </p>
          <div className="flex gap-3 w-full mt-4">
            <button
              onClick={onCancel}
              className="flex-1 py-2 px-4 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

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
  const titleRef = useRef();
  const [dueDate, setDueDate] = useState("");
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);

  return (
    <>
      {showConfirmPopup && (
        <PopupConfirmation
          onConfirm={() => {
            onSave();
            setShowConfirmPopup(false);
          }}
          onCancel={() => setShowConfirmPopup(false)}
        />
      )}
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-xl p-6 max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">
            {currentNote.id ? "Edit Notes" : "New Notes"}
          </h2>

          <input
            ref={titleRef}
            type="text"
            placeholder="Note Title"
            value={currentNote.title}
            onChange={(e) =>
              setCurrentNote({ ...currentNote, title: e.target.value })
            }
            className="w-full p-2 mb-4 bg-gray-100 dark:bg-gray-700 rounded-lg border-none focus:ring-2 focus:ring-blue-500 dark:text-white"
          />

          <textarea
            placeholder="Content of Notes..."
            value={currentNote.content}
            onChange={(e) =>
              setCurrentNote({ ...currentNote, content: e.target.value })
            }
            className="w-full p-2 h-32 bg-gray-100 dark:bg-gray-700 rounded-lg border-none focus:ring-2 focus:ring-blue-500 resize-none dark:text-white"
          />

          <div className="mt-6">
            <h3 className="font-medium mb-4">Todo List</h3>

            <div className="flex flex-col gap-2 mb-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add a new todo"
                  value={newTodoText}
                  onChange={(e) => setNewTodoText(e.target.value)}
                  className="flex-1 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg border-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                  onKeyPress={(e) => e.key === "Enter" && addTodo(dueDate)}
                />
                <button
                  onClick={() => addTodo(dueDate)}
                  className="flex items-center text-white bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
                >
                  <img
                    src={add}
                    alt="add"
                    className="w-5 h-5 mx-auto sm:hidden"
                  />
                  <span className="hidden sm:inline">Add</span>
                </button>
              </div>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-lg border-none focus:ring-2 focus:ring-blue-500 dark:text-white mt-2 sm:mt-0"
              />
            </div>

            <div className="space-y-2">
              {(currentNote.todos || []).map((todo) => (
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

          <div className="flex gap-2 mt-6">
            <button
              onClick={onClose}
              className="flex-1 py-2 px-4 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center justify-center"
            >
              <img
                src={cancel}
                alt="cancel"
                className="w-5 h-5 mx-auto sm:hidden"
              />
              <span className="hidden sm:inline">Cancel</span>
            </button>
            <button
              onClick={() => setShowConfirmPopup(true)}
              className="flex-1 py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 flex items-center justify-center"
            >
              <img
                src={save}
                alt="Save"
                className="w-5 h-5 mx-auto sm:hidden"
              />
              <span className="hidden sm:inline">Save</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NoteModal;
