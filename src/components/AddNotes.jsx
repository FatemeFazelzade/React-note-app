import { useState } from "react";

function AddNotes() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    const newNote = {
      title,
      description,
      id: Date.now,
      completed: false,
      createdAt: new Date().toISOString,
    };
    setTitle("");
    setDescription("");
  };

  return (
    <div className="grid-3">
      <form className="search" onSubmit={handleSubmit}>
        <h2>Add new notes</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Write your title"
          className="search__input title"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write your description"
          className="search__input body"
        />
        <button type="submit" className="search__button">
          Add note
        </button>
      </form>
    </div>
  );
}

export default AddNotes;
