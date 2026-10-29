import { useState } from "react";
import Message from "./Message";
import Modal from "./Modal";
import { Pencil, Trash2, Check } from "lucide-react";

function ShowNotes({ notes, onDelete, onComplete, onEdit }) {
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

function ShowNotesNav({ notes }) {
  const allNotes = notes.length;
  const completedNotes = notes.filter((note) => note.completed).length;
  const openNotes = allNotes - completedNotes;

  // پیام اول حالت خالی (سر جای خودش در بخش آمار)
  if (!allNotes) {
    return <Message>ℹ️ No notes has been added yet!</Message>;
  }

  return (
    <div>
      <ul className="tab">
        <li className="tab-item active">
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

function NoteList({ notes, onRequestDelete, onComplete, onEdit }) {
  // پیام دوم حالت خالی (سر جای خودش در بخش لیست نوت‌ها)
  if (notes.length === 0) {
    return <p className="empty">Write your first note! 📝</p>;
  }

  return (
    <div className="note-list">
      {notes.map((note) => (
        <div
          className={`note-card ${note.completed ? "completed" : ""}`}
          key={note.id}
        >
          {/* نوار رنگی عمودی: سمت راست */}
          <span
            className="note-card__stripe"
            style={{ backgroundColor: note.color || "#6366f1" }}
          />

          {/* ردیف بالا: چک‌باکس در گوشه بالا راست */}
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

            {/* دکمه‌های اکشن: حذف (سمت چپ) و ویرایش (سمت راستِ آن) */}
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
