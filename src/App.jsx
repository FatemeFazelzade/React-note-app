import { useState } from "react";
import "./App.css";
import AddNotes from "./components/AddNotes";
import Header from "./components/Header";
import ShowNotes from "./components/ShowNotes";

function App() {
  const [notes, setNotes] = useState([]);
  // Delete
  const handleDeleteNote = (id) => {
    setNotes((prevNotes) => prevNotes.filter((n) => n.id !== id));
  };
  //Toggle
  const handleCompleteNotes = (e) => {
    const noteId = Number(e.target.value);
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === noteId ? { ...note, completed: !note.completed } : note,
      ),
    );
  };

  return (
    <div className="layout">
      <Header />
      <AddNotes setNotes={setNotes} />
      <ShowNotes
        notes={notes}
        onDelete={handleDeleteNote}
        onComplete={handleCompleteNotes}
      />
    </div>
  );
}

export default App;
