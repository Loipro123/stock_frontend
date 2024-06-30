import React,{useState,useEffect} from 'react';
import Tooltip from '@mui/material/Tooltip';
import ErrorIcon from '@mui/icons-material/Error';
import { styled } from '@mui/material/styles';



const StyledTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))`
    & .MuiTooltip-tooltip {
        color: #ff1744; 
        background: #fff2f2; 
        border: 1px solid #ff1744; 
        border-radius: 4px; 
        padding: 8px 16px; 
    }
`;

const ErrorIconWithTooltip = ({ errorMessage }) => {
  return (
    <StyledTooltip title={errorMessage} placement="top" classes={{
        tooltipTitle: {
        }
    }}>
      <ErrorIcon color='error'/>
    </StyledTooltip>
  );
}

export default ErrorIconWithTooltip;