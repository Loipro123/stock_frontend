import React, {useState,useEffect} from 'react';
import Card from '@mui/material/Card';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {apiDomain} from '../../services/config';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';

import './profile.styles.css';


const Profile = ({user,token,setUser}) => {
  useEffect(()=> {
        if(user.fullname!==null){
            setName(user.fullname)
        }
        setImage(user.imageurl);
  },[user])
  const [fileImg,setFileImg] = useState(null);
  const [image, setImage] = useState(null);
  const [waiting,setWaiting] = useState(false);
  const [name,setName] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [success,setSuccess] = useState(false);

  
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setFileImg(file)
    console.log(file)
    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const showAndHideAlert = () => {
    setShowAlert(true);

    // Hide the alert after 3 seconds (adjust the time as needed)
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };
  const handleSubmit = async () => {
    setWaiting(true);
    const config = {
        headers: {
            'x-auth-token': token
        }
    };
    try{
        if (fileImg !== null) {
            const formData = new FormData();
            formData.append('pic', fileImg);
            await axios.post(`${apiDomain}/users/updatephoto`, formData, config);
            setFileImg(null)
        }
        const users = await axios.post(`${apiDomain}/users/updatename`,{name:name},config);
        setWaiting(false);
        setSuccess(true);
        showAndHideAlert();
        setUser(users.data.user)
        setFileImg(null);
    }catch(error){
        setWaiting(false);
        setSuccess(false);
        showAndHideAlert();
        console.log(error)
    }
  }
  return (
    <div style={{ height:'100vh', display:'flex',justifyContent:'center',alignItems:'center'}}>
        <Card sx={{ width: 345, marginTop:-50, padding: '20px'}} >
            
             <div style={{ display:'flex',justifyContent:'center',alignItems:'center', flexDirection:'column'}}>
                {
                    waiting === true ? 
                    <Box sx={{ display: 'flex' }}>
                             <CircularProgress />
                    </Box> : null
                }
                <div className="photo_contain" style={{ 
                            backgroundImage: `url('${image}')` ,
                            cursor:'pointer',
                            position:'relative'
                            }}        
                >
                    <div style={
                            {
                                position:'absolute',
                                top: '30%',
                                left: '120%'
                            }
                    }>
                        <input
                                type="file"
                                id="fileInput"
                                style={{ display: 'none' }}
                                onChange={handleImageUpload}
                                accept="image/png, image/jpeg"
                        />
                        <label htmlFor="fileInput" className="upload-btn1">
                               <CloudUploadIcon />
                        </label>     
                    </div>

                </div>
                <div>
                <div style={{
                    height: '1px',
                    width: '40%',
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    margin: '25px auto',
                }}></div>
                
                <TextField
                label="Full Name"
                sx={{width:'80%',margin:'15px 0'}}
                value={name}
                onChange={(e)=> {
                    setName(e.target.value)
                }}
                />
                <TextField
                 label="Email"
                 sx={{width:'80%'}}
                 value={user.email}
                 disabled
                />
                 <div style={{
                    height: '1px',
                    width: '80%',
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    margin: '20px auto',
                }}></div>
                <div style={{
                    width: '80%',
                    margin: '20px auto',
                    display:'flex',
                    justifyContent:'start'
                }}>
                    <Button variant="contained" onClick={handleSubmit} disabled={(fileImg === null && (user.fullname === name || name === ''))}>Save</Button>
                </div>
                {
                    showAlert===true ? (success === true ?  <Alert severity="success">Update your profile successfully!</Alert> : 
                    <Alert severity="error">Can't not update your profile - server error!</Alert>
                    ) : null
                }
      </div>
             </div>
        </Card>
    </div>
   
  );
}

export default Profile;