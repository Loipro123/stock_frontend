import React, {useEffect,useState, PureComponent} from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import './load_daily.styles.css';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';
import ErrorIcon from '@mui/icons-material/Error';
import Checkbox from '@mui/material/Checkbox';
import {apiDomain} from '../../services/config';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];
const LoadDaily = ({token}) => {
    const [check1,setCheck1] = useState(true);
    const [check2,setCheck2] = useState(true);

    const [check3,setCheck3] = useState(true);
    const [check4,setCheck4] = useState(true);
    const [check5,setCheck5] = useState(true);

    const [check6,setCheck6] = useState(true);
    const [check7,setCheck7] = useState(true);
    const [check8,setCheck8] = useState(true);


    const [status,setStatus] = useState('')
    /////
    const [valueAction, setValueAction] = useState('add');
    
    const handleChangeAction = (event) => {
        setValueAction(event.target.value);
      };

    ////
    const [stock, setStock] = useState('');
    const [stocks,setStocks] = useState([]);

    const handleChangeStock = (event) => {
        setStock(event.target.value);
    };
    //
    const [graphData,setGraphData] = useState([]);
    ///
    const [symbol,setSymbol] = useState('AAL')
    const [symbols,setSymbols] = useState([])
    const handleChangeSymbol = (event) => {
        setSymbol(event.target.value);
    };
    useEffect(()=> {
        if(token !== null){
          const config = {
            headers: {
              'x-auth-token': token
            }
          };
          axios.get(`${apiDomain}/service/stock_data`, config)
                      .then(response => {
                         setSymbols(response.data.currents);
                         setSymbol(response.data.currents[0]);
                         if(valueAction==='add'){
                            setStocks(response.data.differenceArray)
                            setStock(response.data.differenceArray[0])
                         }else{
                            setStocks(response.data.currents)
                            setStock(response.data.currents[0])
                         }

                      })
            .catch(error => {
                 console.log(error)
           });
        }else{
           
        }
        
      },[valueAction,status]);

      useEffect(()=> {
        if(token !== null){
          const config = {
            headers: {
                'x-auth-token': token
            }
        };
        
        const params = {
            symbol: symbol,
            day: 1
        };
        
        axios.get(`${apiDomain}/service/daily_predict`, {
            headers: config.headers,
            params: params
        })
            .then(response => {
                setGraphData(response.data.data);
                console.log(response.data);
            })
            .catch(error => {
                console.error(error);
            });
        }else{
           
        }
        
      },[symbol]);
    const handleSubmit = async() => {
        const config = {
            headers: {
              'x-auth-token': token
            }
        };
        const dataToSend = {
            action: valueAction,
            symbol: stock,
            // Add other key-value pairs as needed
        };
        setStatus('running')
        try {
            await axios.post(`${apiDomain}/service/stock_data`,dataToSend,config)
            setStatus('success')

        } catch (error) {
            setStatus('failed')
        }
    }
    return(
        <div className='load'>
            <div style={{display:'flex', justifyContent:'center', alignItems:'center', padding: "10px ",gap:"20px"}}>
                <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    value={valueAction}
                    onChange={handleChangeAction}
                >
                    <FormControlLabel value="add" control={<Radio />} label="Add" />
                    <FormControlLabel value="remove" control={<Radio />} label="Remove" />
                </RadioGroup>

                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                    <InputLabel id="demo-select-small-label">Symbol</InputLabel>
                    <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        value={stock}
                        label="Symbol"
                        onChange={handleChangeStock}
                    >
                         {
                            stocks.map(item => <MenuItem key={item} value={item}>{item}</MenuItem>
                            )
                         }
                    </Select>
                </FormControl>
                <Button variant="contained" onClick={handleSubmit}>Submit</Button>
                {(status === 'success' ?<CheckIcon  sx={{
                                    color: 'green'}}/> : (status === 'failed' ? <ErrorIcon sx={{
                                        color: 'red'}}/> : null))}
            </div>
            <div>
                    <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        value={symbol}
                        onChange={handleChangeSymbol}
                    >
                        {
                            symbols.map((item) =>  <FormControlLabel key={item} value={item} control={<Radio />} label={item} />
                            )
                        }
                    </RadioGroup>
            </div>
           <div>
                <LineChart
                width={1400}
                height={700}
                data={graphData}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
                >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="datetime" />
                <YAxis />
                <Tooltip />
                {/* <Legend /> */}
                {
                  check1 === true ? <Line type="monotone" dataKey="use_all_past_data_nextday" stroke="#8884d8" activeDot={{ r: 8 }}/> : null
                }
                {
                  check2 === true ? <Line type="monotone" dataKey="use_1_year_data_nextday" stroke="#82ca9d" /> : null

                }
                {
                  check3 === true ? <Line type="monotone" dataKey="use_6_month_data_nextday" stroke="#AB47BC" /> : null

                }
                {
                  check4 === true ? <Line type="monotone" dataKey="use_3_month_data_nextday" stroke="#5C6BC0" /> : null

                }
                {
                  check5 === true ? <Line type="monotone" dataKey="use_2_month_data_nextday" stroke="#DCE775" /> : null

                }
                {
                  check6 === true ? <Line type="monotone" dataKey="use_1_month_data_nextday" stroke="#857B5B" /> : null

                }
                {
                  check7 === true ? <Line type="monotone" dataKey="use_2_week_data_nextday" stroke="#9F6E5E" /> : null

                }
                {
                  check8 === true ? <Line type="monotone" dataKey="real" stroke="#1B5E20" /> : null

                }
                </LineChart>
           </div>
           <div style={{display:"flex"}}>
              <FormControlLabel control={<Checkbox checked={check1} onChange={(event)=>{
                setCheck1(event.target.checked)
              }}/>} label="All data" />
              <FormControlLabel  control={<Checkbox checked={check2} onChange={(event)=>{
                setCheck2(event.target.checked)
              }}/>} label="1 year" />
              <FormControlLabel  control={<Checkbox checked={check3} onChange={(event)=>{
                setCheck3(event.target.checked)
              }}/>} label="6 months" />
              <FormControlLabel  control={<Checkbox checked={check4} onChange={(event)=>{
                setCheck4(event.target.checked)
              }}/>} label="3 months" />
              <FormControlLabel  control={<Checkbox checked={check5} onChange={(event)=>{
                setCheck5(event.target.checked)
              }}/>} label="2 months" />
              <FormControlLabel  control={<Checkbox checked={check6} onChange={(event)=>{
                setCheck6(event.target.checked)
              }}/>} label="1 months" />
              <FormControlLabel  control={<Checkbox checked={check7} onChange={(event)=>{
                setCheck7(event.target.checked)
              }}/>} label="2 weeks" />
              <FormControlLabel  control={<Checkbox checked={check8} onChange={(event)=>{
                setCheck8(event.target.checked)
              }}/>} label="Real value" />

           </div>
        </div>
    )
}

export default LoadDaily