import './App.css';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { createTheme } from '@mui/system';

import {useState} from 'react'

import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'

import CreatePoll from './components/CreatePoll'
import Poll from './components/Poll';
import Admin from './components/Admin';

function App() {
  const [drawer,toggleDrawer] = useState(false)
  const DrawerList = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      // onClick={toggleDrawer(false)}
      // onKeyDown={toggleDrawer(false)}
    >
      <List>
        {['About Ayas', 'About Poll', 'Contact Me', 'Download Resume'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2}} onClick={() => {toggleDrawer(true)}}>
            <MenuIcon />
          </IconButton>
          {/* <Typography variant="h6" color="inherit" component="div"> */}
            <h1>Async Poll: Quick and Realtime</h1>
          {/* </Typography> */}
        </Toolbar>
      </AppBar>
      <Drawer
        anchor={'left'}
        open={drawer}
        onClose={() => {toggleDrawer(false)}}
      >{DrawerList('left')}</Drawer>
      <Router>
        <Switch>
          <Route path="/" exact ><CreatePoll/></Route>
          <Route path="/edit/:id" ><Admin/></Route>
          <Route path="/:id" ><Poll/></Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
