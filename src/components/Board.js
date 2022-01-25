import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, ListGroup, Form, Button } from 'react-bootstrap';
import UserInput from './hooks/useInput'
import { useMessage } from './contexts/MessageProvider';

export default function Board({setUserId, userId, URL}) {
  const { nameList, myName, handleUserLogout } = useMessage()
  const [messages, setMessages] = useState([])

  const { value: messageValue, bind: messageBind, reset: messageReset } = UserInput('') // Custom userInput hook.

  // Log out
  const handleLogout = (cb) => {
      return cb()
  }

  // Post message to server
  const postMessage = async (value) => {
      try{
          const response = await axios.post(`${URL.production}message`,{
              ...value
          }).then((result) => {
              setMessages((prv) => {
                  return [
                      ...prv,
                      result.data
                  ]
              })
          })
      }catch(error){
          console.log(error)
      }finally{
          messageReset()
      }
  }

  const handleMessage = event => {
      event.preventDefault()
      const userData = userId.split('%%')
      let value = {
          name: userData[0],
          userId: userData[1],
          message: messageValue
      }
      if(value){
         return postMessage(value)
      }
      return
  }

  // User name list component
  const UserNameList = () => {
      return (
        <>
        <h3>Names</h3>
        <ListGroup as="ul">
            {
                nameList.map((item, index) => {
                    return (
                      <ListGroup.Item as="li" key={index} className="list" active={item.name === myName ? true : false}>
                        {item.name}
                      </ListGroup.Item>
                    );
                })
            }
        </ListGroup>
        </>
      );
  }
  
  // Message component
  const Messages = () => {
      return(
          <>
          <div className="MessageHeader">
            <h3>Messages</h3>
            <Button variant="danger" onClick={() => handleLogout(()=>{
                return handleUserLogout()
            })}>Logout</Button>
          </div>
          
          <div className="Messages">
              {
                  messages.length > 0 ? 
                  <ListGroup as="ul">
                      {messages.sort((a,b) => {
                          return a.createdAt > b.createdAt ? -1 : 1
                      }).map((item, index) => {
                          return(
                              <ListGroup.Item className="list" key={index} style={{border:"none"}}>
                                  <span>{`${item.message}`}</span>
                                  <span>{item.name} {item.createdAt.split('T')[0]}</span>
                                </ListGroup.Item>
                          )
                      })}
                  </ListGroup> 
                  : <h3>No Messages.</h3>
              }
          </div>
          </>
      )
  }

  // IFFE fetch message data
  useEffect(() => {
      (async() => {
          try{
              const response = await axios.get(`${URL.production}message`).then((result) => {
                 return setMessages(result.data)
              })
          }catch(error){
              console.error(error)
          }
      })()
  },[])


  return (
    <div className="Board">
      <Row>
        <Col lg={3} md={3} sm={12} xs={12} className="col">
          <UserNameList />
        </Col>
        <Col lg={9} md={9} sm={12} xs={12} className="col">
          <Messages />

          <div className="MessageInput">
            <Form onSubmit={handleMessage}>
              <Form.Group className="mb-3">
                <h3>Message Input</h3>
                <Form.Control as="textarea" className="MessageInput__textarea" rows={7} {...messageBind}/>
              </Form.Group>
              <Button variant="success" className="MessageInput__button" type="submit">SUBMIT</Button>
            </Form>
          </div>
        </Col>
      </Row>
    </div>
  );
}
