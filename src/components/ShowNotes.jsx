import { useState, useReducer } from "react";
import Message from "./Message";
import Modal from "./Modal";
import { Pencil, Trash2, Check } from "lucide-react";

const initialFilterState = { status: "all" };

function filterReducer(state, { type, payload }) {
  switch (type) {
    case "SET_STATUS":
      return { ...state, status: payload };
    default:
      return state;
  }
}

function ShowNotes({ notes, onDelete, onComplete, onEdit }) {
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [{ status }, dispatch] = useReducer(filterReducer, initialFilterState);

  function handleCloseModal() {
    setSelectedNoteId(null);
  }

  function handleConfirmDelete() {
    if (selectedNoteId) {
      onDelete(selectedNoteId);
      handleCloseModal();
    }
  }

  const filteredNotes = notes.filter((note) => {
    if (status === "completed") return note.completed;
    if (status === "open") return !note.completed;
    return true;
  });

  return (
    <div className="grid-3">
      <ShowNotesNav
        notes={notes}
        status={status}
        onFilterChange={(newStatus) =>
          dispatch({ type: "SET_STATUS", payload: newStatus })
        }
      />

      <NoteList
        notes={filteredNotes}
        status={status}
        hasAnyNotes={notes.length > 0}
        onRequestDelete={(id) => setSelectedNoteId(id)}
        onComplete={onComplete}
        onEdit={onEdit}
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

function ShowNotesNav({ notes, status, onFilterChange }) {
  const allNotes = notes.length;
  const completedNotes = notes.filter((note) => note.completed).length;
  const openNotes = allNotes - completedNotes;

  if (!allNotes) {
    return <Message>ℹ️ No notes has been added yet!</Message>;
  }

  return (
    <div>
      <ul className="tab">
        <li
          className={`tab-item ${status === "all" ? "active" : ""}`}
          onClick={() => onFilterChange("all")}
        >
          All ⭐️ <span>{allNotes}</span>
        </li>
        <li
          className={`tab-item ${status === "completed" ? "active" : ""}`}
          onClick={() => onFilterChange("completed")}
        >
          Completed ✅ <span>{completedNotes}</span>
        </li>
        <li
          className={`tab-item ${status === "open" ? "active" : ""}`}
          onClick={() => onFilterChange("open")}
        >
          Open 📖 <span>{openNotes}</span>
        </li>
      </ul>
    </div>
  );
}

function NoteList({
  notes,
  onRequestDelete,
  onComplete,
  onEdit,
  status,
  hasAnyNotes,
}) {
  if (notes.length === 0) {
    return (
      <p className="empty">
        {!hasAnyNotes
          ? "Write your first note! 📝"
          : status === "completed"
            ? "No completed notes yet."
            : status === "open"
              ? "No open notes."
              : "No notes to show."}
      </p>
    );
  }

  return (
    <div className="note-list">
      {notes.map((note) => (
        <div
          className={`note-card ${note.completed ? "completed" : ""}`}
          key={note.id}
        >
          <span
            className="note-card__stripe"
            style={{ backgroundColor: note.color || "#6366f1" }}
          />

          <div className="note-card__top">
            <button
              type="button"
              className={`check-btn ${note.completed ? "checked" : ""}`}
              onClick={() => onComplete(note.id)}
              aria-label="Toggle completed"
            >
              {note.completed && <Check size={12} strokeWidth={3} />}
            </button>
          </div>

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
          </div>

          <div className="note-card__footer">
            <span className="date">
              {new Date(note.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>

            <div className="card-actions">
              <button
                type="button"
                className="icon-action-btn btn-delete"
                onClick={() => onRequestDelete(note.id)}
                aria-label="Delete note"
                title="Delete note"
              >
                <Trash2 size={16} />
              </button>

              <button
                type="button"
                className="icon-action-btn btn-edit"
                onClick={() => (onEdit ? onEdit(note) : onEditNote?.(note))}
                title="Edit note"
              >
                <Pencil size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
