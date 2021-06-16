import React, { useState, useEffect, createContext } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

export const UserContext = createContext();

function UserProvider({ children }) {
  const [boards, setBoards] = useState([]);
  const [users, setUsers] = useState([]);
  const [didMount, setDidMount] = useState(false);

  const apiURL = "http://127.0.0.1:8000/api";
  let location = useLocation();

  const getTokenData = (data) => {
    localStorage.setItem("accessToken", JSON.stringify(data.data.access_token));
    localStorage.setItem("isLoggedIn", JSON.stringify(true));
  };

  const axiosAuth = axios.create({
    baseURL: apiURL,
    headers: {
      Authorization: `Bearer ${JSON.parse(
        localStorage.getItem("accessToken")
      )}`,
    },
  });

  async function fetchAllBoards() {
    await axiosAuth
      .get("/boards")
      .then((response) => {
        setBoards(response.data.data[1]);
        setUsers(response.data.data[3]);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
        }
      });
  }
  useEffect(() => {
    setDidMount(true);
    if (didMount && JSON.parse(localStorage.getItem("accessToken"))) {
      fetchAllBoards();
    }
    return () => setDidMount(false);
  }, [didMount, location]);

  const editBoard = async (selectedBoard, selectedUserId, errorsRef) => {
    var editData = {
      name: selectedBoard.name,
      id: selectedUserId !== undefined ? selectedUserId : selectedBoard.user_id,
    };

    const response = await axiosAuth
      .patch(`/board/update/${selectedBoard.id}`, editData)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        if (error.response) {
          errorsRef.current.classList.remove("collapse");

          switch (error.response.status) {
            case 400:
              errorsRef.current.innerHTML =
                error.response.data.errorMessages.name == undefined &&
                error.response.data.errorMessages.id !== undefined
                  ? error.response.data.errorMessages.id
                  : error.response.data.errorMessages.name !== undefined &&
                    error.response.data.errorMessages.id == undefined
                  ? error.response.data.errorMessages.name
                  : error.response.data.errorMessages.name !== undefined &&
                    error.response.data.errorMessages.id !== undefined
                  ? error.response.data.errorMessages.name +
                    " / " +
                    error.response.data.errorMessages.id
                  : "";
          }
        }
      });
    return response;
  };

  const addBoard = async (boardName, selectedUserId, userErrorRef) => {
    var addData = {
      name: boardName,
      id: selectedUserId,
    };
    const response = await axiosAuth
      .put("/board/add", addData)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        if (error.response) {
          userErrorRef.current.classList.remove("collapse");

          userErrorRef.current.innerHTML =
            error.response.data.errorMessages.name == undefined &&
            error.response.data.errorMessages.id !== undefined
              ? error.response.data.errorMessages.id
              : error.response.data.errorMessages.name !== undefined &&
                error.response.data.errorMessages.id == undefined
              ? error.response.data.errorMessages.name
              : error.response.data.errorMessages.name !== undefined &&
                error.response.data.errorMessages.id !== undefined
              ? error.response.data.errorMessages.name +
                " / " +
                error.response.data.errorMessages.id
              : "";
        }
      });
    return response;
  };

  const deleteBoard = async (event, boardId, closedModal) => {
    event.preventDefault();
    await axiosAuth.delete(`/board/delete/${boardId}`).then((response) => {
      setBoards(response.data.data.boards);
    });
    closedModal();
  };

  const logout = async () => {
    const response = await axiosAuth.post("/logout").then((response) => {
      return response;
    });
    localStorage.removeItem("accessToken");
    localStorage.removeItem("isLoggedIn");

    return response;
  };
  return (
    <UserContext.Provider
      value={{
        getTokenData,
        editBoard,
        addBoard,
        deleteBoard,
        logout,
        boards,
        users,
        apiURL,
        axiosAuth,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
