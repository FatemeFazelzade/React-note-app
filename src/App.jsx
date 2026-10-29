import { useEffect, useState } from "react";
import "./App.css";

import AddNotes from "./components/AddNotes";
import Header from "./components/Header";
import ShowNotes from "./components/ShowNotes";
import UpdateModal from "./components/UpdateModal";
import Auth from "./components/Auth";
import EditModal from "./components/EditModal"; // ✅ اضافه شد
import { supabase } from "./lib/supabaseClient";

function App() {
  const [notes, setNotes] = useState([]);
  const [sortBy, setSortBy] = useState("completed");
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [notesLoading, setNotesLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingNote, setEditingNote] = useState(null); // ✅ کنترل مودال ادیت

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setAuthLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const userId = session?.user?.id;

    if (!userId) {
      setNotes([]);
      return;
    }

    let cancelled = false;

    async function fetchNotes() {
      setNotesLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (cancelled) return;

      if (error) {
        setError(error.message);
      } else {
        setNotes(
          data.map((note) => ({
            ...note,
            createdAt: note.created_at,
          })),
        );
      }

      setNotesLoading(false);
    }

    fetchNotes();

    return () => {
      cancelled = true;
    };
  }, [session?.user?.id]);

  const handleDeleteNote = async (id) => {
    if (!session?.user?.id) return;

    const { error } = await supabase
      .from("notes")
      .delete()
      .eq("id", id)
      .eq("user_id", session.user.id);

    if (error) {
      setError(error.message);
      return;
    }

    // اگر همون نوتی که در حال ادیت بود حذف شد، مودال رو ببند
    setEditingNote((prev) => (prev?.id === id ? null : prev));

    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  const handleCompleteNotes = async (id) => {
    if (!session?.user?.id) return;

    const note = notes.find((item) => item.id === id);
    if (!note) return;

    const { data, error } = await supabase
      .from("notes")
      .update({ completed: !note.completed })
      .eq("id", id)
      .eq("user_id", session.user.id)
      .select()
      .single();

    if (error) {
      setError(error.message);
      return;
    }

    setNotes((prev) =>
      prev.map((item) =>
        item.id === id ? { ...data, createdAt: data.created_at } : item,
      ),
    );

    // اگر نوت در حال ادیت همون بود، داخل مودال هم آپدیتش کن
    setEditingNote((prev) =>
      prev?.id === id ? { ...data, createdAt: data.created_at } : prev,
    );
  };

  const handleUpdateNote = async ({ id, title, description, color }) => {
    if (!session?.user?.id) return;

    setError("");

    const { data, error } = await supabase
      .from("notes")
      .update({
        title: title.trim(),
        description: description.trim(),
        color,
      })
      .eq("id", id)
      .eq("user_id", session.user.id)
      .select()
      .single();

    if (error) {
      setError(error.message);
      return;
    }

    setNotes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...data, createdAt: data.created_at } : n,
      ),
    );

    setEditingNote(null); // ✅ بعد از ذخیره، مودال بسته شود
  };

  let sortedNotes = [...notes];

  if (sortBy === "earliest") {
    sortedNotes.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  if (sortBy === "latest") {
    sortedNotes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  if (sortBy === "completed") {
    sortedNotes.sort((a, b) => Number(a.completed) - Number(b.completed));
  }

  if (authLoading) {
    return <p>Checking your session...</p>;
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <div className="layout">
      <UpdateModal />

      <Header
        notes={sortedNotes}
        sortBy={sortBy}
        onSort={(e) => setSortBy(e.target.value)}
      />

      {error && <p role="alert">{error}</p>}

      {notesLoading ? (
        <p>Loading notes...</p>
      ) : (
        <>
          <AddNotes setNotes={setNotes} />

          <ShowNotes
            notes={sortedNotes}
            onDelete={handleDeleteNote}
            onComplete={handleCompleteNotes}
            onEdit={(note) => setEditingNote(note)}
            onEditNote={(note) => setEditingNote(note)}
          />
        </>
      )}

      {editingNote && (
        <EditModal
          editingNote={editingNote}
          onSave={handleUpdateNote}
          onCancel={() => setEditingNote(null)}
        />
      )}
    </div>
  );
}

export default App;
