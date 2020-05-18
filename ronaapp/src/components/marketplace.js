import React, { useContext, useState, useEffect } from 'react';
import { getAllItems, addItem, getUser, deleteItem, getUserItems } from '../firebase/FirebaseFunc';
import { AuthContext } from '../firebase/Auth';
import { Card, CardHeader, CardMedia, CardContent, CardActions, Collapse, IconButton, Typography, Grid } from '@material-ui/core';
import { Button, FormControl, FormHelperText, InputLabel, Input, TextField, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { InstantSearch, SearchBox, Hits, Highlight, connectHits } from 'react-instantsearch-dom';
import * as algoliasearch from 'algoliasearch';
import * as imageSearch from 'image-search-google';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import * as axios from 'axios';
import { Redirect } from 'react-router-dom';
import { Fab } from '@material-ui/core/';
import AddIcon from '@material-ui/icons/Add';
import Container from '@material-ui/core/Container';
import Background from './changed/market.jpg';

const sectionStyle = {
  width: "100%",
  height: "500px",
  backgroundImage: `url(${Background})`
};

const client = algoliasearch("NW00BIZJ9O", "73ab8c260b27b919c60e626eaad30649");


// import * as  Scraper from 'images-scraper';






const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: 14,
    marginRight: 14,
  },
  cardContainer: {
    display: "flex"
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
}));




