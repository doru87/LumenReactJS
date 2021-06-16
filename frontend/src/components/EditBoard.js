import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../context/UserProvider";
import { useHistory } from "react-router-dom";

function EditBoard() {
  const { axiosAuth, editBoard, users } = useContext(UserContext);

  const [selectedBoard, setSelectedBoard] = useState({});
  const [selectedUserId, setSelectedUserId] = useState();

  const { id } = useParams();
  let history = useHistory();
  const errorsRef = useRef();

  useEffect(() => {
    async function fetchSelectedBoard() {
      await axiosAuth
        .get(`/board/${id}`)
        .then((response) => {
          setSelectedBoard(response.data.data[1]);
        })
        .catch((error) => {
          if (error.response) {
            errorsRef.current.classList.remove("collapse");
            switch (error.response.status) {
              case 404:
                errorsRef.current.innerHTML =
                  error.response.data.errorMessages.error;
            }
          }
        });
    }
    fetchSelectedBoard();
  }, []);

  const handleChange = (e) => {
    setSelectedBoard({ ...selectedBoard, [e.target.name]: e.target.value });
  };
  const onSubmit = async (e) => {
    e.preventDefault();

    const response = await editBoard(selectedBoard, selectedUserId, errorsRef);
    if (response !== undefined && response.status === 200) {
      history.push("/allboards");
    }
  };

  const handleSelectChange = (e) => {
    setSelectedUserId(e.target.value);
  };

  return (
    <div className="container">
      <div className="row">
        <div
          className="col-4 mt-5 mx-auto alert alert-danger collapse"
          role="alert"
          ref={errorsRef}
        ></div>
      </div>
      <div className="row">
        <div className="col-4 mt-5 mx-auto">
          <div className="card">
            <div className="card-body">
              <form onSubmit={(e) => onSubmit(e)}>
                <div className="form-group">
                  <label htmlFor="name">Board Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    id="name"
                    value={(selectedBoard && selectedBoard.name) || " "}
                    onChange={(e) => handleChange(e)}
                  />
                  <select
                    className="form-select form-select-lg mt-3 mb-3"
                    onChange={handleSelectChange}
                  >
                    <option value="">Select a user</option>
                    {users.map((user) => (
                      <option
                        key={user.id}
                        value={user.id}
                        selected={
                          selectedBoard && selectedBoard.user_id == user.id
                        }
                      >
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-3 ml-auto">
                  <button className="btn btn-warning" type="submit">
                    Update Board
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditBoard;
