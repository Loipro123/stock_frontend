import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import axios from 'axios';
import { apiDomain } from '../../config';
import './load.styles.css';
const Load = () => {
  const [selectedStartDate, setSelectedStartDate] = useState(new Date()); // State for selected date
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());
  const [selectedCurrentDate, setSelectedCurrentDate] = useState(new Date());

  const [stock, setStock] = React.useState('CCL');
  const [status, setStatus] = React.useState('unknown')

  useEffect(() => {
    // Define the URL and any query parameters if needed
    const url = `${apiDomain}/loading/checkin`;
    // Make the GET request using Axios
    axios.post(url, { symbol: stock })
      .then(response => {
        // Handle the response data
        setSelectedCurrentDate(new Date(response.data.date));
        setSelectedStartDate(new Date(response.data.date));
      })
      .catch(error => {
        // Handle errors
        console.error('Error:', error);
      });
  }, [stock]);
  const handleChangeStock = (event) => {
    setStock(event.target.value);
  };

  const handleSubmit = () => {
    axios.post(`${apiDomain}/loading/upload`, {
      symbol: stock,
      startDate: handleDate(selectedStartDate),
      endDate: handleDate(selectedEndDate)
    }).then(response => {
      setSelectedCurrentDate(new Date(response.data.currentDate));
      setSelectedStartDate(new Date(response.data.currentDate));
      setStatus(response.data.message);
    }).catch(error => {
      setSelectedCurrentDate(new Date(error.response.data.currentDate));
      setSelectedStartDate(new Date(error.response.data.currentDate));
      setStatus(error.response.data.message);
    });
  }


  const handleDate = (date1) => {
    let date = new Date(date1)

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
      <div className="last_row">
        <FormControl>
          <InputLabel id="demo-simple-select-label">Stock</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={stock}
            label="Stock"
            onChange={handleChangeStock}
          >
            <MenuItem value={"CCL"}>CCL</MenuItem>
            <MenuItem value={"JPM"}>JP Morgan</MenuItem>
            <MenuItem value={"HD"}>Home Depot</MenuItem>
            <MenuItem value={"DAL"}>Delta</MenuItem>
            <MenuItem value={"NVDA"}>NVIDIA</MenuItem>
            <MenuItem value={"TSLA"}>Tesla</MenuItem>
            <MenuItem value={"RCL"}>Royal Caribbean</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className="date">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DatePicker']}>
            <DatePicker label="Start Date" defaultValue={dayjs(selectedStartDate)} onChange={(newValue) => setSelectedStartDate(newValue)} value={dayjs(selectedStartDate)} />
          </DemoContainer>
        </LocalizationProvider>
      </div>
      <div className="date">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DatePicker']}>
            <DatePicker label="End Date" defaultValue={dayjs(selectedEndDate)} onChange={(newValue) => setSelectedEndDate(newValue)} value={dayjs(selectedEndDate)} />
          </DemoContainer>
        </LocalizationProvider>
      </div>
      <div className="date">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DatePicker']}>
            <DatePicker label="Current Date of Data" defaultValue={dayjs(selectedCurrentDate)} onChange={(newValue) => setSelectedCurrentDate(newValue)} value={dayjs(selectedCurrentDate)} />
          </DemoContainer>
        </LocalizationProvider>
      </div>
      <div>

      </div>

      <div className="last_row">
        <Button variant="contained" style={{
          padding: "10px 15px",
          marginTop: "10px",
          fontWeight: "bold"
        }}
          onClick={handleSubmit}
        >Load Data</Button>
      </div>
      <div className="status">{status}</div>
    </Box>
  );
}

export default Load;