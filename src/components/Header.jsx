import { useState } from "react";

function Header({ notes, sortBy, onSort }) {
  return (
    <div className="grid-1">
      <h1>My Notes ({notes.length})</h1>
      <form className="sort-menu">
        <select
          id="sort-menu__list"
          name="sort-menu__list"
          value={sortBy}
          onChange={onSort}
        >
          <option value="latest">Sort based on latest</option>
          <option value="earliest">Sort based on earliest</option>
          <option value="completed">Sort based on completed</option>
        </select>
      </form>
    </div>
  );
}

export default Header;
