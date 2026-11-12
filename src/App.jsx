import { useEffect, useReducer } from "react";
import { supabase } from "./lib/supabaseClient";
import Auth from "./components/Auth";
import Header from "./components/Header";
import AddNotes from "./components/AddNotes";
import ShowNotes from "./components/ShowNotes";
import EditModal from "./components/EditModal";
import UpdateModal from "./components/UpdateModal";
import { Toaster } from "sonner";
import {
  NotesProvider,
  useNotes,
  useNotesDispatch,
} from "./context/NotesContext";

const initialState = {
  sortBy: "completed",
  session: null,
  authLoading: true,
  notesLoading: false,
  error: "",
  editingNote: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_SESSION":
      return { ...state, session: GAPGPTMASKTOKENy6ohi8urpfgX5X };

    case "SET_AUTH_LOADING":
      return { ...state, authLoading: GAPGPTMASKTOKENy6ohi8urpfgX6X };

    case "SET_NOTES_LOADING":
      return { ...state, notesLoading: GAPGPTMASKTOKENy6ohi8urpfgX7X };

    case "SET_ERROR":
      return { ...state, error: GAPGPTMASKTOKENy6ohi8urpfgX8X };

    case "SET_EDITING_NOTE":
      return { ...state, editingNote: GAPGPTMASKTOKENy6ohi8urpfgX9X };

    case "SET_SORT_BY":
      return { ...state, sortBy: GAPGPTMASKTOKENy6ohi8urpfgX10X };

    default:
      return state;
  }
}

function AppContent() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const notes = useNotes();
  const notesDispatch = useNotesDispatch();

  const { sortBy, session, authLoading, notesLoading, error, editingNote } =
    state;

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch({ type: "SET_SESSION", payload: session });
      dispatch({ type: "SET_AUTH_LOADING", payload: false });
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const userId = session?.user?.id;

    notesDispatch({ type: "set", payload: [] });

    if (!userId) {
      dispatch({ type: "SET_NOTES_LOADING", payload: false });
      dispatch({ type: "SET_EDITING_NOTE", payload: null });
      return;
    }

    let cancelled = false;

    async function fetchNotes() {
      dispatch({ type: "SET_NOTES_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: "" });

      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (cancelled) return;

      if (error) {
        dispatch({ type: "SET_ERROR", payload: error.message });
      } else {
        notesDispatch({
          type: "set",
          payload: data.map((note) => ({
            ...note,
            createdAt: note.created_at,
          })),
        });
      }

      dispatch({ type: "SET_NOTES_LOADING", payload: false });
    }

    fetchNotes();

    return () => {
      cancelled = true;
    };
  }, [session?.user?.id, notesDispatch]);

  const handleDeleteNote = async (id) => {
    if (!session?.user?.id) return;

    const { error } = await supabase
      .from("notes")
      .delete()
      .eq("id", id)
      .eq("user_id", session.user.id);

    if (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
      return;
    }

    notesDispatch({ type: "delete", payload: id });

    if (editingNote?.id === id) {
      dispatch({ type: "SET_EDITING_NOTE", payload: null });
    }
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
      dispatch({ type: "SET_ERROR", payload: error.message });
      return;
    }

    const updatedNote = { ...data, createdAt: data.created_at };

    notesDispatch({ type: "complete", payload: updatedNote });

    if (editingNote?.id === id) {
      dispatch({ type: "SET_EDITING_NOTE", payload: updatedNote });
    }
  };

  const handleUpdateNote = async ({ id, title, description, color }) => {
    if (!session?.user?.id) return;

    dispatch({ type: "SET_ERROR", payload: "" });

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
      dispatch({ type: "SET_ERROR", payload: error.message });
      return;
    }

    notesDispatch({
      type: "update",
      payload: { ...data, createdAt: data.created_at },
    });
    dispatch({ type: "SET_EDITING_NOTE", payload: null });
  };

  const sortedNotes = [...notes];

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

  return (
    <>
      <Toaster position="top-center" richColors closeButton />

      {!session ? (
        <Auth />
      ) : (
        <div className="layout">
          <UpdateModal />

          <Header
            notes={sortedNotes}
            sortBy={sortBy}
            onSort={(e) =>
              dispatch({ type: "SET_SORT_BY", payload: e.target.value })
            }
          />

          {error && <p role="alert">{error}</p>}

          {notesLoading ? (
            <p>Loading notes...</p>
          ) : (
            <>
              <AddNotes />

              <ShowNotes
                notes={sortedNotes}
                onDelete={handleDeleteNote}
                onComplete={handleCompleteNotes}
                onEdit={(note) =>
                  dispatch({ type: "SET_EDITING_NOTE", payload: note })
                }
                onEditNote={(note) =>
                  dispatch({ type: "SET_EDITING_NOTE", payload: note })
                }
              />
            </>
          )}

          {editingNote && (
            <EditModal
              editingNote={editingNote}
              onSave={handleUpdateNote}
              onCancel={() =>
                dispatch({ type: "SET_EDITING_NOTE", payload: null })
              }
            />
          )}
        </div>
      )}
    </>
  );
}

function App() {
  return (
    <NotesProvider>
      <AppContent />
    </NotesProvider>
  );
}

export default App;
