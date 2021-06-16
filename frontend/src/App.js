import "./App.css";
import { Switch, Route } from "react-router-dom";
import Login from "./components/Login";
import ListAllBoards from "./components/ListAllBoards";
import UserProvider from "./context/UserProvider";
import EditBoard from "./components/EditBoard";
import AddBoard from "./components/AddBoard";
import PrivateRoute from "./components/PrivateRoute";
import DeleteBoard from "./components/DeleteBoard";

function App() {
  return (
    <UserProvider>
      <div className="App">
        <Switch>
          <PrivateRoute path="/allboards" exact component={ListAllBoards} />
          <Route path="/login" exact component={Login} />
          <PrivateRoute path="/edit/board/:id" exact component={EditBoard} />
          <PrivateRoute path="/board/add" exact component={AddBoard} />
          <PrivateRoute
            path="/delete/board/:id"
            exact
            component={DeleteBoard}
          />
        </Switch>
      </div>
    </UserProvider>
  );
}

export default App;
