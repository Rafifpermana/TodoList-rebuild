import { useState } from "react";

const useTodos = (currentNote, setCurrentNote) => {
  const [newTodoText, setNewTodoText] = useState("");

  const addTodo = (dueDate) => {
    if (!newTodoText.trim()) return;
    const newTodo = {
      id: Date.now(),
      text: newTodoText.trim(),
      isComplete: false,
      dueDate: dueDate || null,
    };

    setCurrentNote((prev) => ({
      ...prev,
      todos: [...prev.todos, newTodo],
    }));

    setNewTodoText("");
  };

  const toggleTodo = (id) => {
    setCurrentNote((prev) => ({
      ...prev,
      todos: prev.todos.map((todo) =>
        todo.id === id ? { ...todo, isComplete: !todo.isComplete } : todo
      ),
    }));
  };

  const deleteTodo = (id) => {
    setCurrentNote((prev) => ({
      ...prev,
      todos: prev.todos.filter((todo) => todo.id !== id),
    }));
  };

  const editTodo = (id, newText, newDueDate) => {
    if (newText !== null && newText !== undefined) {
      setCurrentNote((prev) => ({
        ...prev,
        todos: prev.todos.map((todo) =>
          todo.id === id
            ? {
                ...todo,
                text: newText.trim(),
                dueDate: newDueDate || null,
              }
            : todo
        ),
      }));
    }
  };

  return {
    newTodoText,
    setNewTodoText,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
  };
};

export default useTodos;
