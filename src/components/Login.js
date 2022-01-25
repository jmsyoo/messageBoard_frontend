import React from 'react';
import axios from 'axios'
import { Form, Button } from 'react-bootstrap'
import UserInput from './hooks/useInput'
import { v4 as uuidV4 } from 'uuid'

export default function Login({ URL, setUserId }) {

const { value: userNameValue, bind: userIdBind, reset: userIdReset } = UserInput('') // Custom userInput hook.

const saveNewUserDataToDb = async (name) => {
    try{
        const response = await axios.post(`${URL.production}user`, {
            name: name,
          }).then((result) => {
            console.log("save users data: ", result.data);
            setUserId(name + "%%" + result.data._id + '%%' + '0'); // Save name and user id to localstorage.
          });
    }catch(error){
        console.error(error)
    }
}

const getUserData = async (name, cb) => { // save user name to db for tracking messages
    try{
        const response = await axios.get(`${URL.production}user`).then((result) => {   
            console.log('retrived data: ',result.data)      
            const foundUser = result.data.filter(item => item.name === name)
            
            if(foundUser.length>0){
                setUserId(name + '%%' + foundUser[0]._id + '%%' + '1') // Save name and user id to localstorage.
            }
            else{
                cb(name) // If user name is not found then save to db.
            }            
        })
    }catch(error){
        console.error(error)
    }finally{
        userIdReset() // user input value set to default.
    }
}

const handleIdSubmit = () => {
    getUserData(userNameValue, saveNewUserDataToDb) // save user name to db
    setUserId(userNameValue) // store id to localstorage
}

const createNewUserId = () => {
    const name = uuidV4() // useing uuid to create random id for users.
    getUserData(name, saveNewUserDataToDb) // save created random user name to db
}


  return (
    <Form className="Login" onSubmit={handleIdSubmit}>
      <Form.Group>
        <Form.Label>Enter Your Name</Form.Label>
        <Form.Control
          type="text"
          required
          {...userIdBind}
          placeholder="Enter Id"
        />
      </Form.Group>
      <Button type="submit">Login</Button>
      <Button variant="secondary" onClick={createNewUserId}>
        Create A New Random Name
      </Button>
    </Form>
  );
}
