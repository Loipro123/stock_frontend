import React, { useCallback, useMemo, useState,useEffect  } from 'react';
import { MaterialReactTable } from 'material-react-table';
import {apiDomain} from '../../services/config';
import axios from 'axios';
import './soccer_bet.styles.css';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Autocomplete from '@mui/material/Autocomplete';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';
import { NumericFormat } from 'react-number-format';
import { blue } from '@mui/material/colors';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import close from '../../assets/img/close.png';
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import ErrorIconWithTooltip from '../../reuse_component/error_icon/error_icon.component';
import SearchInput from '../search_field/search_field.component';
import SoccerAnalyst from '../soccer_analyst/soccer_analyst.component';
const SoccerBet = ({token}) => {
    const [tableData, setTableData] = useState([]);
    const [rowEdit,setRowEdit] = useState([]);
    const [title,setTitle] = useState('');
    const [editModalOpen,setEditModalOpen] = useState(false);
    const [reload,setReload] =useState(false);
    useEffect(()=> {
        if(token !== null){
          const config = {
            headers: {
              'x-auth-token': token
            }
          };
          axios.get(`${apiDomain}/soccer/getmatch`, config)
                      .then(response => {
                         setTableData(response.data.matches)
                         console.log(response.data.matches)
                      })
            .catch(error => {
                 console.log(error)
           });
        }else{
           
        }
        
      },[token,reload])

      const handleDeleteRow = useCallback(
        (row) => {
          if (
            !window.confirm(`Are you sure you want to delete ${row.getValue('name')}`)
          ) {
            return;
          }
    
          const config = {
            headers: {
              'x-auth-token': token
            }
          };
          axios.post(`${apiDomain}/soccer/deletematch`,{
            date: row.getValue('match_date'),
            team1: row.getValue('team1'),
            team2: row.getValue('team2')
          },config)
                      .then(response => {    
                        setReload((prev) => !prev)  
                      })
            .catch(error => {
                 console.log(error)
           });
          //send api delete request here, then refetch or update local table data for re-render
          
        },
        [token],
      );

      const columns = useMemo(
        () => [
            {
                accessorFn: (row) => new Date(row.match_date),
                accessorKey: 'match_date',
                header: 'Match date',
                size: 200,
                filterFn: 'lessThanOrEqualTo',
                sortingFn: 'datetime',
                Cell: ({ cell }) => new Date(cell.getValue())?.toLocaleString('en-US'), //render Date as a string
                    //Custom Date Picker Filter from @mui/x-date-pickers
                Filter: ({ column }) => (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <div style={{color:'grey'}}>Less than or equal to</div>
                        <DatePicker
                          onChange={(newValue) => {
                            column.setFilterValue(newValue);
                          }}
                          slotProps={{
                            textField: {
                              sx: { minWidth: '120px' },
                              variant: 'standard',
                            },
                          }}
                          value={column.getFilterValue()}
                        />
                      </LocalizationProvider>
                ),
              },
              {
                accessorKey: 'match_time',
                header: 'Time',
                size: 90
              },
          {
            accessorKey: 'league_name',
            header: 'League Name',
            size: 250
          },
         
          {
            accessorKey: 'team1',
            header: 'Strong Team',
            size: 140
          },
          {
            accessorFn: (row) => parseFloat(row.initial_team1_score),
            accessorKey: 'initial_team1_score',
            filterFn: 'between',
            header: 'Initial Strong Team Score',
            size: 200
          
          },
          {
            accessorKey: 'team2',
            header: 'Weak Team',
            size: 140
          },
         
          {
            accessorFn: (row) => parseFloat(row.initial_team2_score),
            accessorKey: 'initial_team2_score',
            filterFn: 'between',
            header: 'Initial Weak Team Score',
            size: 200
          
          },
          {
            accessorKey: 'home_team',
            header: 'Home Team',
            size: 140
          },
          {
            accessorFn: (row) => parseFloat(row.over_under_score),
            accessorKey: 'over_under_score',
            header: 'Over Ratio',
            size: 90
          }
        ],
        [],
      );
    return(
        <div>
             <MaterialReactTable
        displayColumnDefOptions={{
          'mrt-row-actions': {
            muiTableHeadCellProps: {
              align: 'center',
            },
            size: 120,
          },
        }}
        columns={columns}
        data={tableData}
        editingMode="modal" //default
        enableColumnOrdering
        enableEditing
        // onEditingRowSave={handleSaveRowEdits}
        // onEditingRowCancel={handleCancelRowEdits}
        renderRowActions={({ row}) => (
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Tooltip arrow placement="left" title="bet">
              <IconButton onClick={() => {
                  const rowData = row._valuesCache;
                  setEditModalOpen(true);
                  setTitle('Betting');
                  setRowEdit(rowData)
                }} style={{fontSize:'18px', color: 'blue'}}>
                Bet
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Delete">
              <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        // renderTopToolbarCustomActions={() => (
        //   <Button
        //     color="primary"
        //     onClick={() => {
        //       setCreateModalOpen(true)
        //       setTitle('Add new Income')
        //     }}
        //     variant="contained"
        //   >
        //     Add a new Income
        //   </Button>
        // )}
      />
      {
        editModalOpen===true ?  <EditAccountModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={title}
        rowEdit={rowEdit}
        token={token}
        setReload={setReload}
      /> : null
      }
        </div>
    )
}

export const EditAccountModal = ({ open, onClose, title, rowEdit,token,setReload}) => {
  const [match,setMatch] = useState({});
  const [teamBet, setTeamBet] = useState('strong');
  const [betAmountTeam, setBetAmountTeam] = useState(0);
  const [reasonTeam, setReasonTeam] = useState('');

  const [reasonTeamBetPick,setReasonTeamBetPick] = useState([]);
  const [reasonTeamBet, setReasonTeamBet] = useState([]);
  const [reason1,setReason1] = useState('');
  const [expert,setExpert] = useState('');

  const [teamBetOver, setTeamBetOver] = useState('over');
  const [betAmountTeamOver, setBetAmountTeamOver] = useState(0);
  const [reasonTeamOver, setReasonTeamOver] = useState('');

  const [reasonTeamBetPickOver,setReasonTeamBetPickOver] = useState([]);
  const [reason1Over,setReason1Over] = useState('');
  const [expertOver,setExpertOver] = useState('');

  const [teamBetRatio, setTeamBetRatio] = useState('strong win');
  const [betAmountTeamRatio, setBetAmountTeamRatio] = useState(0);
  const [reasonTeamRatio, setReasonTeamRatio] = useState('');

  const [reasonTeamBetPickRatio,setReasonTeamBetPickRatio] = useState([]);
  const [reason1Ratio,setReason1Ratio] = useState('');
  const [expertRatio,setExpertRatio] = useState('');

  const [confidentTeam, setConfidentTeam] = useState('Moderate');
  const [confidentTeamOver, setConfidentTeamOver] = useState('Moderate');
  const [confidentTeamRatio, setConfidentTeamRatio] = useState('Moderate');

  const [expertChooseTeam, setExpertChooseTeam] = useState('strong');
  const [expertChooseTeamOver, setExpertChooseTeamOver] = useState('over');
  const [expertChooseTeamRatio, setExpertChooseTeamRatio] = useState('strong win');

  const [soccerAnalystTeam,setSoccerAnalystTeam] = useState(false);
  const [soccerAnalystOver,setSoccerAnalystOver] = useState(false);
  const [soccerAnalystRatio,setSoccerAnalystRatio] = useState(false);



  useEffect(() => {
    const fetchData = async () => {
        const {match_date,team1,team2} = rowEdit;
        try {
            const response = await axios.get(`${apiDomain}/soccer/getonematch`, {
                params: {
                    match_date,
                    team1,
                    team2
                },
                headers: {
                   'x-auth-token': token
                }
            });
            setMatch(response.data.match);

        const response1 = await axios.get(`${apiDomain}/soccer/getreason`, {
              headers: {
                 'x-auth-token': token
              }
          });
          setReasonTeamBet(response1.data.reasonBet);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    fetchData();
}, [token]);



const handleAdd = () => {
  if(reason1.length === 0) return;
  let value = reason1.trim().toLowerCase();
  let check = false;
  for(let i = 0; i< reasonTeamBetPick.length; i++){
      if(reasonTeamBetPick[i].toLowerCase() === value){
          check = true;
          break;
      }
  }
  if(check === false){
      let list = [...reasonTeamBetPick, value];
      setReasonTeamBetPick(list);
      setReason1('')
  }else{
      setReason1('');
  }
}

const handleAddOver = () => {
  if(reason1Over.length === 0) return;
  let value = reason1Over.trim().toLowerCase();
  let check = false;
  for(let i = 0; i< reasonTeamBetPickOver.length; i++){
      if(reasonTeamBetPickOver[i].toLowerCase() === value){
          check = true;
          break;
      }
  }
  if(check === false){
      let list = [...reasonTeamBetPickOver, value];
      setReasonTeamBetPickOver(list);
      setReason1Over('')
  }else{
      setReason1Over('');
  }
}

const handleAddRatio = () => {
  if(reason1Ratio.length === 0) return;
  let value = reason1Ratio.trim().toLowerCase();
  let check = false;
  for(let i = 0; i< reasonTeamBetPickRatio.length; i++){
      if(reasonTeamBetPickRatio[i].toLowerCase() === value){
          check = true;
          break;
      }
  }
  if(check === false){
      let list = [...reasonTeamBetPickRatio, value];
      setReasonTeamBetPickRatio(list);
      setReason1Ratio('')
  }else{
      setReason1Ratio('');
  }
}


const removeJob = (index) => {
  const newReason = [...reasonTeamBetPick];
  newReason.splice(index, 1);
  setReasonTeamBetPick(newReason);
}

const removeJobOver = (index) => {
  const newReason = [...reasonTeamBetPickOver];
  newReason.splice(index, 1);
  setReasonTeamBetPickOver(newReason);
}

const removeJobRatio = (index) => {
  const newReason = [...reasonTeamBetPickRatio];
  newReason.splice(index, 1);
  setReasonTeamBetPickRatio(newReason);
}

  const handleSubmit = () => {
    let reasonNew = [];
    if(reasonTeam.length > 0){
      reasonNew = [...reasonTeamBetPick,reasonTeam]
    }else{
      reasonNew = [...reasonTeamBetPick]
    }
    if (parseFloat(betAmountTeam) <= 0){
      alert('Need to enter a bet amount!');
      return
    }
    const data = {
      team1: match.team1,
      team2: match.team2,
      home_team: match.home_team,
      match_date: match.match_date,
      bettype: 'team',
      betteam: teamBet,
      ratio_win: teamBet === 'strong' ? match.team1_ratio : match.team2_ratio,
      initial_team1_score: match.initial_team1_score,
      initial_team2_score: match.initial_team2_score,
      over_ratio: match.over_under_score,
      league_name: match.league_name,
      amount: betAmountTeam,
      expert:expert,
      expert_choose: expertChooseTeam,
      confident_level: confidentTeam,
      reason_bet: reasonNew.join(';')
    }


    const config = {
      headers: {
        'x-auth-token': token
      }
    };
    axios.post(`${apiDomain}/soccer/betting`,data, config)
                .then(response => {
                   setReasonTeamBetPick([]);
                   setBetAmountTeam(0);
                   setReason1('');
                   setReasonTeam('');
                   setExpert('');
                   alert('Submit your bet successfully!');
                })
    .catch(error => {
           alert('Server error!')
     });
    // onClose();
  };

  const handleSubmitOver = () => {
    let reasonNew = [];
    if(reasonTeamOver.length > 0){
      reasonNew = [...reasonTeamBetPickOver,reasonTeamOver]
    }else{
      reasonNew = [...reasonTeamBetPickOver]
    }
    if (parseFloat(betAmountTeamOver) <= 0){
      alert('Need to enter a bet amount!');
      return
    }
    const data = {
      team1: match.team1,
      team2: match.team2,
      home_team: match.home_team,
      match_date: match.match_date,
      bettype: 'over',
      betteam: teamBetOver,
      ratio_win: teamBetOver === 'over' ? match.over_ratio : match.under_ratio,
      initial_team1_score: match.initial_team1_score,
      initial_team2_score: match.initial_team2_score,
      over_ratio: match.over_under_score,
      league_name: match.league_name,
      amount: betAmountTeamOver,
      expert: expertOver,
      expert_choose: expertChooseTeamOver,
      confident_level: confidentTeamOver,
      reason_bet: reasonNew.join(';')
    }


    const config = {
      headers: {
        'x-auth-token': token
      }
    };
    axios.post(`${apiDomain}/soccer/betting`,data, config)
                .then(response => {
                   setReasonTeamBetPickOver([]);
                   setBetAmountTeamOver(0);
                   setReason1Over('');
                   setReasonTeamOver('');
                   setExpertOver('');
                   alert('Submit your bet successfully!');
                })
    .catch(error => {
           alert('Server error!')
     });
    // onClose();
  };


  ///
  const handleSubmitRatio = () => {
    let reasonNew = [];
    if(reasonTeamRatio.length > 0){
      reasonNew = [...reasonTeamBetPickRatio,reasonTeamRatio]
    }else{
      reasonNew = [...reasonTeamBetPickRatio]
    }
    if (parseFloat(betAmountTeamRatio) <= 0){
      alert('Need to enter a bet amount!');
      return
    }
    const data = {
      team1: match.team1,
      team2: match.team2,
      home_team: match.home_team,
      match_date: match.match_date,
      bettype: 'ratio',
      betteam: teamBetRatio,
      ratio_win: teamBetRatio === 'strong win' ? parseFloat(match.team1_win) - 1 : teamBetRatio === 'weak win' ? parseFloat(match.team2_win) - 1 : parseFloat(match.team_even) - 1,
      initial_team1_score: match.initial_team1_score,
      initial_team2_score: match.initial_team2_score,
      over_ratio: match.over_under_score,
      league_name: match.league_name,
      amount: betAmountTeamRatio,
      expert:expertRatio,
      expert_choose: expertChooseTeamRatio,
      confident_level: confidentTeamRatio,
      reason_bet: reasonNew.join(';')
    }


    const config = {
      headers: {
        'x-auth-token': token
      }
    };
    axios.post(`${apiDomain}/soccer/betting`,data, config)
                .then(response => {
                   setReasonTeamBetPickRatio([]);
                   setBetAmountTeamRatio(0);
                   setReason1Ratio('');
                   setReasonTeamRatio('');
                   setExpertRatio('');
                   alert('Submit your bet successfully!');
                })
    .catch(error => {
           alert('Server error!')
     });
    // onClose();
  };

  return (
    <Dialog open={open} maxWidth='xl'>
      <DialogTitle textAlign="center" style={{color:'#C265A6', fontWeight:'bolder'}}>{match.league_name}</DialogTitle>
      <DialogContent style={{padding:'10px 40px', display:'flex', flexDirection:'column',gap: '20px'}}>
        <div className='teambet'>
        <div style={{display:'flex', padding:'20px', alignItems:'center',gap:'10px',borderBottom:'1px solid grey'}}>
          <div style={{fontSize:'20px', fontWeight:'bolder'}}>Team betting</div>
          <div>-</div>
          <div style={{color:'blue',textDecoration:'underline',cursor:'pointer'}} onClick={()=> {setSoccerAnalystTeam(!soccerAnalystTeam)}}>{soccerAnalystTeam ? 'Close Analyst' : 'Do Analyst'}</div>
        </div>
        {
          soccerAnalystTeam ? <SoccerAnalyst token={token} type={'team'} data={{
            league_name: [match.league_name],
            initial_team1_score: match.initial_team1_score,
            team1_ratio: match.team1_ratio,
            team2_ratio: match.team2_ratio,
            over_under_score: match.over_under_score,
            team1: match.team1,
            team2: match.team2,
            home_team: match.home_team,
            over_ratio: match.over_ratio,
            under_ratio: match.under_ratio,
            team1_win_ratio: match.team1_win,
            team2_win_ratio: match.team2_win,
            team_even: match.team_even
          }}/> : null
        }
        <Table sx={{ minWidth: 1000 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left" style={{fontWeight:'bolder'}}>Strong Team</TableCell>
            <TableCell align="left" style={{fontWeight:'bolder'}}>Initial score</TableCell>
            <TableCell align="left" style={{fontWeight:'bolder'}}>Weak team</TableCell>
            <TableCell align="left" style={{fontWeight:'bolder'}}>Initial score</TableCell>
            <TableCell align="left" style={{fontWeight:'bolder'}}>Home Team</TableCell>
            <TableCell align="left" style={{fontWeight:'bolder'}}>Ratio strong team</TableCell>
            <TableCell align="left" style={{fontWeight:'bolder'}}>Ratio weak team</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
         
            <TableRow
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {match.team1}
              </TableCell>
              <TableCell align="left">{match.initial_team1_score}</TableCell>
              <TableCell align="left">{match.team2}</TableCell>
              <TableCell align="left">{match.initial_team2_score}</TableCell>
              <TableCell align="left">{match.home_team}</TableCell>
              <TableCell align="left">{match.team1_ratio}</TableCell>
              <TableCell align="left">{match.team2_ratio}</TableCell>

            </TableRow>

        </TableBody>
      </Table>
      <div style={{borderBottom:'1px solid grey', borderTop:'1px solid grey', padding:'20px',margin:'20px 0'}}>
              <div style={{margin: '10px 0', fontSize:'20px', fontWeight:'bolder'}}>Pick Team</div>

               <div >
                    <label>
                        <input
                            type="radio"
                            name="teamStrength"
                            value='strong'
                            checked={teamBet === 'strong'}
                            onChange={(e) => setTeamBet(e.target.value)}
                        />
                        Strong Team
                    </label>
                    <label style={{ marginLeft: '10px' }}>
                        <input
                            type="radio"
                            name="teamStrength"
                            value='weak'
                            checked={teamBet === 'weak'}
                            onChange={(e) => setTeamBet(e.target.value)}
                        />
                        Weak Team
                    </label>
                </div>
                <div style={{margin: '10px 0', fontSize:'20px', fontWeight:'bolder'}}>Level of Confident</div>
                <div  style={{margin: '10px 0'}}>
                          <label >
                              <input
                                  type="radio"
                                  name="teamStrengthConfident"
                                  value='Strong'
                                  checked={confidentTeam === 'Strong'}
                                  onChange={(e) => setConfidentTeam(e.target.value)}
                              />
                              Strong
                          </label>
                          <label style={{ marginLeft: '10px' }}>
                              <input
                                  type="radio"
                                  name="teamStrengthConfident"
                                  value='Moderate'
                                  checked={confidentTeam === 'Moderate'}
                                  onChange={(e) => setConfidentTeam(e.target.value)}
                              />
                             Moderate
                          </label>
                          <label style={{ marginLeft: '10px' }}>
                              <input
                                  type="radio"
                                  name="teamStrengthConfident"
                                  value='Weak'
                                  checked={confidentTeam === 'Weak'}
                                  onChange={(e) => setConfidentTeam(e.target.value)}
                              />
                              Weak
                          </label>
                </div>
                <div style={{ marginTop: '10px' }}>
                    <label>
                        Bet Amount: 
                        <span style={{ marginLeft: '5px', marginRight: '5px' }}>$</span>
                        <input
                            type="number"
                            value={betAmountTeam}
                            onChange={(e) => setBetAmountTeam(e.target.value)}
                            step="0.01"
                            min="0"
                            style={{ width: '100px' }}
                        />
                    </label>
                </div>
                <div className="jobs1">
                    <div className='field_header'>
                        <div>Reason to bet?</div>
                        {reasonTeamBetPick.length === 0 ? <ErrorIconWithTooltip errorMessage="Plesae select your reason to bet"/> : null}
                    </div>
                    <div className="skill_contain2">
                        <SearchInput handleSet={setReason1} lists={reasonTeamBet} inputValue={reason1} />
                        {/* <img src={add} alt="add" height='50px' width='50px' style={{
                            cursor:"pointer"
                        }}
                            onClick={()=> {
                                handleAdd();
                            }}
                        /> */}
                         <Fab color="primary" aria-label="add"  onClick={()=> {
                                handleAdd();
                            }} size='small'>
                            <AddIcon />
                        </Fab>
                    </div>
                    <div className={reasonTeamBetPick.length !==0 ? "job_display1" : null}>
                        {
                            reasonTeamBetPick.length !==0 ? reasonTeamBetPick.map((reason,index) => (
                                <div key={index} className="job_item">
                                    <div style={{
                                        padding:"8px",
                                        borderRadius:9,
                                        color:"white",
                                        backgroundColor:"#0A65C2"
                                    }}>{reason}</div>
                                    <img src={close} alt="add" height='30px' width='30px' style={{
                                        cursor:"pointer",
                                        marginLeft:'5px'
                                    }}
                                    onClick={()=> {
                                        removeJob(index);
                                    }}
                                    />
                                </div>
                            )) : null
                        }
                    </div>
                </div>
                <div style={{ marginTop: '10px' }}>
                    <label>
                        Additonal Reason:
                        <textarea
                            value={reasonTeam}
                            onChange={(e) => setReasonTeam(e.target.value)}
                            rows="4"
                            cols="50"
                            style={{ display: 'block', marginTop: '5px' }}
                        />
                    </label>
                </div>

                <div style={{ marginTop: '10px' }}>
                    <label>
                        Expert suggestion:
                        <textarea
                            value={expert}
                            onChange={(e) => setExpert(e.target.value)}
                            rows="4"
                            cols="50"
                            style={{ display: 'block', marginTop: '5px' }}

                        />
                  <div  style={{margin: '10px 0'}}>
                          <label >
                              <input
                                  type="radio"
                                  name="teamStrengthChoose"
                                  value='strong'
                                  checked={expertChooseTeam === 'strong'}
                                  onChange={(e) => setExpertChooseTeam(e.target.value)}
                              />
                              Strong Team
                          </label>
                          <label style={{ marginLeft: '10px' }}>
                              <input
                                  type="radio"
                                  name="teamStrengthChoose"
                                  value='weak'
                                  checked={expertChooseTeam === 'weak'}
                                  onChange={(e) => setExpertChooseTeam(e.target.value)}
                              />
                              Weak Team
                          </label>
                </div>
                    </label>
                </div>
                <Button variant="contained" style={{margin:'10px'}} onClick={handleSubmit}>Bet</Button>
      </div>
    
      </div>

      {/* //// */}
      <div className='teambet'>
        <div style={{display:'flex', padding:'20px', alignItems:'center',gap:'10px',borderBottom:'1px solid grey'}}>
          <div style={{fontSize:'20px', fontWeight:'bolder'}}>Over/Under betting</div>
          <div>-</div>
          <div style={{color:'blue',textDecoration:'underline',cursor:'pointer'}}>Do analyst</div>
        </div>
        <Table sx={{ minWidth: 1000 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left" style={{fontWeight:'bolder'}}>Strong Team</TableCell>
            <TableCell align="left" style={{fontWeight:'bolder'}}>Initial score</TableCell>
            <TableCell align="left" style={{fontWeight:'bolder'}}>Weak team</TableCell>
            <TableCell align="left" style={{fontWeight:'bolder'}}>Initial score</TableCell>
            <TableCell align="left" style={{fontWeight:'bolder'}}>Home Team</TableCell>
            <TableCell align="left" style={{fontWeight:'bolder'}}>Over/Under score</TableCell>
            <TableCell align="left" style={{fontWeight:'bolder'}}>Ratio over win</TableCell>
            <TableCell align="left" style={{fontWeight:'bolder'}}>Ratio under win</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
         
            <TableRow
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {match.team1}
              </TableCell>
              <TableCell align="left">{match.initial_team1_score}</TableCell>
              <TableCell align="left">{match.team2}</TableCell>
              <TableCell align="left">{match.initial_team2_score}</TableCell>
              <TableCell align="left">{match.home_team}</TableCell>

              <TableCell align="left">{match.over_under_score}</TableCell>
              <TableCell align="left">{match.over_ratio}</TableCell>
              <TableCell align="left">{match.under_ratio}</TableCell>


            </TableRow>

        </TableBody>
      </Table>
      <div style={{borderBottom:'1px solid grey', borderTop:'1px solid grey', padding:'20px',margin:'20px 0'}}>
      <div style={{margin: '10px 0', fontSize:'20px', fontWeight:'bolder'}}>Pick Over/Under</div>

                <div >
                  <label>
                        <input
                            type="radio"
                            name="teamOver"
                            value='over'
                            checked={teamBetOver === 'over'}
                            onChange={(e) => setTeamBetOver(e.target.value)}
                        />
                        Over
                    </label>
                    <label style={{ marginLeft: '10px' }}>
                        <input
                            type="radio"
                            name="teamOver"
                            value='under'
                            checked={teamBetOver === 'under'}
                            onChange={(e) => setTeamBetOver(e.target.value)}
                        />
                       Under
                    </label>
                </div>
                <div style={{margin: '10px 0', fontSize:'20px', fontWeight:'bolder'}}>Level of Confident</div>
                <div  style={{margin: '10px 0'}}>
                          <label >
                              <input
                                  type="radio"
                                  name="teamStrengthConfidentOver"
                                  value='Strong'
                                  checked={confidentTeamOver === 'Strong'}
                                  onChange={(e) => setConfidentTeamOver(e.target.value)}
                              />
                              Strong
                          </label>
                          <label style={{ marginLeft: '10px' }}>
                              <input
                                  type="radio"
                                  name="teamStrengthConfidentOver"
                                  value='Moderate'
                                  checked={confidentTeamOver === 'Moderate'}
                                  onChange={(e) => setConfidentTeamOver(e.target.value)}
                              />
                             Moderate
                          </label>
                          <label style={{ marginLeft: '10px' }}>
                              <input
                                  type="radio"
                                  name="teamStrengthConfidentOver"
                                  value='Weak'
                                  checked={confidentTeamOver === 'Weak'}
                                  onChange={(e) => setConfidentTeamOver(e.target.value)}
                              />
                              Weak
                          </label>
                </div>
                <div style={{ marginTop: '10px' }}>
                    <label>
                        Bet Amount: 
                        <span style={{ marginLeft: '5px', marginRight: '5px' }}>$</span>
                        <input
                            type="number"
                            value={betAmountTeamOver}
                            onChange={(e) => setBetAmountTeamOver(e.target.value)}
                            step="0.01"
                            min="0"
                            style={{ width: '100px' }}
                        />
                    </label>
                </div>
                <div className="jobs1">
                    <div className='field_header'>
                        <div>Reason to bet?</div>
                        {reasonTeamBetPickOver.length === 0 ? <ErrorIconWithTooltip errorMessage="Plesae select your reason to bet"/> : null}
                    </div>
                    <div className="skill_contain2">
                        <SearchInput handleSet={setReason1Over} lists={reasonTeamBet} inputValue={reason1Over} />
                        {/* <img src={add} alt="add" height='50px' width='50px' style={{
                            cursor:"pointer"
                        }}
                            onClick={()=> {
                                handleAdd();
                            }}
                        /> */}
                         <Fab color="primary" aria-label="add"  onClick={()=> {
                                handleAddOver();
                            }} size='small'>
                            <AddIcon />
                        </Fab>
                    </div>
                    <div className={reasonTeamBetPickOver.length !==0 ? "job_display1" : null}>
                        {
                            reasonTeamBetPickOver.length !==0 ? reasonTeamBetPickOver.map((reason,index) => (
                                <div key={index} className="job_item">
                                    <div style={{
                                        padding:"8px",
                                        borderRadius:9,
                                        color:"white",
                                        backgroundColor:"#0A65C2"
                                    }}>{reason}</div>
                                    <img src={close} alt="add" height='30px' width='30px' style={{
                                        cursor:"pointer",
                                        marginLeft:'5px'
                                    }}
                                    onClick={()=> {
                                        removeJobOver(index);
                                    }}
                                    />
                                </div>
                            )) : null
                        }
                    </div>
                </div>
                <div style={{ marginTop: '10px' }}>
                    <label>
                        Additonal Reason:
                        <textarea
                            value={reasonTeamOver}
                            onChange={(e) => setReasonTeamOver(e.target.value)}
                            rows="4"
                            cols="50"
                            style={{ display: 'block', marginTop: '5px' }}
                        />
                    </label>
                </div>
                <div style={{ marginTop: '10px' }}>
                    <label>
                        Expert suggestion
                        <textarea
                            value={expertOver}
                            onChange={(e) => setExpertOver(e.target.value)}
                            rows="4"
                            cols="50"
                            style={{ display: 'block', marginTop: '5px' }}
                        />
                 <div style={{ marginTop: '10px' }}>
                  <label>
                        <input
                            type="radio"
                            name="teamOverChoose"
                            value='over'
                            checked={expertChooseTeamOver === 'over'}
                            onChange={(e) => setExpertChooseTeamOver(e.target.value)}
                        />
                        Over
                    </label>
                    <label style={{ marginLeft: '10px' }}>
                        <input
                            type="radio"
                            name="teamOverChoose"
                            value='under'
                            checked={expertChooseTeamOver === 'under'}
                            onChange={(e) => setExpertChooseTeamOver(e.target.value)}
                        />
                       Under
                    </label>
                </div>
                    </label>
                </div>
                <Button variant="contained" style={{margin:'10px'}} onClick={handleSubmitOver}>Bet</Button>
      </div>
    
      </div>

        {/* //// */}
        <div className='teambet'>
        <div style={{display:'flex', padding:'20px', alignItems:'center',gap:'10px',borderBottom:'1px solid grey'}}>
          <div style={{fontSize:'20px', fontWeight:'bolder'}}>Europe Ratio Betting</div>
          <div>-</div>
          <div style={{color:'blue',textDecoration:'underline',cursor:'pointer'}}>Do analyst</div>
        </div>
        <Table sx={{ minWidth: 1000 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left" style={{fontWeight:'bolder'}}>Strong Team</TableCell>
            <TableCell align="left" style={{fontWeight:'bolder'}}>Initial score</TableCell>
            <TableCell align="left" style={{fontWeight:'bolder'}}>Weak team</TableCell>
            <TableCell align="left" style={{fontWeight:'bolder'}}>Initial score</TableCell>
            <TableCell align="left" style={{fontWeight:'bolder'}}>Home Team</TableCell>
            <TableCell align="left" style={{fontWeight:'bolder'}}>Over/Under score</TableCell>
            <TableCell align="left" style={{fontWeight:'bolder'}}>Ratio strong team win</TableCell>
            <TableCell align="left" style={{fontWeight:'bolder'}}>Ratio weak team win </TableCell>
            <TableCell align="left" style={{fontWeight:'bolder'}}>Ratio teams even </TableCell>

          </TableRow>
        </TableHead>
        <TableBody>
         
            <TableRow
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {match.team1}
              </TableCell>
              <TableCell align="left">{match.initial_team1_score}</TableCell>
              <TableCell align="left">{match.team2}</TableCell>
              <TableCell align="left">{match.initial_team2_score}</TableCell>
              <TableCell align="left">{match.home_team}</TableCell>

              <TableCell align="left">{match.over_under_score}</TableCell>
              <TableCell align="left">{parseFloat(match.team1_win) - 1}</TableCell>
              <TableCell align="left">{parseFloat(match.team2_win) - 1}</TableCell>
              <TableCell align="left">{parseFloat(match.team_even) - 1}</TableCell>



            </TableRow>

        </TableBody>
      </Table>
      <div style={{borderBottom:'1px solid grey', borderTop:'1px solid grey', padding:'20px',margin:'20px 0'}}>
      <div style={{margin: '10px 0', fontSize:'20px', fontWeight:'bolder'}}>Pick Team Win</div>

      <div >
          <label>
                        <input
                            type="radio"
                            name="teamRatio"
                            value='strong win'
                            checked={teamBetRatio === 'strong win'}
                            onChange={(e) => setTeamBetRatio(e.target.value)}
                        />
                        Strong win
                    </label>
                    <label style={{ marginLeft: '10px' }}>
                        <input
                            type="radio"
                            name="teamRatio"
                            value='weak win'
                            checked={teamBetRatio === 'weak win'}
                            onChange={(e) => setTeamBetRatio(e.target.value)}
                        />
                       Weak win
                    </label>
                    <label style={{ marginLeft: '10px' }}>
                        <input
                            type="radio"
                            name="teamRatio"
                            value='even'
                            checked={teamBetRatio === 'even'}
                            onChange={(e) => setTeamBetRatio(e.target.value)}
                        />
                       Teams even
                    </label>
                </div>
                <div style={{margin: '10px 0', fontSize:'20px', fontWeight:'bolder'}}>Level of Confident</div>
                <div  style={{margin: '10px 0'}}>
                          <label >
                              <input
                                  type="radio"
                                  name="teamStrengthConfidentRatio"
                                  value='Strong'
                                  checked={confidentTeamRatio === 'Strong'}
                                  onChange={(e) => setConfidentTeamRatio(e.target.value)}
                              />
                              Strong
                          </label>
                          <label style={{ marginLeft: '10px' }}>
                              <input
                                  type="radio"
                                  name="teamStrengthConfidentRatio"
                                  value='Moderate'
                                  checked={confidentTeamRatio === 'Moderate'}
                                  onChange={(e) => setConfidentTeamRatio(e.target.value)}
                              />
                             Moderate
                          </label>
                          <label style={{ marginLeft: '10px' }}>
                              <input
                                  type="radio"
                                  name="teamStrengthConfidentRatio"
                                  value='Weak'
                                  checked={confidentTeamRatio === 'Weak'}
                                  onChange={(e) => setConfidentTeamRatio(e.target.value)}
                              />
                              Weak
                          </label>
                </div>
                <div style={{ marginTop: '10px' }}>
                    <label>
                        Bet Amount: 
                        <span style={{ marginLeft: '5px', marginRight: '5px' }}>$</span>
                        <input
                            type="number"
                            value={betAmountTeamRatio}
                            onChange={(e) => setBetAmountTeamRatio(e.target.value)}
                            step="0.01"
                            min="0"
                            style={{ width: '100px' }}
                        />
                    </label>
                </div>
                <div className="jobs1">
                    <div className='field_header'>
                        <div>Reason to bet?</div>
                        {reasonTeamBetPickRatio.length === 0 ? <ErrorIconWithTooltip errorMessage="Plesae select your reason to bet"/> : null}
                    </div>
                    <div className="skill_contain2">
                        <SearchInput handleSet={setReason1Ratio} lists={reasonTeamBet} inputValue={reason1Ratio} />
                        {/* <img src={add} alt="add" height='50px' width='50px' style={{
                            cursor:"pointer"
                        }}
                            onClick={()=> {
                                handleAdd();
                            }}
                        /> */}
                         <Fab color="primary" aria-label="add"  onClick={()=> {
                                handleAddRatio();
                            }} size='small'>
                            <AddIcon />
                        </Fab>
                    </div>
                    <div className={reasonTeamBetPickRatio.length !==0 ? "job_display1" : null}>
                        {
                            reasonTeamBetPickRatio.length !==0 ? reasonTeamBetPickRatio.map((reason,index) => (
                                <div key={index} className="job_item">
                                    <div style={{
                                        padding:"8px",
                                        borderRadius:9,
                                        color:"white",
                                        backgroundColor:"#0A65C2"
                                    }}>{reason}</div>
                                    <img src={close} alt="add" height='30px' width='30px' style={{
                                        cursor:"pointer",
                                        marginLeft:'5px'
                                    }}
                                    onClick={()=> {
                                        removeJobRatio(index);
                                    }}
                                    />
                                </div>
                            )) : null
                        }
                    </div>
                </div>
                <div style={{ marginTop: '10px' }}>
                    <label>
                        Additonal Reason:
                        <textarea
                            value={reasonTeamRatio}
                            onChange={(e) => setReasonTeamRatio(e.target.value)}
                            rows="4"
                            cols="50"
                            style={{ display: 'block', marginTop: '5px' }}
                        />
                    </label>
                </div>
                <div style={{ marginTop: '10px' }}>
                    <label>
                        Expert suggestion
                        <textarea
                            value={expertRatio}
                            onChange={(e) => setExpertRatio(e.target.value)}
                            rows="4"
                            cols="50"
                            style={{ display: 'block', marginTop: '5px' }}
                        />
                 <div >
                  <label>
                        <input
                            type="radio"
                            name="teamRatioChoose"
                            value='strong win'
                            checked={expertChooseTeamRatio === 'strong win'}
                            onChange={(e) => setExpertChooseTeamRatio(e.target.value)}
                        />
                        Strong win
                    </label>
                    <label style={{ marginLeft: '10px' }}>
                        <input
                            type="radio"
                            name="teamRatioChoose"
                            value='weak win'
                            checked={expertChooseTeamRatio === 'weak win'}
                            onChange={(e) => setExpertChooseTeamRatio(e.target.value)}
                        />
                       Weak win
                    </label>
                    <label style={{ marginLeft: '10px' }}>
                        <input
                            type="radio"
                            name="teamRatioChoose"
                            value='even'
                            checked={expertChooseTeamRatio === 'even'}
                            onChange={(e) => setExpertChooseTeamRatio(e.target.value)}
                        />
                       Teams even
                    </label>
                </div>
                    </label>
                </div>
                <Button variant="contained" style={{margin:'10px'}} onClick={handleSubmitRatio}>Bet</Button>
      </div>
    
      </div>
      </DialogContent>
      <DialogActions sx={{ p: '1.25rem' }}>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};
////////

export default SoccerBet;