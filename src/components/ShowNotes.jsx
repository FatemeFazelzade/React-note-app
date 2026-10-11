function ShowNotes({ notes, onDelete, onComplete }) {
  return (
    <div className="grid-3">
      <ShowNotesNav notes={notes} />
      <NoteList notes={notes} onDelete={onDelete} onComplete={onComplete} />
    </div>
  );
}

export default ShowNotes;

function ShowNotesNav({ notes }) {
  const allNotes = notes.length;
  const completedNotes = notes.filter((n) => n.completed).length;
  const openNotes = allNotes - completedNotes;

  return (
    <div>
      <ul className="tab">
        <li className="tab-item">
          All ⭐️ <span>{allNotes}</span>
        </li>
        <li className="tab-item">
          Completed ✅ <span>{completedNotes}</span>
        </li>
        <li className="tab-item">
          Open 📖 <span>{openNotes}</span>
        </li>
      </ul>
    </div>
  );
}

function NoteList({ notes, onDelete, onComplete }) {
  if (notes.length === 0) {
    return <p className="empty">Write your first note!</p>;
  }
  return (
    <div className="note-list">
      {notes.map((note) => (
        <div
          className={`note-card ${note.completed ? "completed" : ""}`}
          key={note.id}
        >
          <div className="note-card__body">
            <h3>{note.title}</h3>
            <p>{note.description}</p>
            <div className="date">
              {new Date(note.createdAt).toDateString()}
            </div>
          </div>
          <div className="note-card__details">
            <input
              type="checkbox"
              name={note.id}
              id={note.id}
              value={note.id}
              checked={note.completed}
              onChange={() => onComplete(note.id)}
            />
            <button
              className="note-card__delete"
              onClick={() => onDelete(note.id)}
            >
              <img
                className="icon-trash"
                src="/images/trash.svg"
                alt="trash svg icon"
              />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
