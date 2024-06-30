import React, { useEffect,useState } from 'react';
import { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import {apiDomain} from '../../services/config';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';
import ErrorIcon from '@mui/icons-material/Error';
import Checkbox from '@mui/material/Checkbox';
import './home.styles.css';

const Home = ({token}) => {
    const[arrData,setArrData] = useState([]);
    const[stockOverview,setStockOverview] = useState({})
    const[stockQuote,setStockQuote] = useState({})
    const[stockDetail,setStockDetail] = useState({});

    const[url,setUrl] = useState(`http://localhost:4000/data/scraping`);
    const [check1,setCheck1] = useState(true);
    const [check2,setCheck2] = useState(true);

    const [check3,setCheck3] = useState(true);
    const [check4,setCheck4] = useState(true);
    const [check5,setCheck5] = useState(true);

   
  
    useEffect(()=> {
        const body =  {
            stock:"nvda",
            time:"years"
        }
        if(token !== null){
          const config = {
            headers: {
              'x-auth-token': token
            },
            
          };
          axios.post(`${apiDomain}/data/scraping`,body, config)
                      .then(response => {
                        setArrData(response.data.merge_arr);
                        setStockQuote(response.data.stock.overviewQuote);
                        setStockOverview(response.data.stock.overviewInfo);
                        setStockDetail(response.data.stockDetail);
                      })
            .catch(error => {
                 console.log(error)
           });
        }else{
           
        }
        
      },[]);

      const containsNegativeSign = (text) => {
        return text ? text.includes('-') : false;
      };
    return(
        <div className='load'>
        {/* <div className="data-section">
            <h2>Details</h2>
            <table>
                <tbody>
                    {Object.entries(stockInfo.overviewInfo).map(([key, value]) => (
                        <tr key={key}>
                            <td className="data-key">{key}</td>
                            <td className="data-value">{value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div> */}
        <div className='stock-info'>
          <div className="stock-header">
            <span className="stock-name">{stockDetail.stockName}</span>
          </div>
          <div className="stock-details">
            <div className="stock-price">{stockDetail.stockPrice}</div>
            <div className={!containsNegativeSign(stockDetail.priceChange) ? "stock-change" : "stock-change1"}>{stockDetail.priceChange}</div>
            <div className="stock-date">{stockDetail.dateInfo}</div>
          </div>
          <div className="stock-details">
            <div className="stock-price">{stockDetail.priceAfter}</div>
            <div className="stock-change">{stockDetail.priceChangeAfter}</div>
            <div className="stock-date">{stockDetail.dateTimeAfter}</div>
          </div>
        </div>
        <div className='stock_detail_contain'>
            <div>
                {Object.entries(stockOverview).map(([key, value]) => (
                        <div key={key} className='stock_detail'>
                            <div className="data-key">{key}</div>
                            <div className="data-value">{value}</div>
                        </div>
                ))}
            </div>
            <div>
                {Object.entries(stockQuote).map(([key, value]) => (
                        <div key={key} className='stock_detail'>
                            <div className="data-key">{key}</div>
                            <div className="data-value">{value}</div>
                        </div>
                ))}
        </div>
        </div>
        
        <LineChart
          width={1400}
          height={700}
          data={arrData}
          margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
          
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Year" />
          <YAxis />
          <Tooltip />
          <Legend />
                {
                  check1 === true ? <Line type="monotone" dataKey="Return on Capital (ROIC)" stroke="#1E7DF9" activeDot={{ r: 8 }}/> : null
                }
                {
                  check2 === true ? <Line type="monotone" dataKey="Cash Growth" stroke="#82ca9d" /> : null

                }
                {
                  check3 === true ? <Line type="monotone" dataKey="Revenue Growth (YoY)" stroke="#AB47BC" /> : null

                }
                {
                  check4 === true ? <Line type="monotone" dataKey="EPS Growth" stroke="#5C6BC0" /> : null

                }
                {
                  check5 === true ? <Line type="monotone" dataKey="Equity Growth Rate (%)" stroke="#D3302F" /> : null

                }
        </LineChart>
        <div style={{display:"flex"}}>
              <FormControlLabel control={<Checkbox checked={check1} onChange={(event)=>{
                setCheck1(event.target.checked)
              }}/>} label="Return on Capital (ROIC)" />
              <FormControlLabel  control={<Checkbox checked={check2} onChange={(event)=>{
                setCheck2(event.target.checked)
              }}/>} label="Cash Growth" />
              <FormControlLabel  control={<Checkbox checked={check3} onChange={(event)=>{
                setCheck3(event.target.checked)
              }}/>} label="Revenue Growth (YoY)" />
              <FormControlLabel  control={<Checkbox checked={check4} onChange={(event)=>{
                setCheck4(event.target.checked)
              }}/>} label="EPS Growth" />
              <FormControlLabel  control={<Checkbox checked={check5} onChange={(event)=>{
                setCheck5(event.target.checked)
              }}/>} label="Equity Growth Rate (%)" />
           </div>
        </div>
    )
}

export default Home;