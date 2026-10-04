import { useState } from "react";
import "./App.css";
import AddNotes from "./components/AddNotes";
import Header from "./components/Header";
import ShowNotes from "./components/ShowNotes";

function App() {
  const [notes, setNotes] = useState([]);
  const handleDeleteNote = (id) => {
    setNotes((prevNotes) => prevNotes.filter((n) => n.id !== id));
  };
  return (
    <div className="layout">
      <Header />
      <AddNotes setNotes={setNotes} />
      <ShowNotes notes={notes} onDelete={handleDeleteNote} />
    </div>
  );
}

export default App;
