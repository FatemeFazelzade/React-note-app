import { LogOut } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

function Header({ notes = [], sortBy, onSort }) {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Error logging out:", error.message);
  };

  return (
    <header className="grid-1">
      <h1>My Notes ({notes.length})</h1>

      <div className="header-right">
        <div className="sort-menu">
          <select value={sortBy} onChange={onSort}>
            <option value="latest">Sort based on latest</option>
            <option value="earliest">Sort based on earliest</option>
            <option value="completed">Sort based on completed</option>
          </select>
        </div>

        <button
          type="button"
          className="btn-logout"
          onClick={handleLogout}
          title="Log out"
        >
          <LogOut size={16} />
          <span>Log out</span>
        </button>
      </div>
    </header>
  );
}

export default Header;