const ShowItems = () => {

  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const { currentUser } = useContext(AuthContext);
  console.log("CurrentUser UID:", currentUser.uid);
  const [marketItems, setMarketItems] = useState(undefined);
  const [usrInfo, setUsrInfo] = useState(undefined);
  const [redirect, setRedirect] = useState(false);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  async function deleteIt() {
    await deleteItem("hello", "2rdsnxrzmS47UJEduoid");
  }
  async function userItems() {
    await getUserItems(usrInfo.email);
  }
  async function getImage(image) {
    const client = new imageSearch('006652411016456664611:esbhjblxvz6', 'AIzaSyANzy7uYHb-BEzcBkjxGVQLKWfpf3f5eEo');
    const options = { page: 1 };
    let imageResult = await client.search(image, options);
    let sliceIndex = imageResult[0].url.search(".jpeg");
    let imageString = imageResult[0].url.substr(0, sliceIndex + 5);
    return imageString;

  }
  useEffect(() => {
    async function getUserInfo(uid) {
      let userInfo;
      try {
        userInfo = await getUser(uid);
        console.log("Async Func", userInfo);
        setUsrInfo(userInfo);
      }
      catch (e) {
        console.log(e);
      }
    };

    async function getItems() {
      let allItems;
      try {
        allItems = await getAllItems();
        console.log(allItems);
        setMarketItems(allItems);
      }
      catch (e) {
        console.log(e);
      }

    };
    getItems();
    getUserInfo(currentUser.uid);
    console.log("UsrInfo In Effect", usrInfo);
  }, [currentUser.uid]
  );
  console.log("UsrInfo", usrInfo);
  if (usrInfo) {
    console.log("This is user info", usrInfo);
  }
  if (redirect === true) {
    return <Redirect to="/market" />;
  }
  console.log(marketItems);
  //***************WORK IN PROGRESS*********************
  const Hit = ({ hit }) => {
    const classes = useStyles();
    return (
      <Grid item>
        <Card className={classes.root}>
          <CardHeader
            title={hit.name}
            subheader={hit.user}
          />
          <CardMedia
            className={classes.media}
            image={hit.image}
            title={hit.name}
          />
          <CardContent>
            <Typography variant="body2" color="textSecondary" component="p">
              {hit.description}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              Trade Items:
          </Typography>
            <Grid container spacing={4}>
              <Grid item xs={4}>
                {hit.tradeitems[0]}
              </Grid>
              <Grid item xs={4}>
                {hit.tradeitems[1]}
              </Grid>
              <Grid item xs={4}>
                {hit.tradeitems[2]}
              </Grid>
            </Grid>
            <Typography variant="body2" color="textSecondary" component="p">
              Contact Info: {hit.email}
          </Typography>
          </CardContent>
          
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <Typography paragraph>Contact Info:</Typography>
              <Typography paragraph>
                {hit.email}
              </Typography>
            </CardContent>
          </Collapse>
        </Card>
      </Grid>

    )
  }

  const Content = () =>
    <div className="content">
      {/* <Grid container spacing={4}> */}
      {/* <div> */}
      <Hits hitComponent={Hit} />
      {/* </Grid> */}
    </div>
  // ****************************************
  const handleNewPost = async (event) => {

    console.log("EVENT: ", event);
    event.preventDefault();

    let { name, description, tradeitem1, tradeitem2, tradeitem3 } = event.target.elements;
    let imageString = await getImage(name.value);

    let itemObject = {
      name: name.value,
      user: usrInfo.username,
      email: usrInfo.email,
      description: description.value,
      tradeitems: [tradeitem1.value, tradeitem2.value, tradeitem3.value],
      image: imageString
      // image: results[0].url
    }
    console.log("ItemObject");
    console.log(itemObject);
    try {
      await addItem(itemObject);
      // await uploadFile(image);
    }
    catch (error) {
      console.log(error);
    }
    handleClose();
    // setRedirect(true);

  };
  let cards = null;
  cards = marketItems && marketItems.map((value, index) => {
    console.log("Value: ", value);
    return (
      <Grid item xs={4}>
        <Card className={classes.root}>
          <CardHeader
            title={value.name}
            subheader={value.user}
          />
          <CardMedia
            className={classes.media}
            image={value.image}
            title={value.name}
          />
          <CardContent>
            <Typography variant="body2" color="textSecondary" component="p">
              {value.description}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              Trade Items:
        </Typography>
            <Grid container spacing={4}>
              <Grid item xs={4}>
                {value.tradeitems[0]}
              </Grid>
              <Grid item xs={4}>
                {value.tradeitems[1]}
              </Grid>
              <Grid item xs={4}>
                {value.tradeitems[2]}
              </Grid>
            </Grid>

          </CardContent>
          <CardActions disableSpacing>
            <IconButton
              className={clsx(classes.expand, {
                [classes.expandOpen]: expanded,
              })}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </IconButton>
          </CardActions>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <Typography paragraph>Contact Info:</Typography>
              <Typography paragraph>
                {value.email}
              </Typography>
            </CardContent>
          </Collapse>
        </Card>
      </Grid>
    )
  });
  return (
    <div style={sectionStyle}>
      <Container component="main" maxWidth="lg" >
        <Box pt={4}>
          <Typography variant="h2">Marketplace</Typography>
        </Box>

        <InstantSearch
          // ...
          searchClient={client}
          indexName="marketitems"
        >
          <header>
            <label for="searchBox">Search</label>
            <SearchBox  translations={{ id: 'searchBox', placeholder: 'Search Box' }}  />
          </header>
          <main>
            <Content/>
          </main>

        </InstantSearch>

        <Fab variant="extended" color="primary" onClick={handleClickOpen} id="createPostButton">
          <AddIcon />
          Create Post
        </Fab>



        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">New Post</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Provide the name and description of the item along with items you are seeking! (Someone make sure i have this the right way or is it the other way around)
            </DialogContentText>
            <form onSubmit={handleNewPost}>

              <FormControl fullWidth>
                <InputLabel htmlFor="name">Name of Item</InputLabel>
                <Input id="name" name="name" type="text" required />
              </FormControl>

              <Box mt={4}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="description">Description of Item</InputLabel>
                  <Input id="description" name="description" type="text" required />
                </FormControl>
              </Box>


              <Box mt={4}>
                <Grid container fullWidth>
                  <Grid item xs>
                    <FormControl fullWidth>
                      <InputLabel htmlFor="tradeitem1">Trade Item 1</InputLabel>
                      <Input id="tradeitem1" name="tradeitem1" type="text" required />
                      <FormHelperText id="tradeitem1-helper-text">Ex. Toilet Paper</FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs class="Middle_item">
                    <FormControl fullWidth>
                      <InputLabel htmlFor="tradeitem2">Trade Item 2</InputLabel>
                      <Input id="tradeitem2" name="tradeitem2" type="text" required />
                    </FormControl>
                  </Grid>
                  <Grid item xs>
                    <FormControl fullWidth>
                      <InputLabel htmlFor="tradeitem3">Trade Item 3</InputLabel>
                      <Input id="tradeitem3" name="tradeitem3" type="text" required />
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>

              <Button onClick={handleClose} color="primary">Cancel</Button>
              <Button type="submit">Create Post</Button>

              <DialogActions>
                <Button onClick={handleClose} color="primary">Cancel</Button>
                <Button type="submit" color="primary">Create Post</Button>
              </DialogActions>
            </form>
          </DialogContent>

        </Dialog>

      </Container>
    </div>
  );




}

export default ShowItems;
