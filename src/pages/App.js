import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import useLocalStorage from '../components/hooks/useLocalStorage';
import { MessageProvider } from '../components/contexts/MessageProvider';
import Board from '../components/Board';
import Login from '../components/Login';
import '../styles/styles.scss'

const URL = {
  dev: "http://localhost:3000/",
  production: "https://bzwax-messageboard-backend.herokuapp.com/api/"
}

function App() {
  const [userId, setUserId] = useLocalStorage('id','')

  const message = (
    <MessageProvider URL={URL} userId={userId} setUserId={setUserId}>
      <Board setUserId={setUserId} userId={userId} URL={URL}/>
    </MessageProvider>
  )

  // Testing user id state
  useEffect(() => {
    if(userId){
      console.log('user id:', userId)
    }   
  },[userId])

  
  return (
    <div className="App">
      <Container fluid="sm" className="container">
        {userId ? message : <Login URL={URL} setUserId={setUserId}/>}
      </Container>
    </div>
  );
}

export default App;
