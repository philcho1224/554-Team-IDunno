import React, { useContext } from 'react';
// import logo from './logo.svg';
import {
  BrowserRouter as Router,
  Route,
  Link,
  useRouteMatch,
  useParams,
  NavLink
} from "react-router-dom";
import './App.css';
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Account from "./components/Account";
import { AuthProvider, AuthContext } from "./firebase/Auth";
import PrivateRoute from "./components/PrivateRoute";
import SignOutBtn from "./components/SignOut";

const Navigation = () => {
  const { currentUser } = useContext(AuthContext);
  return (
    <div>
      { currentUser ? <NavOnAuth /> : <NavNonAuth /> }
    </div>
  );
}

const NavOnAuth = () => {
  return (
    <nav className="navigation">
      <ul>
        <li>
          <NavLink exact to="/">Landing</NavLink>
        </li>
        <li>
          <NavLink exact to="/maeket">Marketplace</NavLink>
        </li>
        <li>
          <NavLink exact to="/account">Account</NavLink>
        </li>
        <li>
          <SignOutBtn />
        </li>
      </ul>
    </nav>
  );
}

const NavNonAuth = () => {
  return (
    <nav className="navigation">
      <ul>
        <li>
          <NavLink exact to="/">Landing</NavLink>
        </li>
        <li>
          <NavLink to="/signin">Sign In</NavLink>
        </li>
        <li>
          <NavLink exact to="/signup">Sign Up</NavLink>
        </li>
      </ul>
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <header className="App-header">
            <Navigation />
          </header>
        </div>

        {/* <Route exact path = '/' component = {Landing}/>
        <Route exact path = '/marketplace' component = {Marketplace}/> */}
        <PrivateRoute path = '/account' component = {Account} />
        <Route exact path = '/signin' component = {SignIn} />
        <Route path = '/signup' component = {SignUp} />
      </Router>
    </AuthProvider>
  ); 
}

export default App;
