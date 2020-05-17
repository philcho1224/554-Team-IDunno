import React, { useContext, useState, useEffect } from 'react';
import { getAllItems, addItem, getUser, deleteItem, getUserItems } from '../firebase/FirebaseFunc';
import { AuthContext } from '../firebase/Auth';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
// const axios = require('axios');
// const {Storage} = require('@google-cloud/storage');
import * as Storage from '@google-cloud/storage';
import * as storage from '@google-cloud/storage';
import axios from 'axios';



const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
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
  console.log("CurrentUser UID:" , currentUser.uid);
  const [marketItems, setMarketItems] = useState(undefined);
  const [usrInfo, setUsrInfo] = useState(undefined);
  async function deleteIt(){
    await deleteItem("hello","2rdsnxrzmS47UJEduoid");
  }
  async function userItems(){
    await getUserItems(usrInfo.email);
  }
  useEffect(() => {
    async function getUserInfo(uid){
      let userInfo;
      try{
        userInfo = await getUser(uid);
        console.log("Async Func" ,userInfo);
        setUsrInfo(userInfo);
      }
      catch(e){
        console.log(e);
      }
    };

    async function getItems(){
      let allItems;
      try{
        allItems = await getAllItems();
        console.log(allItems);
        setMarketItems(allItems);
      }
      catch(e){
        console.log(e);
      }

    };
    getItems();
    getUserInfo(currentUser.uid);
    console.log("UsrInfo In Effect" ,usrInfo);
  }, []
  );
  console.log("UsrInfo",usrInfo);
  if(usrInfo){
    console.log("This is user info", usrInfo);
  }
  console.log(marketItems);

  const handleNewPost = async (event) => {
    event.preventDefault();
    let {name, description, tradeitem1, tradeitem2, tradeitem3, image} = event.target.elements;
    console.log("NewName: ", name);
    console.log(image);
    console.log(image.value);
    // try{
    //   await uploadFile(image);
    // }
    // catch(e){
    //   console.log(e);
    // }
    let itemObject = {
      name: name.value,
      user: usrInfo.username,
      email: usrInfo.email,
      description: description.value,
      tradeitems: [tradeitem1.value, tradeitem2.value, tradeitem3.value]
    }
    console.log("ItemObject");
    console.log(itemObject);
    try{
      await addItem(itemObject);
      // await uploadFile(image);
    }
    catch(error){
      console.log(error);
    }
  };
  let cards = null;
  cards = marketItems && marketItems.map((value, index) => {
    console.log("Value: ", value);
    return(
      <div>
        <Card className={classes.root}>
      <CardHeader
        title= {value.name}
        subheader= {value.user}
      />
      <CardMedia
        className={classes.media}
        image="placeHolder image"
        title="placeholde imager"
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {value.description}
        </Typography>
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
      </div>
    )
  });
  if(usrInfo){
    return (
      <div>
        <h1>This is marketplace</h1>
       {cards}
  
  
        <form onSubmit= {handleNewPost}>
          <div className = "form-group">
            <label>
              Name:
              <input
                className = "form-control"
                name = "name"
                id = "name"
                type = "name"
                placeholder = "Name of Item"
                required
              />
            </label>
          </div>
          <div className = "form-group">
            <label>
              Description:
              <input
                className = "form-control"
                name = "description"
                id = "description"
                type = "description"
                placeholder = "Description of item"
                required
              />
            </label>
          </div>
          <div className = "form-group">
                  <label>
                      Trade Item 1:
                      <input
                      className="form-control"
                      name="tradeitem1"
                      type="tradeitem1"
                      placeholder="Ex: Toilet Paper"
  
                      />
                  </label>
              </div>
              <div className = "form-group">
                  <label>
                      Trade Item 2:
                      <input
                      className="form-control"
                      name="tradeitem2"
                      type="tradeitem2"
                      placeholder="Ex: Toilet Paper"
                      />
                  </label>
              </div>
              <div className = "form-group">
                  <label>
                      Trade Item 3:
                      <input
                      className="form-control"
                      name="tradeitem3"
                      type="tradeitem3"
                      placeholder="Ex: Toilet Paper"
                      />
                  </label>
              </div>
              <div className = "form-group">
                <label>
                  Image
                  <input
                  className="form-control"
                  name="image"
                  type="file"
                  required
                  />
                </label>
              </div>
          <button type="submit">Create Post</button>
      </form>
      <button onClick={deleteIt}>Delete Item</button>
      <button onClick={userItems}>Show User Item</button>
      </div>
    );
  }
  else{
    return(
      <div></div>
    )
  }
  

}

export default ShowItems;
