import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

const NOTE_COLORS = [
  "#ffffff",
  "#fef08a",
  "#86efac",
  "#7dd3fc",
  "#fdba74",
  "#f472b6",
];

function AddNotes({ setNotes }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(NOTE_COLORS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleResetForm = () => {
    setTitle("");
    setDescription("");
    setColor(NOTE_COLORS[0]);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) return;

    setLoading(true);
    setError("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;

      if (!user) {
        throw new Error("Please log in before adding a note.");
      }

      const { data, error: insertError } = await supabase
        .from("notes")
        .insert({
          user_id: user.id,
          title: title.trim(),
          description: description.trim(),
          color: color,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      const newNote = {
        ...data,
        createdAt: data.created_at,
      };

      setNotes((prevNotes) => [...prevNotes, newNote]);
      handleResetForm();
    } catch (err) {
      setError(err.message || "Failed to add note.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid-2 form-container">
      <form className="search" onSubmit={handleSubmit}>
        <div className="form-header">
          <h2>Add new notes</h2>
        </div>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Write your title"
          className="search__input title"
          required
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write your description"
          className="search__input body"
          rows={4}
          required
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />

        <small className="description-hint" dir="ltr">
          Press <kbd>Ctrl + Enter</kbd> to add your note
        </small>

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
                aria-label={`Select color ${c}`}
              />
            ))}
          </div>
        </div>

        <div className="form-action-group">
          <button
            type="submit"
            className="search__button action-btn-submit"
            disabled={loading}
          >
            {loading ? <span>Saving...</span> : <span>Add note</span>}
          </button>
        </div>

        {error && (
          <p className="form-error-msg" role="alert">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}

export default AddNotes;
