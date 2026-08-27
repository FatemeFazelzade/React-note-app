import "./App.css";
import AddNotes from "./components/AddNotes";
import Header from "./components/Header";
import ShowNotes from "./components/ShowNotes";

function App() {
  return (
    <div className="layout">
      <Header />
      <AddNotes />
      <ShowNotes />
    </div>
  );
}

export default App;
