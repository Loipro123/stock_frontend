import React, {useEffect,useState} from 'react';
import {apiDomain} from '../../services/config';
import axios from 'axios';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';

import {
    ComposedChart,
    Line,
    Area,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
  } from 'recharts';
import MyComponent from '../analyst_page/analyst_page.component';
const DemoPaper = styled(Paper)(({ theme }) => ({
  width: 900,
  padding: theme.spacing(2),
  ...theme.typography.body2
}));

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
  }));
  
const Tracking = ({token}) => {
    const [data,setData] = useState([]);
    const [count,setCount] = useState(0);
    const [openDetail, setOpenDetail] = React.useState(false);
    const [stockData,setStockData] = useState({});
    const handleClickOpen = () => {
        setOpenDetail(true);
      };
      const handleClose = () => {
        setOpenDetail(false);
      };

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
                                <span style={{textAlign:'start',fontSize:'16px',padding:'5px 0',textDecoration:'underline',cursor:'pointer'}} onClick={()=> {
                                    handleClickOpen();
                                    setStockData({
                                        name : item.name,
                                        time : item.time,
                                        type : item.type,
                                        days : 20,
                                        event_days :10
                                    })
                                }}>
                                   detail
                                </span>
                            </div>
                        </DemoPaper>)
                    }
                   
                </Stack>
           </div>
           {
            openDetail === true ? <Detail open={openDetail} handleClose={handleClose} data={stockData} token={token}/> : null
           }
        </>
        
    )
}


