import { useState } from "react";
import Message from "./Message";
import Modal from "./Modal";

function ShowNotes({ notes, onDelete, onComplete }) {
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  function handleCloseModal() {
    setSelectedNoteId(null);
  }

  function handleConfirmDelete() {
    if (selectedNoteId) {
      onDelete(selectedNoteId);
      handleCloseModal();
    }
  }

  return (
    <div className="grid-3">
      <ShowNotesNav notes={notes} />
      <NoteList
        notes={notes}
        onRequestDelete={(id) => setSelectedNoteId(id)}
        onComplete={onComplete}
      />
      <Modal
        isOpen={Boolean(selectedNoteId)}
        onClose={handleCloseModal}
        title="Delete Note"
      >
        <p>
          Are you sure you want to delete this note? This action cannot be
          undone.
        </p>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={handleCloseModal}>
            Cancel
          </button>
          <button className="btn-danger" onClick={handleConfirmDelete}>
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default ShowNotes;

function ShowNotesNav({ notes }) {
  const allNotes = notes.length;
  const completedNotes = notes.filter((n) => n.completed).length;
  const openNotes = allNotes - completedNotes;

  if (!allNotes) return <Message>ℹ️ No notes has been added yet!</Message>;

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

function NoteList({ notes, onRequestDelete, onComplete }) {
  if (notes.length === 0) {
    return <p className="empty">Write your first note!</p>;
  }

  return (
    <div className="note-list">
      {notes.map((note) => (
        <div
          className={`note-card ${note.completed ? "completed" : ""}`}
          key={note.id}
          style={{ backgroundColor: note.color || "#f1f5f9" }}
        >
          <div className="note-card__body">
            <h3>{note.title}</h3>
            <p>
              {note.description.split(/\r?\n/).map((line, index, arr) => (
                <span key={index}>
                  {line}
                  {index < arr.length - 1 && <br />}
                </span>
              ))}
            </p>

            <div className="date">
              {new Date(note.createdAt).toDateString()}
            </div>
          </div>
          <div className="note-card__details">
            <input
              type="checkbox"
              name={String(note.id)}
              id={String(note.id)}
              checked={note.completed}
              onChange={() => onComplete(note.id)}
            />
            <button
              className="note-card__delete"
              onClick={() => onRequestDelete(note.id)}
              aria-label="Delete note"
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
