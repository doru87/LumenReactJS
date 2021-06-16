import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserProvider";
import { useHistory } from "react-router-dom";
import DeleteBoard from "./DeleteBoard";

function ListAllBoards() {
  const { boards, logout } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idOpenModal, setIdOpenModal] = useState();

  let history = useHistory();

  const openModal = (id) => {
    setIsModalOpen(true);
    setIdOpenModal(id);
  };

  const closedModal = () => {
    setIsModalOpen(false);
  };

  const logoutUser = async () => {
    const response = await logout();
    if (response !== undefined && response.status === 200) {
      history.push("/login");
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="d-flex justify-content-start mt-5">
          <Link to={"/board/add"}>
            <button className="btn btn-primary">Add</button>
          </Link>
        </div>
      </div>
      <div className="row">
        <div className="d-flex justify-content-end">
          <button className="btn btn-dark" onClick={() => logoutUser()}>
            Logout
          </button>
        </div>
      </div>
      <div className="row">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Board Id</th>
              <th scope="col">Board Name</th>
              <th scope="col">User assigned to board</th>
              <th scope="col"></th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {boards &&
              boards.map((board) => (
                <tr key={board.id}>
                  <td>{board.id}</td>
                  <td>{board.name}</td>
                  <td>{board.user.name}</td>
                  <td>
                    <Link to={`/edit/board/${board.id}`}>
                      <button className="btn btn-success">Edit</button>
                    </Link>
                  </td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => openModal(board.id)}
                    >
                      Delete
                    </button>
                    <DeleteBoard
                      isModalOpen={isModalOpen}
                      closedModal={closedModal}
                      board={board}
                      idOpenModal={idOpenModal}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ListAllBoards;
