function ShowNotes({ notes }) {
  return (
    <div className="grid-3">
      <ShowNotesNav />
      <NoteList notes={notes} />
    </div>
  );
}

export default ShowNotes;

function ShowNotesNav() {
  return (
    <div>
      <ul className="tab">
        <li className="tab-item">All</li>
        <li className="tab-item">Completed</li>
        <li className="tab-item">Open</li>
      </ul>
    </div>
  );
}

function NoteList({ notes }) {
  if (notes.length === 0) {
    return <p className="empty">Write your first note!</p>;
  }
  return notes.map((note) => (
    <div className="note-card" key={note.id}>
      <div className="note-card__body">
        <h3>{note.title}</h3>
        <p>{note.description}</p>
        <div className="date">{new Date(note.createdAt).toDateString()}</div>
      </div>
      <div className="note-card__details">
        <input type="checkbox" />
        <span>
          <img
            className="icon-trash"
            src="/images/trash.svg"
            alt="trash svg icon"
          />
        </span>
      </div>
    </div>
  ));
}
