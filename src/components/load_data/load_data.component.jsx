import React, {useState,useEffect} from 'react';
import './load_data.styles.css';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import CheckIcon from '@mui/icons-material/Check';
import Checkbox from '@mui/material/Checkbox';
import ErrorIcon from '@mui/icons-material/Error';

import {apiDomain} from '../../services/config';
import axios from 'axios';



const LoadData = ({token}) => {
    //
    const [update,setUpdate] = useState(true);
    const [estimateTime, setEstimateTime] = useState(0);
    ///
    const [event1,setEvent1] = useState(
        {
            run: true,
            event: 'Load events from Finnhub',
            run_status: 'N/A',
            maxdate: '',
            latest_update: '',
            latest_status: ''
        }
    )
    const [event2,setEvent2] = useState(
        {
            run: true,
            event: 'Load general events from Finnhub',
            run_status: 'N/A',
            maxdate: '',
            latest_update: '',
            latest_status: ''
        }
    )
    const [event3,setEvent3] = useState(
        {
            run: true,
            event: 'Load stock price from yahooFinance',
            run_status: 'N/A',
            maxdate: '',
            latest_update: '',
            latest_status: ''
        }
    )
    const [event4,setEvent4] = useState(
        {
            run: true,
            event: 'Load events from Polyon',
            run_status: 'N/A',
            maxdate: '',
            latest_update: '',
            latest_status: ''
        }
    )
    const [event5,setEvent5] = useState(
        {
            run: true,
            event: 'Load 15 stock price from Polyon',
            run_status: 'N/A',
            maxdate: '',
            latest_update: '',
            latest_status: ''
        }
    )
    ////
    const [progress, setProgress] = useState(10);
    ///
    const [seconds, setSeconds] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
   ////
    
   useEffect(()=> {
    if(token !== null){
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      axios.get(`${apiDomain}/load/update_status`, config)
                  .then(response => {
                     setEvent1((prev) => {
                        return {
                            ...prev,
                            maxdate: new Date(response.data.date[0]).toLocaleString(),
                            latest_update: new Date(response.data.event[0].update_date).toLocaleString(),
                            latest_status: response.data.event[0].status
                        }
                     })

                     setEvent2((prev) => {
                        return {
                            ...prev,
                            maxdate: new Date(response.data.date[1]).toLocaleString(),
                            latest_update: new Date(response.data.event[1].update_date).toLocaleString(),
                            latest_status: response.data.event[1].status
                        }
                     })

                     setEvent3((prev) => {
                        return {
                            ...prev,
                            maxdate: new Date(response.data.date[2]).toLocaleString(),
                            latest_update: new Date(response.data.event[2].update_date).toLocaleString(),
                            latest_status: response.data.event[2].status
                        }
                     })
                    setEvent4((prev) => {
                        return {
                            ...prev,
                            maxdate: new Date(response.data.date[3]).toLocaleString(),
                            latest_update: new Date(response.data.event[3].update_date).toLocaleString(),
                            latest_status: response.data.event[3].status
                        }
                     })

                    setEvent5((prev) => {
                        return {
                            ...prev,
                            maxdate: new Date(response.data.date[4]).toLocaleString(),
                            latest_update: new Date(response.data.event[4].update_date).toLocaleString(),
                            latest_status: response.data.event[4].status
                        }
                     })
                  })
        .catch(error => {
             console.log(error)
       });
    }else{
       
    }
    
  },[update])
    useEffect(() => {
        let interval;
    
        if (isRunning) {
          interval = setInterval(() => {
            setSeconds((prevSeconds) => (prevSeconds === 59 ? 0 : prevSeconds + 1));
    
            if (seconds === 59) {
              setMinutes((prevMinutes) => prevMinutes + 1);
            }
          }, 1000);
        }
    
        return () => {
          clearInterval(interval);
        };
      }, [isRunning, seconds]);
      ///
    const startClock = () => {
        setIsRunning(true);
      };
    
    const stopClock = () => {
        setIsRunning(false);
    };
    
    const resetClock = () => {
        setSeconds(0);
        setMinutes(0);
        setEstimateTime(0);
        setUpdate((prev) => !prev)
        setEvent1((prev) => {return {...prev,run:false, run_status:'N/A',}})
        setEvent2((prev) => {return {...prev,run:false, run_status:'N/A',}})
        setEvent3((prev) => {return {...prev,run:false, run_status:'N/A',}})
        setEvent4((prev) => {return {...prev,run:false, run_status:'N/A',}})
        setEvent5((prev) => {return {...prev,run:false, run_status:'N/A',}})

      };

    /// handle submit
    const handlSubmit = async () => {
        calculateTime();
        const config = {
            headers: {
              'x-auth-token': token
            }
        };
        if(event1.run === true){
            setEvent1((prev) => {return {...event1, run_status: 'running'}});
            try {
                await axios.get(`${apiDomain}/event/loadevent_finnhub`,config);
                const dataToSend = {
                    event: 'Load events from Finnhub',
                    status: 'success',
                    // Add other key-value pairs as needed
                };
                await axios.post(`${apiDomain}/load/update_status`,dataToSend,config)
                setEvent1((prev) => {return {...prev, run_status: 'success'}});
              } catch (error) {
                const dataToSend = {
                    event: 'Load events from Finnhub',
                    status: 'failed',
                    // Add other key-value pairs as needed
                };
                await axios.post(`${apiDomain}/load/update_status`,dataToSend,config)
                setEvent1((prev) => {return {...prev, run_status: 'failed'}});

              }
        }
        if(event2.run === true){
            setEvent2((prev) => {return {...event2, run_status: 'running'}});
            try {
                const response = await axios.get(`${apiDomain}/event/load_general_event`,config);
                const dataToSend = {
                    event: 'Load general events from Finnhub',
                    status: 'success',
                    // Add other key-value pairs as needed
                };
                await axios.post(`${apiDomain}/load/update_status`,dataToSend,config)
                setEvent2((prev) => {return {...prev, run_status: 'success'}});
              } catch (error) {
                const dataToSend = {
                    event: 'Load general events from Finnhub',
                    status: 'failed',
                    // Add other key-value pairs as needed
                };
                await axios.post(`${apiDomain}/load/update_status`,dataToSend,config)
                setEvent2((prev) => {return {...prev, run_status: 'failed'}});

              }
        }
        if(event3.run === true){
            setEvent3((prev) => {return {...prev, run_status: 'running'}});
            try {
                await axios.get(`${apiDomain}/price/loadyahoo_stock`,config);
                const dataToSend = {
                    event: 'Load stock price from yahooFinance',
                    status: 'success',
                    // Add other key-value pairs as needed
                };
                await axios.post(`${apiDomain}/load/update_status`,dataToSend,config)
                setEvent3((prev) => {return {...prev, run_status: 'success'}});
              } catch (error) {
                const dataToSend = {
                    event: 'Load stock price from yahooFinance',
                    status: 'failed',
                    // Add other key-value pairs as needed
                };
                await axios.post(`${apiDomain}/load/update_status`,dataToSend,config)
                setEvent3((prev) => {return {...prev, run_status: 'failed'}});

              }
        }
        if(event4.run === true){
            setEvent4((prev) => {return {...prev, run_status: 'running'}});
            try {
                await axios.get(`${apiDomain}/event/loadevent_polygon`,config);
                const dataToSend = {
                    event: 'Load events from Polyon',
                    status: 'success',
                    // Add other key-value pairs as needed
                };
                await axios.post(`${apiDomain}/load/update_status`,dataToSend,config)
                setEvent4((prev) => {return {...prev, run_status: 'success'}});
              } catch (error) {
                const dataToSend = {
                    event: 'Load events from Polyon',
                    status: 'failed',
                    // Add other key-value pairs as needed
                };
                await axios.post(`${apiDomain}/load/update_status`,dataToSend,config)
                setEvent4((prev) => {return {...prev, run_status: 'failed'}});

              }
        }
        if(event5.run === true){
            setEvent5((prev) => {return {...prev, run_status: 'running'}});
            try {
                await axios.get(`${apiDomain}/price/loadpolygon_stock_15`,config);
                const dataToSend = {
                    event: 'Load 15 stock price from Polyon',
                    status: 'success',
                    // Add other key-value pairs as needed
                };
                await axios.post(`${apiDomain}/load/update_status`,dataToSend,config)
                setEvent5((prev) => {return {...prev, run_status: 'success'}});
              } catch (error) {
                const dataToSend = {
                    event: 'Load 15 stock price from Polyon',
                    status: 'failed',
                    // Add other key-value pairs as needed
                };
                await axios.post(`${apiDomain}/load/update_status`,dataToSend,config)
                setEvent5((prev) => {return {...prev, run_status: 'failed'}});

              }
        }
        
        setUpdate((prev) => !prev);
        stopClock();
    }
    const calculateTime =() =>{
        if(event1.run === true){
            setEstimateTime((prev) => prev + 420)
        }

        if(event2.run === true){
            setEstimateTime((prev) => prev + 2)
        }

        if(event3.run === true){
            setEstimateTime((prev) => prev + 40)
        }

        if(event4.run === true){
            setEstimateTime((prev) => prev + 402)
        }

        if(event5.run === true){
            setEstimateTime((prev) => prev + 402)
        }
        startClock()
    }

    const convertSecondsToMinutesAndSeconds = (totalSeconds) => {
        // Calculate minutes and remaining seconds
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
    
        // Format into xx:xx
        const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    
        return formattedTime;
    }
    
    // Example usage
    const totalSeconds = 400;
    const result = convertSecondsToMinutesAndSeconds(totalSeconds);
    
    console.log(result); // Output: "6:40"
    
    return(
        <div className='load'>
            <div style={{display:'flex',justifyContent:'flex-start', width:'80%'}}>
            <Button variant="contained" onClick={handlSubmit} disabled={
                event1.run_status === 'running' || event2.run_status === 'running' || event3.run_status === 'running' || event4.run_status === 'running'
                || event5.run_status === 'running' || update === false 
    
            }>Load</Button>
            </div>
            <TableContainer component={Paper} sx={{ width:'80%' }}>
                <Table sx={{ width:'100%' }} aria-label="simple table">
                    <caption style={{border: '1px solid black'}}>
                        <span>Total loading time </span>
                        <span style={{fontWeight:'bold'}}>{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}</span>
                        <span> (Estimate loading time {convertSecondsToMinutesAndSeconds(estimateTime)})</span>
                        <span onClick={resetClock} style={{textDecoration:'underline', padding:'0 10px', cursor:'pointer', fontWeight:'bold'}}> Reset</span>
                    </caption>

                    <TableHead>
                    <TableRow >
                        <TableCell  align="center" sx={  { border: 0.5 , fontWeight: 'bold'} }>Run</TableCell>
                        <TableCell sx={  { border: 0.5 , fontWeight: 'bold'} }>Events</TableCell>
                        <TableCell align="center"  sx={  { border: 0.5 , fontWeight: 'bold'} }>Progress</TableCell>
                        <TableCell align="center"  sx={  { border: 0.5 , fontWeight: 'bold'} }>Max date of event</TableCell>
                        <TableCell align="center"  sx={  { border: 0.5 , fontWeight: 'bold'} }>Latest update</TableCell>
                        <TableCell align="center"  sx={  { border: 0.5 , fontWeight: 'bold'} }>Latest update status</TableCell>


                    </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                        <TableCell align="center"  sx={  { border: 0.5 }}><Checkbox size="small" checked={event1.run} onChange={(event) => {setEvent1((prev) => {return {...prev,run: event.target.checked}});}}></Checkbox></TableCell>
                        <TableCell align="left"  sx={  { border: 0.5 }}>{event1.event}</TableCell>
                        <TableCell align="center" sx={  { border: 0.5 }}>
                            {event1.run_status === 'running' ?  
                                <Box sx={{ display: 'flex' , justifyContent:'center', alignItems:'center'}}>
                                    <CircularProgress size={25}/>
                                </Box> : 
                                (event1.run_status === 'success' ?<CheckIcon  sx={{
                                    color: 'green'}}/> : (event1.run_status === 'failed' ? <ErrorIcon sx={{
                                        color: 'red'}}/> :'N/A'))
                            } 
                        </TableCell>
                        <TableCell align="center" sx={  { border: 0.5 }}>{event1.maxdate}</TableCell>
                        <TableCell align="center" sx={  { border: 0.5 }}>{event1.latest_update}</TableCell>
                        <TableCell align="center" sx={  { border: 0.5 }}>{event1.latest_status}</TableCell>
                      </TableRow>   
                      <TableRow>
                        <TableCell align="center"  sx={  { border: 0.5 }}><Checkbox size="small" checked={event2.run} onChange={(event) => {setEvent2((prev) => {return {...prev,run: event.target.checked}});}}></Checkbox></TableCell>
                        <TableCell align="left"  sx={  { border: 0.5 }}>{event2.event}</TableCell>
                        <TableCell align="center" sx={  { border: 0.5 }}>
                            {event2.run_status === 'running' ?  
                                <Box sx={{ display: 'flex' , justifyContent:'center', alignItems:'center'}}>
                                    <CircularProgress size={25}/>
                                </Box> : 
                                (event2.run_status === 'success' ?<CheckIcon  sx={{
                                    color: 'green'}}/> : (event2.run_status === 'failed' ? <ErrorIcon sx={{
                                        color: 'red'}}/> :'N/A'))
                            } 
                        </TableCell>
                        <TableCell align="center" sx={  { border: 0.5 }}>{event2.maxdate}</TableCell>
                        <TableCell align="center" sx={  { border: 0.5 }}>{event2.latest_update}</TableCell>
                        <TableCell align="center" sx={  { border: 0.5 }}>{event2.latest_status}</TableCell>
                      </TableRow>    
                      <TableRow>
                        <TableCell align="center"  sx={  { border: 0.5 }}><Checkbox size="small" checked={event3.run} onChange={(event) => {setEvent3((prev) => {return {...prev,run: event.target.checked}});}}></Checkbox></TableCell>
                        <TableCell align="left"  sx={  { border: 0.5 }}>{event3.event}</TableCell>
                        <TableCell align="center" sx={  { border: 0.5 }}>
                            {event3.run_status === 'running' ?  
                                <Box sx={{ display: 'flex' , justifyContent:'center', alignItems:'center'}}>
                                    <CircularProgress size={25}/>
                                </Box> : 
                                (event3.run_status === 'success' ?<CheckIcon  sx={{
                                    color: 'green'}}/> :  (event3.run_status === 'failed' ? <ErrorIcon sx={{
                                        color: 'red'}}/> :'N/A'))
                            } 
                        </TableCell>
                        <TableCell align="center" sx={  { border: 0.5 }}>{event3.maxdate}</TableCell>
                        <TableCell align="center" sx={  { border: 0.5 }}>{event3.latest_update}</TableCell>
                        <TableCell align="center" sx={  { border: 0.5 }}>{event3.latest_status}</TableCell>
                      </TableRow>  
                      <TableRow>
                        <TableCell align="center"  sx={  { border: 0.5 }}><Checkbox size="small" checked={event4.run} onChange={(event) => {setEvent4((prev) => {return {...prev,run: event.target.checked}});}}></Checkbox></TableCell>
                        <TableCell align="left"  sx={  { border: 0.5 }}>{event4.event}</TableCell>
                        <TableCell align="center" sx={  { border: 0.5 }}>
                            {event4.run_status === 'running' ?  
                                <Box sx={{ display: 'flex' , justifyContent:'center', alignItems:'center'}}>
                                    <CircularProgress size={25}/>
                                </Box> : 
                                (event4.run_status === 'success' ?<CheckIcon  sx={{
                                    color: 'green'}}/> :  (event4.run_status === 'failed' ? <ErrorIcon sx={{
                                        color: 'red'}}/> :'N/A'))
                            } 
                        </TableCell>
                        <TableCell align="center" sx={  { border: 0.5 }}>{event4.maxdate}</TableCell>
                        <TableCell align="center" sx={  { border: 0.5 }}>{event4.latest_update}</TableCell>
                        <TableCell align="center" sx={  { border: 0.5 }}>{event4.latest_status}</TableCell>
                      </TableRow>   
                      <TableRow>
                        <TableCell align="center"  sx={  { border: 0.5 }}><Checkbox size="small" checked={event5.run} onChange={(event) => {setEvent5((prev) => {return {...prev,run: event.target.checked}});}}></Checkbox></TableCell>
                        <TableCell align="left"  sx={  { border: 0.5 }}>{event5.event}</TableCell>
                        <TableCell align="center" sx={  { border: 0.5 }}>
                            {event5.run_status === 'running' ?  
                                <Box sx={{ display: 'flex' , justifyContent:'center', alignItems:'center'}}>
                                    <CircularProgress size={25}/>
                                </Box> : 
                                (event5.run_status === 'success' ?<CheckIcon  sx={{
                                    color: 'green'}}/> : (event5.run_status === 'failed' ? <ErrorIcon sx={{
                                        color: 'red'}}/> :'N/A'))
                            } 
                        </TableCell>
                        <TableCell align="center" sx={  { border: 0.5 }}>{event5.maxdate}</TableCell>
                        <TableCell align="center" sx={  { border: 0.5 }}>{event5.latest_update}</TableCell>
                        <TableCell align="center" sx={  { border: 0.5 }}>{event5.latest_status}</TableCell>
                      </TableRow>                                                       
                    </TableBody>
                  
                </Table>
            </TableContainer>
        </div>
    )
}

export default LoadData;