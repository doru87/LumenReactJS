import React, { useContext } from "react";
import { UserContext } from "../context/UserProvider";
function DeleteBoard({ isModalOpen, closedModal, idOpenModal, board }) {
  const { deleteBoard } = useContext(UserContext);

  const outerStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    overflow: "auto",
    zIndex: 1,
  };
  return (
    <div
      style={{
        ...outerStyle,
        display: isModalOpen && idOpenModal == board.id ? "block" : "none",
      }}
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel"></h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={() => closedModal()}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <form
              action={`/delete/board/${board.id}`}
              method=""
              onSubmit={(event) => deleteBoard(event, board.id, closedModal)}
            >
              <div>
                <p>Do you want to delete board {board.name} ?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                  onClick={() => closedModal()}
                >
                  No
                </button>
                <button type="submit" className="btn btn-primary">
                  Yes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteBoard;
