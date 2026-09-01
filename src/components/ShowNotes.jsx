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
      <div className="note-card">
        <div className="note-card__body">
          <h3>Doctor's appointment</h3>
          <p>Rmember to take your ID card!</p>
          <div className="date">Jan 13, 2026</div>
        </div>
        <div className="note-card__details">
          <input type="checkbox"></input>
          <span>
            <img
              className="icon-trash"
              src="/images/trash.svg"
              alt="trash svg icon"
            />
          </span>
        </div>
      </div>
    </div>
  );
}
