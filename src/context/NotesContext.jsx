import { createContext, useContext, useReducer } from "react";

const NotesContext = createContext(null);
const NotesDispatchContext = createContext(null);

function notesReducer(notes, action) {
  switch (action.type) {
    case "set":
      return action.payload;

    case "add":
      return [action.payload, ...notes];

    case "delete":
      return notes.filter((note) => note.id !== action.payload);

    case "complete":
    case "update":
      return notes.map((note) =>
        note.id === action.payload.id ? action.payload : note,
      );

    default:
      throw new Error(`Unknown notes action: ${action.type}`);
  }
}

export function NotesProvider({ children }) {
  const [notes, dispatch] = useReducer(notesReducer, []);

  return (
    <NotesContext.Provider value={notes}>
      <NotesDispatchContext.Provider value={dispatch}>
        {children}
      </NotesDispatchContext.Provider>
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const notes = useContext(NotesContext);

  if (notes === null) {
    throw new Error("useNotes must be used within NotesProvider");
  }

  return notes;
}

export function useNotesDispatch() {
  const dispatch = useContext(NotesDispatchContext);

  if (dispatch === null) {
    throw new Error("useNotesDispatch must be used within NotesProvider");
  }

  return dispatch;
}
