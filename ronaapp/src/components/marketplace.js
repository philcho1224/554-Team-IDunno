import React, { useContext, useState, useEffect } from 'react';
import { getAllItems, addItem, getUser, deleteItem, getUserItems } from '../firebase/FirebaseFunc';
import { AuthContext } from '../firebase/Auth';
import { Card, CardHeader, CardMedia, CardContent, CardActions, Collapse, IconButton, Typography, Grid, Box, FormControl, FormHelperText } from '@material-ui/core';
import { Button, InputLabel, Input, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import Container from '@material-ui/core/Container';

import * as google from 'google-parser'
// const imageSearch = require('image-search-google');
import * as imageSearch from 'image-search-google';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Fab } from '@material-ui/core/';
import AddIcon from '@material-ui/icons/Add';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// const axios = require('axios');
// const {Storage} = require('@google-cloud/storage');
import * as Storage from '@google-cloud/storage';
import * as storage from '@google-cloud/storage';
import * as axios from 'axios';
import { Redirect } from 'react-router-dom';
// import * as  Scraper from 'images-scraper';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
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

// async function uploadFile(filename) {
//   // await axios.post(
//   //   'https://storage.googleapis.com/media/storage/v1/b/ronaapp_market_items/o',
//   //   {
//   //     object : filename
//   //   }
//   // );
//   let image = await axios.get('https://storage.googleapis.com/storage/v1/b/ronaapp_market_items/o/dog.jpeg');
//   console.log(image);
// }



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
        {/* <Card variant = "outlined" key = {index}>
        {Object.keys(value).map(function (key) {
            console.log("Key", key);
            let item = value[key];
            return <p>{item}</p>

          })};
      </Card> */}
      </Grid>
    )
  });

  return (
    <div>
      <Container component="main" maxWidth="lg" >
        <Box mt={3}>
          <Typography variant="h3">Marketplace</Typography>
        </Box>

        <Fab variant="extended" color="primary" onClick={handleClickOpen}>
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
                  <Grid item xs >
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

        <Box mt={6}>
          <Grid container spacing={4}>
            {cards}
          </Grid>
        </Box>

        <Box mt={8}>
          <Button onClick={deleteIt}>Delete Item</Button>
          <Button onClick={userItems}>Show User Item</Button>
        </Box>

      </Container>
    </div>
  );

}

export default ShowItems;
