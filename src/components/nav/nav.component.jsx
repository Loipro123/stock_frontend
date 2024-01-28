import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import FutureImage from '../../assets/img/logo3.png';
import {setToken} from '../../redux/auth/auth.action';
import {connect} from 'react-redux';
import {useNavigate} from "react-router-dom";



const Nav = ({setToken,user}) => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorElNote, setAnchorElNote] = React.useState(null);


  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleOpenNote = (event) => {
    setAnchorElNote(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleCloseNote = () => {
    setAnchorElNote(null);
  };


  return (
    <AppBar position="static" style={{backgroundColor:'rgb(6,160,129)',borderBottom:'3px solid white',
    
    }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}
          <Box style={{
          paddingTop:'10px',display: { xs: 'none', md: 'flex' }, mr: 1
        }}>
          <img
            alt="Remy Sharp"
            src={FutureImage}
            sx={{ width:'40px', height: '40px' }}
            style={{cursor:'pointer'}}
            height={60}
            width={63}
            onClick={()=> {navigate('/')}}
            />
          </Box>
           

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
                <MenuItem onClick={() => {
                        handleCloseNavMenu();
                        navigate('/tracking');
                }}>
                  {/* <Typography textAlign="center" >{page}</Typography> */}
                  <div>Stock Tracking</div>

                </MenuItem>
                <MenuItem  onClick={() => {
                        handleCloseNavMenu();
                        navigate('/trading');
                }}>
                  {/* <Typography textAlign="center" >{page}</Typography> */}
                  <div>Trading History</div>

                </MenuItem>
                <MenuItem  onClick={() => {
                        handleCloseNavMenu();
                        navigate('/load');
                }}>
                  {/* <Typography textAlign="center" >{page}</Typography> */}
                  <div>Load Data</div>

                </MenuItem>
            </Menu>
          </Box>
          
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              <Button
                onClick={()=>{
                  handleCloseNavMenu();
                  navigate('/tracking');
                }}
                sx={{ my: 2, color: 'white', display: 'block' }}
                style={{textDecoration:'underline'}}
              >
                Stock Tracking
              </Button>
              <Button
                onClick={()=>{
                  handleCloseNavMenu();
                  navigate('/goal');
                }}
                sx={{ my: 2, color: 'white', display: 'block' }}
                style={{textDecoration:'underline'}}
              >
                Trading History
              </Button>
              <Button
                onClick={()=>{
                  handleCloseNavMenu();
                  navigate('/load');
                }}
                sx={{ my: 2, color: 'white', display: 'block' }}
                style={{textDecoration:'underline'}}
              >
               Load Data
              </Button>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <IconButton
                size="large"
                aria-label="show 17 new notifications"
                color="inherit"
                style={{
                    marginRight:"20px"
                }}
                onClick={handleOpenNote}
                >
                <Badge badgeContent={17} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElNote}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElNote)}
              onClose={handleCloseNote}
            >
             
            </Menu>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src={`${user.imageurl}`} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
                 <MenuItem  onClick={()=> {
                    handleCloseUserMenu();
                    navigate('/profile')
        
                }}>
                  {/* <Typography textAlign="center">{setting}</Typography> */}
                  <div  style={{minWidth:'100px'}}>Profile</div>
                </MenuItem>
                <MenuItem onClick={()=> {
                    handleCloseUserMenu();
                    setToken(null)
                }}>
                  {/* <Typography textAlign="center">{setting}</Typography> */}
                  <div>Log out</div>
                </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
const mapDispatchToProps = (dispatch) => ({
    setToken: (token) => dispatch(setToken(token))
  });
export default connect(null,mapDispatchToProps)(Nav);