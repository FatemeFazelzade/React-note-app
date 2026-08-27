function AddNotes() {
  return (
    <div className="grid-3">
      <form className="search" action="" method="get">
        <p>Add new notes</p>
        <input type="text" className="search__input" />
        <input type="text" className="search__input" />
        <input type="submit" value="Add!" className="search__button" />
      </form>
    </div>
  );
}

export default AddNotes;
