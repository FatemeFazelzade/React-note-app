function AddNotes() {
  return (
    <div className="grid-3">
      <form className="search" action="" method="get">
        <h2>Add new notes</h2>
        <input
          type="text"
          placeholder="Write your headline"
          className="search__input headline"
        />
        <input
          type="text"
          placeholder="Write your description"
          className="search__input body"
        />
        <input type="submit" value="Add!" className="search__button" />
      </form>
    </div>
  );
}

export default AddNotes;