export  function Detail({open,data,token,handleClose}) {
    const[eventDays, setEventDays] = useState(data.event_days);
    const[stockDays,setStockDays] = useState(data.days);
    const[arrData,setArrData] = useState([]);
    const[url,setUrl] = useState(`https://stockanalysis.com/stocks/${data.name.toLowerCase()}/financials/`);
    useEffect(()=> {
        const body =  {
            ...data,
            days: stockDays,
            event_days: eventDays
        }
        if(token !== null){
          const config = {
            headers: {
              'x-auth-token': token
            },
            
          };
          axios.post(`${apiDomain}/analysis/analyst_stock`,body, config)
                      .then(response => {
                         setArrData(convertArrayData(response.data.msg));
                         console.log(convertArrayData(response.data.msg))
                      })
            .catch(error => {
                 console.log(error)
           });
        }else{
           
        }
        
      },[eventDays,stockDays]);
    function convertArrayData(array) {

        for (let i = 0; i < array.length; i++) {
            for(let j=0; j< array[i].data.length; j++){
                array[i].data[j].high_price = parseFloat(array[i].data[j].high_price);
                array[i].data[j].volume = parseInt(array[i].data[j].volume);
                array[i].data[j].date_time = new Date(array[i].data[j].date_time).toLocaleDateString();
            }
          
        }
        return array;
    }
    const handleStockday = (event, newValue) => {
        if (typeof newValue !== 'number') {
          return;
        }
        setStockDays(newValue);
      };
      const handleEventday = (event, newValue) => {
        if (typeof newValue !== 'number') {
          return;
        }
        setEventDays(newValue);
      };
    return (
      <React.Fragment>
          <Dialog
                fullWidth={1000}
                maxWidth={1000}
                open={open}
                onClose={handleClose}
            >
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            <div style={{display:'flex', gap:"30px", alignItems:'center'}}>
            <div style={{fontWeight:'bold', marginBottom:'7px'}}>{data.name}</div>
            <div style={{width:'500px', display:'flex', gap:'10px', justifyContent:'center'}}>
                <div style={{width:'30%',fontSize:'15px'}}>Stock days:</div>
                <Slider
                        value={stockDays}
                        onChange={handleStockday}
                        valueLabelDisplay="auto"
                        min={1}
                        max={365}
                        aria-labelledby="input-item-number"
                        size={"small"}
            /></div>
            <div style={{width:'500px', display:'flex', gap:'10px', justifyContent:'center'}}>
                <div style={{width:'40%',fontSize:'15px'}}>Events days:</div>
                <Slider
                        value={eventDays}
                        onChange={handleEventday}
                        valueLabelDisplay="auto"
                        min={1}
                        max={365}
                        aria-labelledby="input-item-number"
                        size={"small"}
            /></div>
            <div>
              <a href={url} target="_blank" rel="noopener noreferrer">
                Financial information
              </a>
            </div>
            </div>
          
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
          <DialogContent dividers>
            {
                arrData.map(item => 
                <div style={{padding:'30px 0', borderBottom:'1px solid grey'}}>
                         <div style={{display:'flex', padding:'10px 40px', gap:'10px', fontWeight:'bold'}}>
                            <div>Highest price: ${item.max_price}</div>
                            <div>-</div>
                            <div>{new Date(item.date).toLocaleDateString()}</div>
                            <div>From</div>
                            <div style={{textDecoration:'underline'}}>{new Date(item.min_date).toLocaleDateString()}</div>
                            <div>to</div>
                            <div style={{textDecoration:'underline'}}>{new Date(item.max_date).toLocaleDateString()}</div>

                         </div>
                         <ComposedChart
                            width={1400}
                            height={700}
                            data={item.data}
                            margin={{
                                top: 20,
                                right: 20,
                                bottom: 20,
                                left: 20,
                            }}
                            >
                            <CartesianGrid stroke="#f5f5f5" />
                            <XAxis dataKey="date_time" scale="band" includeHidden angle={45}/>
                            <YAxis yAxisId="left" type="number" dataKey="high_price" name="weight"  stroke="#8884d8" />
                            <YAxis
                                yAxisId="right"
                                type="number"
                                dataKey="volume"
                                // name="weight"
                                // unit="kg"
                                orientation="right"
                                stroke="#82ca9d"
                            />
                            <Tooltip />
                            {/* <Legend /> */}
                            {/* <Bar dataKey="volume" barSize={20} fill="#413ea0" /> */}
                            <Bar type="monotone" dataKey="volume" fill="#413ea0"  yAxisId="right" barSize={18}/>
                            <Line type="monotone" dataKey="high_price" stroke="#ff7300"  yAxisId="left"/>


                        </ComposedChart>
                        <div style={{ padding:'10px 20px', textDecoration:'underline', fontWeight:'bold'}}>Stock events</div>
                        <div style={{maxHeight:'1000px', overflow:'scroll', margin:'5px 10px'}}>
                            {
                                item.events.map(ev => 
                                    <div style={{padding:'5px 10px', border:'1px solid grey'}}>
                                        <div style={{fontSize:'20px', fontWeight:'bold'}}>{ev.title}   -    {new Date(ev.published_date).toLocaleString()}</div>
                                        <div>{ev.description}</div>
                                        <div style={{textDecoration:'underline', cursor:'pointer'}}>{ev.source}</div>

                                    </div>
                                    )
                            }
                        </div>
                        <div style={{ padding:'10px 20px', textDecoration:'underline', fontWeight:'bold'}}>General events</div>
                        <div style={{maxHeight:'1000px', overflow:'scroll', margin:'5px 10px'}}>
                            {
                                item.general_event.map(ev => 
                                    <div style={{padding:'5px 10px', border:'1px solid grey'}}>
                                        <div style={{fontSize:'20px', fontWeight:'bold'}}>{ev.title}   -    {new Date(ev.datetime).toLocaleString()}</div>
                                        <div>{ev.description}</div>
                                        <div style={{textDecoration:'underline', cursor:'pointer'}}>{ev.source}</div>

                                    </div>
                                    )
                            }
                        </div>
                </div>)
            }
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose}>
              Save changes
            </Button>
          </DialogActions>
          
        </Dialog>
      </React.Fragment>
    );
  }

export default Tracking;