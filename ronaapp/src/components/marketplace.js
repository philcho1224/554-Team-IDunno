import React, { useContext } from 'react';
import { getAllItems, addItem } from '../firebase/FirebaseFunc';
import { AuthContext } from '../firebase/Auth';


function showItems (props){
  // const { currentUser } = useContext(AuthContext);
  // console.log("CURRENT USER:", currentUser);

  const handleNewPost = async (event) => {
    event.preventDefault();
    let {name, description, tradeitems} = event.target.elements;
    console.log("NewName: ", name);
    let itemObject = {
      name: name.value,
      description: description.value,
      tradeitems: tradeitems.value
    }
    console.log("ItemObject");
    console.log(itemObject);
    try{
      await addItem(itemObject);
    }
    catch(error){
      console.log(error);
    }
  };

  const getItems = async () =>{
    try{
      let allItems = await getAllItems();
    }
    catch(e){
      console.log(e);
    }

  }
  getItems();

  return (
    <div>
      <h1>This is marketplace</h1>
      <form onSubmit= {handleNewPost}>
        <div className = "form-group">
          <label>
            Name:
            <input
              className = "form-control"
              name = "name"
              id = "name"
              type = "name"
              placeholder = "Name"
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
              placeholder = "Description"
              required
            />
          </label>
        </div>
        <div className = "form-group">
          <label>
            Trade Items:
            <input
              className = "form-control"
              name = "tradeitems"
              id = "tradeitems"
              type = "tradeitems"
              placeholder = "Trade Items"
              required
            />
          </label>
        </div>
        <button type="submit">Create Post</button>
    </form>
    </div>
  );

}
export default showItems;
