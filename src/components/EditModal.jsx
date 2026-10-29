import { useState } from "react";
import { X, Check } from "lucide-react";

const NOTE_COLORS = [
  "#ffffff",
  "#fef08a",
  "#86efac",
  "#7dd3fc",
  "#fdba74",
  "#f472b6",
];

function EditModal({ editingNote, onSave, onCancel }) {
  const [title, setTitle] = useState(editingNote.title || "");
  const [description, setDescription] = useState(editingNote.description || "");
  const [color, setColor] = useState(editingNote.color || NOTE_COLORS[0]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setLoading(true);
    await onSave({
      id: editingNote.id,
      title,
      description,
      color,
    });
    setLoading(false);
  };

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Edit Note</h3>
          <button type="button" className="modal-close-btn" onClick={onCancel}>
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <input
            type="text"
            className="search__input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            required
          />

          <textarea
            className="search__input body"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            rows={4}
            required
          />

          <div className="color-picker">
            <span className="color-picker__label">Pick a color:</span>
            <div className="color-picker__palette">
              {NOTE_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`color-picker__swatch ${color === c ? "active" : ""}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="search__button"
              style={{ flex: "none" }}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditModal;
