function Header() {
  return (
    <div className="grid-1">
      <h1>My Notes (2)</h1>
      <form className="sort-menu">
        <select id="sort-menu__list" name="sort-menu__list">
          <option value="sort based on latest">Sort based on latest</option>
          <option value="sort based on earliest">Sort based on earliest</option>
          <option value="sort based on completed">
            Sort based on completed
          </option>
        </select>
      </form>
    </div>
  );
}

export default Header;
