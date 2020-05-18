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
import Home from "./components/Home";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Account from "./components/Account";
import showItems from "./components/marketplace";
import { AuthProvider, AuthContext } from "./firebase/Auth";
import PrivateRoute from "./components/PrivateRoute";
import SignOutBtn from "./components/SignOut";
import { doSignOut } from './firebase/FirebaseFunc';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    background: {
      default: '#eeefff'
    },
    primary: {
      main: '#d81b60'
    },
    secondary: {
      main: '#0075a2'
    }
  }
});

const useStyles = makeStyles((theme) => ({
  navbar: {
    background: '#2E3B55',
  },
  grow: {
    flexGrow: 1,
  },
  title: {
    marginRight: theme.spacing(2),
    fontSize: 24
  },
  active: {
    color: '#eee',
  }
}));

const Navigation = () => {
  const { currentUser } = useContext(AuthContext);
  return (
    <div>
      {currentUser ? <NavOnAuth /> : <NavNonAuth />}
    </div>
  );
}

const NavOnAuth = () => {
  const classes = useStyles();
  return (
    <AppBar position="static" className={classes.navbar}>
      <Toolbar>
        <Typography variant="h1" className={classes.title}>
          RonaApp
        </Typography>
        <Button color="inherit" activeClassName={classes.active} component={NavLink} exact to="/">Home</Button>
        <Button color="inherit" activeClassName={classes.active} component={NavLink} exact to="/market">Marketplace</Button>
        <Button color="inherit" activeClassName={classes.active} component={NavLink} exact to="/account">Account</Button>
        <div className={classes.grow} />
        <Button color="inherit" onClick={doSignOut}>Sign Out</Button>
      </Toolbar>
    </AppBar>
  );
}

const NavNonAuth = () => {
  const classes = useStyles();
  return (
    <AppBar position="static" className={classes.navbar}>
      <Toolbar>
        <Typography variant="h1" className={classes.title}>
          RonaApp
        </Typography>
        <Button color="inherit" activeClassName={classes.active} component={NavLink} exact to="/">Home</Button>
        <div className={classes.grow} />
        <Button color="inherit" activeClassName={classes.active} component={NavLink} exact to="/signup">Sign Up</Button>
        <Button color="inherit" activeClassName={classes.active} component={NavLink} exact to="/signin">Sign In</Button>
      </Toolbar>
    </AppBar>
  );
}

function App() {
  return (
    <AuthProvider>
      <MuiThemeProvider theme={theme}>
      <CssBaseline />
        <Router>
          <Navigation />

          <Route exact path = '/' component = {Home}/>
          <PrivateRoute path = '/market' component = {showItems}/>
          <PrivateRoute path = '/account' component = {Account} />
          <Route exact path = '/signin' component = {SignIn} />
          <Route path = '/signup' component = {SignUp} />
        </Router>
      </MuiThemeProvider>
    </AuthProvider>
  );
}

export default App;
