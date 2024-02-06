import React, {useEffect,useState} from 'react';
import {apiDomain} from '../../services/config';
import axios from 'axios';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
const DemoPaper = styled(Paper)(({ theme }) => ({
  width: 900,
  padding: theme.spacing(2),
  ...theme.typography.body2
}));
const Tracking = ({token}) => {
    const [data,setData] = useState([]);
    const [count,setCount] = useState(0);
    useEffect(()=> {
        if(token !== null){
          const config = {
            headers: {
              'x-auth-token': token
            }
          };
          axios.get(`${apiDomain}/analysis/stock_note`, config)
                      .then(response => {
                         setData(response.data.data);
                         setCount(response.data.count)
                      })
            .catch(error => {
                 console.log(error)
           });
        }else{
           
        }
        
      },[]);
    return(
        <>
            <div style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',gap:'20px', padding:'30px 20px'}}>
                <div style={{fontSize:'25px',textDecoration:'underline'}}>Stock Notes</div>
                <Stack direction="column" spacing={2}>
                    {
                        data.map(item =>  <DemoPaper key={item.name} square>
                            <div style={{display:'flex',flexDirection:'column',width:'100%',justifyContent:'flex-start',alignItems:'flex-start'}}>
                                <div style={{display:'flex',width:'100%',justifyContent:'flex-start',alignItems:'center'}} >
                                    <span style={{fontSize:'20px',marginRight:'20px'}}>{item.name}</span>
                                    <span style={{fontSize:'18px',marginRight:'20px'}}>-</span>
                                    <span style={{fontSize:'20px',marginRight:'40px'}}>{new Date(item.date).toLocaleDateString()}</span>
                                    <span>{item.percent >= 0 ? <ArrowUpwardIcon style={{color:'green'}}/> : <ArrowDownwardIcon style={{color:'red'}}/>}</span>
                                    <span>{item.percent}%</span>
                                
                                </div>
                                <div style={{width:'100%',textAlign:'start',fontSize:'16px',padding:'5px 0',color: item.type === 'up' ? 'green' : 'red'}}>
                                    {
                                        item.msg
                                    }
                                </div>
                                <span style={{textAlign:'start',fontSize:'16px',padding:'5px 0',textDecoration:'underline',cursor:'pointer'}}>
                                   detail
                                </span>
                            </div>
                        </DemoPaper>)
                    }
                   
                </Stack>
           </div>
        </>
        
    )
}

export default Tracking;