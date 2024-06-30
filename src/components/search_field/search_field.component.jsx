import React,{useState,useEffect} from 'react';
import './search_field.styles.css';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
const SearchInput = ({placeholder,handleSet,lists,inputValue,widthValue}) => {
    return(
        <Autocomplete
        freeSolo
        style={{
            width:widthValue === true ?  '100%' :'240px',
            marginRight:widthValue === true ? '0' : '1rem',
            backgroundColor:'white'
        }}
        id="free-solo-demo"
        size='small'
        value={inputValue}
        onChange={(event, newValue) => {
          handleSet(newValue)
        }}
        options={lists.map((option) => option)}

        renderInput={(params) => {
        return <TextField {...params} label={placeholder} onChange={(e)=>{
            handleSet(e.target.value)
        }}
        />}}
      />
    )
}





export default SearchInput;