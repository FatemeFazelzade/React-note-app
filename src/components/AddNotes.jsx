import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

function AddNotes({ setNotes }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
        })
        .select()
        .single();

      if (insertError) throw insertError;

      const newNote = {
        ...data,
        createdAt: data.created_at,
      };

      setNotes((prevNotes) => [...prevNotes, newNote]);

      setTitle("");
      setDescription("");
    } catch (err) {
      setError(err.message || "Failed to add note.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid-2">
      <form className="search" onSubmit={handleSubmit}>
        <h2>Add new notes</h2>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Write your title"
          className="search__input title"
          required
        />

        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write your description"
          className="search__input body"
          required
        />

        <button type="submit" className="search__button" disabled={loading}>
          {loading ? "Adding..." : "Add note"}
        </button>

        {error && <p role="alert">{error}</p>}
      </form>
    </div>
  );
}

export default AddNotes;
