import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import SoccerBet from '../../components/soccer_bet/soccer_bet.component';
import SoccerPortfolio from '../../components/soccer_portfolio/soccer_portfolio.component';
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <div>{children}</div>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const Soccer = ({token}) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Portfolio" {...a11yProps(0)} />
          <Tab label="Soccer match" {...a11yProps(1)} />
          <Tab label="Over/Under analysis" {...a11yProps(2)} />
          <Tab label="Game bet analysis" {...a11yProps(3)} />
          <Tab label="Load data" {...a11yProps(4)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <SoccerPortfolio token={token}/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <SoccerBet token={token}/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Over/Under analysis
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        Game bet analysis
      </CustomTabPanel>
      <CustomTabPanel value={value} index={4}>
        Load data
      </CustomTabPanel>
    </Box>
  );
}

export default Soccer;