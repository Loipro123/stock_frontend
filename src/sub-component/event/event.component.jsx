import * as React from 'react';
import {useState} from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import axios from 'axios';
import {apiDomain} from '../../config';
import './event.styles.css';
const Event = () => {
  const [selectedDate, setSelectedDate] = useState(new Date()); // State for selected date




const handleSubmit = () => {
    axios.post(`${apiDomain}/tracking/event`, {date:handleDate(new Date(selectedDate)),data:formData}).then(response => {
        setFormData({
            name: '',
            description: '',
            stock: 'CCL',
            affectType: 'positive',
            severity:'low',
            source: '',
            // Add other fields as needed
          })
          setSelectedDate(new Date())
        console.log(response)
    }).catch(error => {
        setFormData({
            name: '',
            description: '',
            stock: 'CCL',
            affectType: 'positive',
            severity:'low',
            source: '',
            // Add other fields as needed
          })
        setSelectedDate(new Date())
        console.log(error)
    });
}
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    stock: 'CCL',
    affectType: 'positive',
    severity:'low',
    source: '',
  });
  const handleChange = (event) => {
      const { name, value } = event.target;
          setFormData({
            ...formData,
            [name]: value,
        });
  }

const handleDate = (date) => {
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
                value={formData.stock}
                label="Stock"
                name='stock'
                onChange={handleChange}
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
        <DemoContainer components={['DateTimePicker']}>
            <DateTimePicker label="Event time" defaultValue={dayjs(selectedDate)} onChange={(newValue) => setSelectedDate(newValue)} value={dayjs(selectedDate)}/>
        </DemoContainer>
        </LocalizationProvider>
      </div>
      <div>
        <TextField
          type="text" 
          id="outlined-multiline-flexible"
          label="Event Name"
          name="name"
          value={formData.name} onChange={handleChange}
          maxRows={4}
        />
        <TextField
          id="outlined-multiline-static"
          label="Description"
          multiline
          name="description"
          value={formData.description} onChange={handleChange}
          rows={4}
        />
         <TextField
          type="text" 
          id="outlined-multiline-flexible"
          label="Source"
          name="source"
          value={formData.source} onChange={handleChange}
          maxRows={4}
        />
      </div>
      <div className="last_row">
        <FormControl style={{
            width:"200px",
            marginRight:"10px"
        }}>
                <InputLabel id="demo-simple-select-label">Affect Type</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={formData.affectType}
                label="Affect Type"
                name='affectType'
                onChange={handleChange}
                >
                <MenuItem value={"positive"}>Positive</MenuItem>
                <MenuItem value={"negative"}>Negative</MenuItem>
                </Select>
        </FormControl>
        <FormControl style={{
            width:"200px"
        }}>
                <InputLabel id="demo-simple-select-label">Severity</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={formData.severity}
                label="Severity"
                name='severity'
                onChange={handleChange}
                >
                <MenuItem value={"low"}>Low</MenuItem>
                <MenuItem value={"medium"}>Medium</MenuItem>
                <MenuItem value={"high"}>High</MenuItem>
                </Select>
        </FormControl>
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

export default Event;