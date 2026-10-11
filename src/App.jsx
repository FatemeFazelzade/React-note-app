import { useState } from "react";
import "./App.css";
import AddNotes from "./components/AddNotes";
import Header from "./components/Header";
import ShowNotes from "./components/ShowNotes";

function App() {
  const [notes, setNotes] = useState([]);
  const [sortBy, setSortBy] = useState("latest");

  // Delete
  const handleDeleteNote = (id) => {
    setNotes((prevNotes) => prevNotes.filter((n) => n.id !== id));
  };
  //Toggle
  const handleCompleteNotes = (id) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id ? { ...note, completed: !note.completed } : note,
      ),
    );
  };

  let sortedNotes = notes;
  if (sortBy === "earliest")
    sortedNotes = [...notes].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    );

  if (sortBy === "latest")
    sortedNotes = [...notes].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );

  if (sortBy === "completed")
    sortedNotes = [...notes].sort(
      (a, b) => Number(a.completed) - Number(b.completed),
    );

  return (
    <div className="layout">
      <Header
        notes={sortedNotes}
        sortBy={sortBy}
        onSort={(e) => setSortBy(e.target.value)}
      />
      <AddNotes setNotes={setNotes} onSort={(e) => setSortBy(e.target.value)} />
      <ShowNotes
        notes={sortedNotes}
        onDelete={handleDeleteNote}
        onComplete={handleCompleteNotes}
      />
    </div>
  );
}

export default App;
