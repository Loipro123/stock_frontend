import './App.css';
import React, {useEffect,useState} from 'react';
import Login from './components/login/login.component';
import {getToken} from './redux/auth/auth.selector';
import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';
import {setToken} from './redux/auth/auth.action';
import {apiDomain} from './services/config';
import axios from 'axios';
import Nav from './components/nav/nav.component';
import Home from './pages/home/home.component';
import Profile from './components/profile/profile.component';
import Load from './pages/load/load.component';
import { Routes, Route, Navigate} from "react-router-dom";

const App = ({token,setToken}) => {
  const [user,setUser] = useState(null);
  useEffect(()=> {
    if(token !== null){
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      axios.get(`${apiDomain}/users/userInfor`, config)
                  .then(response => {
                      setUser(response.data.user);
                  })
        .catch(error => {
              setToken(null);
              setUser(null);
       });
    }else{
       
    }
    
  },[token,setToken])
  return (
    <div className="App">
      {
        (user === null || token === null) ? <div className='login'>
        <Login/>
        </div> :
        <div>
           <Nav user={user}/>
           <Routes>
            <Route exact path="/" element={<Home/>}/>
            <Route exact path="/profile" element={(token===null || user === null) ?  <Navigate to="/"/> : <Profile user={user} setUser={setUser} token={token}/>}/>
            <Route exact path="/load" element={(token===null || user === null) ?  <Navigate to="/"/> : <Load  token={token}/>}/>

            <Route path="*" element={<Navigate to="/"/>}/>
          </Routes>
        </div>
      }
    </div>
  );
}

const mapDispatchToProps = (dispatch) => ({
  setToken: (token) => dispatch(setToken(token))
});

const mapStatetoProps = createStructuredSelector({
  token:getToken
})

export default connect(mapStatetoProps,mapDispatchToProps)(App);