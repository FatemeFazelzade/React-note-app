import { useEffect, useState } from "react";
import "./App.css";

import AddNotes from "./components/AddNotes";
import Header from "./components/Header";
import ShowNotes from "./components/ShowNotes";
import Auth from "./components/Auth";
import { supabase } from "./lib/supabaseClient";

function App() {
  const [notes, setNotes] = useState([]);
  const [sortBy, setSortBy] = useState("latest");
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [notesLoading, setNotesLoading] = useState(false);
  const [error, setError] = useState("");

  // Check authentication and listen for login/logout changes
  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) return;

      if (error) setError(error.message);

      setSession(data?.session ?? null);
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Fetch notes belonging to the authenticated user
  useEffect(() => {
    if (!session?.user) {
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
        .eq("user_id", session.user.id)
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
  }, [session]);

  // Delete a note from Supabase
  const handleDeleteNote = async (id) => {
    const { error } = await supabase
      .from("notes")
      .delete()
      .eq("id", id)
      .eq("user_id", session.user.id);

    if (error) {
      setError(error.message);
      return;
    }

    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  // Toggle completion in Supabase
  const handleCompleteNotes = async (id) => {
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
          <AddNotes
            setNotes={setNotes}
            onSort={(e) => setSortBy(e.target.value)}
          />

          <ShowNotes
            notes={sortedNotes}
            onDelete={handleDeleteNote}
            onComplete={handleCompleteNotes}
          />
        </>
      )}

      <button type="button" onClick={() => supabase.auth.signOut()}>
        Log out
      </button>
    </div>
  );
}

export default App;
