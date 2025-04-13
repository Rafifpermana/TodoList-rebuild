export const filterNotes = (notes, searchQuery) => {
  const searchLower = searchQuery?.toLowerCase() || "";
  return (notes || []).filter((note) => {
    return (
      (note.title?.toLowerCase() || "").includes(searchLower) ||
      (note.content?.toLowerCase() || "").includes(searchLower) ||
      (note.todos || []).some((todo) =>
        (todo.text?.toLowerCase() || "").includes(searchLower)
      )
    );
  });
};
