function ShowNotes() {
  return (
    <div className="grid-3">
      <ShowNotesNav />
    </div>
  );
}

export default ShowNotes;

function ShowNotesNav() {
  return (
    <div>
      <ul className="tab">
        <li className="tab-item">All</li>
        <li className="tab-item">Completed</li>
        <li className="tab-item">Open</li>
      </ul>
    </div>
  );
}
