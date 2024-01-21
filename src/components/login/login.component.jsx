import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import './login.styles.css';
import CircularProgress from '@mui/material/CircularProgress';
import {apiDomain} from '../../services/config';
import {setToken} from '../../redux/auth/auth.action';
import {connect} from 'react-redux';
import axios from 'axios';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const Login = ({setToken}) => {
  const [open, setOpen] = React.useState(false);
  const [waiting,setWaiting] = React.useState(false)
  const [login, setLogin] = React.useState(true);
  const [title, setTitle] = React.useState('Login Page');
  const [btnTitle, setBtnTitle] = React.useState('Login');
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const [pageTitle,setPageTitle] = React.useState('sign up');
  const [data,setData] = React.useState({
    email: '',
    password: '',
    passcode: ''
  })

  const handleChange = (e) => {
    const {name,value} = e.target;
    setData({
        ...data,
        [name]: value
    })
  }

  const handleSubmit = () => {
    if(login===true & (data.email.length===0 || data.password.length===0)){
        alert("Email and Passoword can't be null")
        return;
    }
    if(login===false & (data.email.length===0 || data.password.length===0 || data.passcode.length===0)){
        alert("Email, Passoword, Pass Code can't be null")
        return;
    }

    setWaiting(true)
    if(login===true){
        axios.post(`${apiDomain}/users/login`, {...data}).then(response => {
            setWaiting(false)
            setToken(response.data.token)
        }).catch(error => {
            // alert(error.response.data.error);
            console.log(error)
            setWaiting(false)
        });
    }else{
        console.log(data)
        axios.post(`${apiDomain}/users/signup`, {...data}).then(response => {
            setWaiting(false)
            setToken(response.data.token)
        }).catch(error => {
            alert(error.response.data.error);
            setWaiting(false)
        });
    }
   
  }
  
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };


  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      {
            waiting === true ? 
        
      <Box sx={{ display: 'flex' }}>
             <CircularProgress />
      </Box> : <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Login
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title"  className='login_btn'>
          {title}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers style={{
            display:"flex",
            flexDirection:"column",
            padding: '30px 30px'
        }}>
            <TextField
               label="Email"
               style={{
                marginBottom:'20px',
                width:'270px'
               }}
               size='large'
               name="email"
               onChange={handleChange}
            />
        <FormControl  variant="outlined"  >
          <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            onChange={handleChange}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>
        <div style={{fontSize:'10px', color:'grey', marginTop:'3px'}}>Password is longer than 6 characters</div>
        {
            login === true ? null : <TextField
            label="Pass Code"
            style={{
             marginTop:'20px'
            }}
            name="passcode"
            onChange={handleChange}
         />
        }
        </DialogContent>
        <DialogActions style={{
            display:'flex',
            justifyContent:'flex-end',
            alignItems:'center'
            
        }}>
         <Button autoFocus onClick={handleSubmit} variant="contained">
            {btnTitle}
          </Button>
         <div style={{
                color:'blue',
                fontSize:'12px',
                textDecoration:'underline',
                cursor:'pointer'
            }}
            onClick={()=> {
                if(login===true){
                    setLogin(false);
                    setBtnTitle('Sign up');
                    setPageTitle('login');
                    setTitle('SignUp Page')
                }else{
                    setLogin(true);
                    setBtnTitle('Login');
                    setPageTitle('sign up');
                    setTitle('Login Page')
                }
            }}
            >{pageTitle}</div> 
          
         
        </DialogActions>
      </BootstrapDialog>
      </div>
    } 
    </React.Fragment>
  );
}

const mapDispatchToProps = (dispatch) => ({
  setToken: (token) => dispatch(setToken(token))
});
export default connect(null,mapDispatchToProps)(Login);