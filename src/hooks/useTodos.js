import { useState } from "react";
import { addDays, addWeeks, addMonths } from "date-fns";

const useTodos = (currentNote, setCurrentNote) => {
  const [newTodoText, setNewTodoText] = useState("");

  const addTodo = (todoText, dueDate, recurrence = "none") => {
    if (!todoText.trim()) return;
    const newTodo = {
      id: Date.now(),
      text: todoText.trim(),
      isComplete: false,
      dueDate: dueDate || null,
      recurrence: recurrence,
    };
    setCurrentNote((prev) => ({
      ...prev,
      todos: [newTodo, ...(prev.todos || [])],
    }));
    setNewTodoText("");
  };

  const toggleTodo = (id) => {
    // --- PERBAIKAN: Tambahkan pengecekan ID ---
    if (!id) {
      console.error("Attempted to toggle a todo with an invalid ID.");
      return;
    }

    let nextTodo = null;
    const updatedTodos = currentNote.todos.map((todo) => {
      if (todo.id === id) {
        if (!todo.isComplete && todo.recurrence && todo.recurrence !== "none") {
          let nextDueDate = new Date(todo.dueDate);
          if (todo.recurrence === "daily")
            nextDueDate = addDays(nextDueDate, 1);
          else if (todo.recurrence === "weekly")
            nextDueDate = addWeeks(nextDueDate, 1);
          else if (todo.recurrence === "monthly")
            nextDueDate = addMonths(nextDueDate, 1);
          nextTodo = {
            ...todo,
            id: Date.now(),
            isComplete: false,
            dueDate: nextDueDate.toISOString(),
          };
        }
        return { ...todo, isComplete: !todo.isComplete };
      }
      return todo;
    });

    if (nextTodo) {
      updatedTodos.push(nextTodo);
    }
    setCurrentNote((prev) => ({ ...prev, todos: updatedTodos }));
  };

  const deleteTodo = (id) => {
    // --- PERBAIKAN: Tambahkan pengecekan ID ---
    if (!id) {
      console.error("Attempted to delete a todo with an invalid ID.");
      return;
    }
    setCurrentNote((prev) => ({
      ...prev,
      todos: prev.todos.filter((todo) => todo.id !== id),
    }));
  };

  const editTodo = (id, newText, newDueDate, newRecurrence) => {
    // --- PERBAIKAN: Tambahkan pengecekan ID ---
    if (!id) {
      console.error("Attempted to edit a todo with an invalid ID.");
      return;
    }

    setCurrentNote((prev) => {
      const todoToEdit = prev.todos.find((todo) => todo.id === id);
      const otherTodos = prev.todos.filter((todo) => todo.id !== id);
      if (!todoToEdit) return prev;

      const updatedTodo = {
        ...todoToEdit,
        id: Date.now(),
        text: newText.trim(),
        dueDate: newDueDate || null,
        recurrence: newRecurrence,
        isComplete: false,
      };

      return {
        ...prev,
        todos: [updatedTodo, ...otherTodos],
      };
    });
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
