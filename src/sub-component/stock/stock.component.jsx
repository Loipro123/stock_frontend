import * as React from 'react';
import {useState} from 'react';
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
import {apiDomain} from '../../config';
import './stock.styles.css';
const Stocks = () => {
  const [selectedDate, setSelectedDate] = useState(new Date()); // State for selected date
  const [stock, setStock] = React.useState('CCL');

  const handleChangeStock = (event) => {
    setStock(event.target.value);
  };

  let arrayDate = [];
  const [formData, setFormData] = useState({
    field1: '0',
    field2: '0',
    field3: '0',
    field4: '0',
    field5: '0',
    field6: '0',
    field7: '0',
    field8: '0',
    field9: '0',
    field10: '0',
    field11: '0',
    // Add other fields as needed
  });
  const handleChange = (event) => {
      const re = /^[0-9\b]+(\.[0-9]{0,2})?$/;
      // regex to match numbers/decimals up to 2 decimal places
      const { name, value } = event.target;
      if (value === '' || re.test(value)) { // check if input is empty or matches regex
          setFormData({
            ...formData,
            [name]: value,
          });
      }
  }

  const handleSubmit = () => {
      if(convertNum(formData.field1)!=0.00){
          arrayDate.push({symbol: stock,datetime:handleDate(selectedDate,8,30),price:convertNum(formData.field1)})
      }
      if(convertNum(formData.field2)!=0.00){
        arrayDate.push({symbol: stock,datetime:handleDate(selectedDate,9,0),price:convertNum(formData.field2)})
    }
    if(convertNum(formData.field3)!=0.00){
        arrayDate.push({symbol: stock,datetime:handleDate(selectedDate,9,30),price:convertNum(formData.field3)})
    }
    if(convertNum(formData.field4)!=0.00){
        arrayDate.push({symbol: stock,datetime:handleDate(selectedDate,10,0),price:convertNum(formData.field4)})
    }
    if(convertNum(formData.field5)!=0.00){
        arrayDate.push({symbol: stock,datetime:handleDate(selectedDate,11,0),price:convertNum(formData.field5)})
    }
    if(convertNum(formData.field6)!=0.00){
        arrayDate.push({symbol: stock,datetime:handleDate(selectedDate,12,0),price:convertNum(formData.field6)})
    }
    if(convertNum(formData.field7)!=0.00){
        arrayDate.push({symbol: stock,datetime:handleDate(selectedDate,13,30),price:convertNum(formData.field7)})
    }
    if(convertNum(formData.field8)!=0.00){
        arrayDate.push({symbol: stock,datetime:handleDate(selectedDate,15,0),price:convertNum(formData.field8)})
    }
    if(convertNum(formData.field9)!=0.00){
        arrayDate.push({symbol: stock,datetime:handleDate(selectedDate,15,30),price:convertNum(formData.field9)})
    }
    if(convertNum(formData.field10)!=0.00){
        arrayDate.push({symbol: stock,datetime:handleDate(selectedDate,16,0),price:convertNum(formData.field10)})
    }
    if(convertNum(formData.field11)!=0.00){
        arrayDate.push({symbol: stock,datetime:handleDate(selectedDate,16,30),price:convertNum(formData.field11)})
    }
    axios.post(`${apiDomain}/tracking/stock`, {arrayDate}).then(response => {
        setFormData({
            field1: '0',
            field2: '0',
            field3: '0',
            field4: '0',
            field5: '0',
            field6: '0',
            field7: '0',
            field8: '0',
            field9: '0',
            field10: '0',
            field11: '0',
            // Add other fields as needed
          })
        arrayDate = []
        console.log(response)
    }).catch(error => {
        arrayDate = []
        setFormData({
            field1: '0',
            field2: '0',
            field3: '0',
            field4: '0',
            field5: '0',
            field6: '0',
            field7: '0',
            field8: '0',
            field9: '0',
            field10: '0',
            field11: '0',
            // Add other fields as needed
          })
        console.log(error)
    });
  }

  const convertNum = (stringValue) => {
    const floatValue = parseFloat(stringValue);
    return  floatValue.toFixed(2);
  }
  const handleDate = (date1,hour,minute) => {
    let date = new Date(date1)
    date.setSeconds(0)
    date.setHours(hour)
    date.setMinutes(minute)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
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
                </Select>
        </FormControl>
      </div>
      <div className="date">
        
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['DatePicker']}>
            <DatePicker label="Tracking Date" defaultValue={dayjs(selectedDate)} onChange={(newValue) => setSelectedDate(newValue)} value={dayjs(selectedDate)}/>
        </DemoContainer>
        </LocalizationProvider>
      </div>
      <div>
        <TextField
          type="text" 
          id="outlined-multiline-flexible"
          label="8:30"
          name="field1"
          value={formData.field1} onChange={handleChange}
          maxRows={4}
        />
        <TextField
          type="text" 
          id="outlined-multiline-flexible"
          label="9:00"
          name="field2"
          value={formData.field2} onChange={handleChange}
          maxRows={4}
        />
         <TextField
          type="text" 
          id="outlined-multiline-flexible"
          label="9:30"
          name="field3"
          value={formData.field3} onChange={handleChange}
          maxRows={4}
        />
      </div>
      <div>
      <TextField
          type="text" 
          id="outlined-multiline-flexible"
          label="10:00"
          name="field4"
          value={formData.field4} onChange={handleChange}
          maxRows={4}
        />
         <TextField
          type="text" 
          id="outlined-multiline-flexible"
          label="11:00"
          name="field5"
          value={formData.field5} onChange={handleChange}
          maxRows={4}
        />
         <TextField
          type="text" 
          id="outlined-multiline-flexible"
          label="12:00"
          name="field6"
          value={formData.field6} onChange={handleChange}
          maxRows={4}
        />
      </div>
      <div>
      <TextField
          type="text" 
          id="outlined-multiline-flexible"
          label="13:30"
          name="field7"
          value={formData.field7} onChange={handleChange}
          maxRows={4}
        />
         <TextField
          type="text" 
          id="outlined-multiline-flexible"
          label="15:00"
          name="field8"
          value={formData.field8} onChange={handleChange}
          maxRows={4}
        />
         <TextField
          type="text" 
          id="outlined-multiline-flexible"
          label="15:30"
          name="field9"
          value={formData.field9} onChange={handleChange}
          maxRows={4}
        />
      </div>
      <div className="last_row">
      <TextField
          type="text" 
          id="outlined-multiline-flexible"
          label="16:00"
          name="field10"
          value={formData.field10} onChange={handleChange}
          maxRows={4}
        />
         <TextField
          type="text" 
          id="outlined-multiline-flexible"
          label="16:30"
          name="field11"
          value={formData.field11} onChange={handleChange}
          maxRows={4}
        />
      </div>
      <div className="last_row">
          <Button variant="contained" style={{
              padding:"10px 15px",
              marginTop:"10px",
              fontWeight:"bold"
          }}
          onClick={handleSubmit}
          >Submit</Button>
      </div>
    </Box>
  );
}

export default Stocks;