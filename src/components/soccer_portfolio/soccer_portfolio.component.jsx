import React, { useCallback, useMemo, useState,useEffect  } from 'react';
import { MaterialReactTable } from 'material-react-table';
import {apiDomain} from '../../services/config';
import axios from 'axios';
import './soccer_portfolio.styles.css';
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

const SoccerPortfolio = ({token}) => {
    const [tableData, setTableData] = useState([]);
    const [rowEdit,setRowEdit] = useState([]);
    const [title,setTitle] = useState('');
    const [editModalOpen,setEditModalOpen] = useState(false);
    const [reload,setReload] =useState(false);
    const [results,setResults] = useState({
        balance: 0,
        total_completed: 0,
        total_win: 0,
        total_loss: 0,
        total_even: 0,
        total_pending: 0,
        recent_result: []

    })
    const [balance,setBalance] = useState(0)
    useEffect(()=> {
        if(token !== null){
          const config = {
            headers: {
              'x-auth-token': token
            }
          };
          axios.get(`${apiDomain}/soccer/getbalance`, config)
                      .then(response => {
                        setResults({
                            balance: response.data.results.balance,
                            total_completed: response.data.results.total_completed,
                            total_win: response.data.results.total_win,
                            total_loss: response.data.results.total_loss,
                            total_even: response.data.results.total_even,
                            total_pending: response.data.results.total_pending,
                            recent_result: response.data.results.recent_result
                        })
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
          axios.post(`${apiDomain}/soccer/deletebetting`,{
            betting_id: row.getValue('betting_id')
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

      useEffect(()=> {
        if(token !== null){
          const config = {
            headers: {
              'x-auth-token': token
            }
          };
          axios.get(`${apiDomain}/soccer/getbetting`, config)
                      .then(response => {
                         setTableData(response.data.betting)
                      })
            .catch(error => {
                 console.log(error)
           });
        }else{
           
        }
        
      },[token,reload])

      const columns = useMemo(
        () => [
            {
                accessorKey: 'betting_id',
                header: 'ID',
                size: 90
              },
              {
                accessorKey: 'league_name',
                header: 'League Name',
                size: 250
              },
              {
                accessorKey: 'result',
                header: 'Result',
                size: 250
              },
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
                accessorFn: (row) => new Date(row.match_date),
                accessorKey: 'bet_time',
                header: 'Betting time',
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
                accessorKey: 'status',
                header: 'Status',
                size: 140
              },
              {
                accessorFn: (row) => parseFloat(row.amount),
                accessorKey: 'amount',
                filterFn: 'between',
                header: 'Bet amoun',
                size: 200
              
              },
          {
            accessorKey: 'team1',
            header: 'Strong Team',
            size: 140
          },
          {
            accessorKey: 'team2',
            header: 'Weak Team',
            size: 140
          },
          {
            accessorFn: (row) => parseFloat(row.over_ratio),
            accessorKey: 'over_ratio',
            header: 'Over/Under score',
            size: 90
          },
          {
            accessorFn: (row) => parseFloat(row.initial_team1_score),
            accessorKey: 'initial_team1_score',
            filterFn: 'between',
            header: 'Initial Strong Team Score',
            size: 200
          
          },
          {
            accessorFn: (row) => parseFloat(row.initial_team2_score),
            accessorKey: 'initial_team2_score',
            filterFn: 'between',
            header: 'Initial Weak Team Score',
            size: 200
          
          },
          {
            accessorFn: (row) => parseFloat(row.final_team1_score),
            accessorKey: 'final_team1_score',
            filterFn: 'between',
            header: 'Final Strong Team Score',
            size: 200
          
          },
          {
            accessorFn: (row) => parseFloat(row.final_team2_score),
            accessorKey: 'final_team2_score',
            filterFn: 'between',
            header: 'Final Weak Team Score',
            size: 200
          
          },
          {
            accessorKey: 'home_team',
            header: 'Home Team',
            size: 140
          },
         
          {
            accessorKey: 'betteam',
            header: 'Bet Type',
            size: 140
          },
          {
            accessorFn: (row) => row.reason_win_loss === null ? 0 : 1,
            accessorKey: 'reason_win_loss',
            header: 'Reason Win/Loss',
            size: 140
          }

        ],
        [],
      );
    return(
        <div style={{display:'flex', flexDirection:'column'}}>
            <div style={{padding: '30px 0 12px 0', fontSize:'24px', fontWeight:'bolder'}}>Balance</div>
            <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}><span style={{fontSize:'24px', paddingRight:'5px'}}>$</span> <span style={{color: parseFloat(results.balance) >= 0 ? 'green' : 'red', fontSize:'35px', fontWeight:'bolder'}}>{results.balance.toFixed(2)}</span></div>
            <div style={{display:'flex',alignItems:'center', justifyContent:'center', flexDirection:'column'}}>
                    <div>
                    <div className='stock_detail1'>
                            <div className="data-key1">Total completed bettings: </div>
                            <div className="data-value1">{results.total_completed}</div>
                    </div>
                    <div className='stock_detail1'>
                            <div className="data-key1">Total win bettings: </div>
                            <div className="data-value1">{results.total_win}</div>
                    </div>
                    <div className='stock_detail1'>
                            <div className="data-key1">Total loss bettings: </div>
                            <div className="data-value1">{results.total_loss}</div>
                    </div>
                    <div className='stock_detail1'>
                            <div className="data-key1">Total even bettings: </div>
                            <div className="data-value1">{results.total_even}</div>
                    </div>
                    <div className='stock_detail1'>
                            <div className="data-key1">Total in process bettings: </div>
                            <div className="data-value1">{results.total_pending}</div>
                    </div>
                    <div className='stock_detail1'>
                            <div className="data-key1">Recent beeting result: </div>
                            <div className="data-value1">
                                {
                                    results.recent_result.map((item,index) =>(
                                        <span key={index} style={{
                                            padding: '0 5px',
                                            color: item.recent_result === 'win' ? 'green' : item.recent_result === 'loss' ? 'red' : 'black',
                                            fontWeight:'bolder'
                                        }}>{item.recent_result}</span>
                                    ))
                                }
                            </div>
                    </div>
                    </div>
            </div>
            <div style={{display:'flex', flexDirection:'column',justifyContent:'center', margin:'30px 10px'}}>
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
        renderRowActions={({ row}) => (
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Tooltip arrow placement="left" title="Update">
              <IconButton onClick={() => {
                  const rowData = row._valuesCache;
                  setEditModalOpen(true);
                  setTitle('Betting');
                  setRowEdit(rowData)
                }} style={{fontSize:'18px', color: 'blue'}}>
                Detail
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Delete">
              <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                <Delete />
              </IconButton>
            </Tooltip>
            <div style={{padding:'9px', color:'orange'}}>{row._valuesCache.reason_win_loss === 0 &&  row._valuesCache.status === 'completed' ? 'Missed' : null}</div>
          </Box>
        )}
      />
                </div>
            </div>
            {
        editModalOpen===true ?  <EditAccountModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={title}
        rowEdit={rowEdit}
        token={token}
        setReload={setReload}
        reload={reload}
      /> : null
      }
        </div>
    )
}


////
export const EditAccountModal = ({ open, onClose, title, rowEdit,token,setReload,reload}) => {
    const [betMatch,setBetMatch] = useState({});
    const [reasonAddition, setReasonAddition] = useState('');
    const [reasonTeamBetPick,setReasonTeamBetPick] = useState([]);
    const [reasonTeamBet, setReasonTeamBet] = useState([]);
    const [reason1,setReason1] = useState('');
    const [reasonToBet,setReasonToBet] = useState('');
    const [reasonToLoss,setReasonToLoss] = useState('');
    const [expert,setExpert] = useState('');

    useEffect(() => {
      const fetchData = async () => {
          const {result,betting_id} = rowEdit;
          try {
            const response = await axios.get(`${apiDomain}/soccer/getonebetmatch`, {
                params: {
                    betting_id
                },
                headers: {
                   'x-auth-token': token
                }
            });
          setBetMatch(response.data.match);
          // console.log(response.data.match)
          setReasonToBet(response.data.match.reason_bet)
          setReasonToLoss(response.data.match.reason_win_loss)
          setExpert(response.data.match.expert_predict === null ? '' : response.data.match.expert_predict)
          const response1 = await axios.get(`${apiDomain}/soccer/getreasonbet`, {
                params: {
                    result: result
                },
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
  }, [token,reload]);
  
  
  
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
  
  const removeJob = (index) => {
    const newReason = [...reasonTeamBetPick];
    newReason.splice(index, 1);
    setReasonTeamBetPick(newReason);
  }
  
    const handleSubmit = () => {
      let reasonNew = [];
      if(reasonAddition.length > 0){
        reasonNew = [...reasonTeamBetPick,reasonAddition]
      }else{
        reasonNew = [...reasonTeamBetPick]
      }
      if (reasonNew.length <= 0){
        alert('Need to enter a reason!');
        return
      }
      const data = {
        betting_id: rowEdit.betting_id,
        reason_bet: reasonNew.join(';')
      }
  
  
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      axios.post(`${apiDomain}/soccer/betting_reason`,data, config)
                  .then(response => {
                     setReasonTeamBetPick([]);
                     setReason1('');
                     setReasonAddition('');
                     alert('Update your reason successfully!');
                     setReload((reload)=> !reload);
                  })
      .catch(error => {
             alert('Server error!')
       });
      // onClose();
    };
  
    return (
      <Dialog open={open} maxWidth='xl'>
        <DialogTitle textAlign="center" style={{color:'#C265A6', fontWeight:'bolder'}}>{betMatch.team1} vs {betMatch.team2}</DialogTitle>
        <DialogContent style={{padding:'10px 40px', display:'flex', flexDirection:'column',gap: '20px'}}>
          <div className='teambet'  style={{overflowX:'scroll'}}>
          <Table sx={{ minWidth: 2000 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left" style={{fontWeight:'bolder'}}>Bet Time</TableCell>

              <TableCell align="left" style={{fontWeight:'bolder'}}>Result</TableCell>
              <TableCell align="left" style={{fontWeight:'bolder'}}>Percent Win/Loss</TableCell>
              <TableCell align="left" style={{fontWeight:'bolder'}}>Amount</TableCell>
              <TableCell align="left" style={{fontWeight:'bolder'}}>Bet Type</TableCell>
              <TableCell align="left" style={{fontWeight:'bolder'}}>Status</TableCell>

              <TableCell align="left" style={{fontWeight:'bolder'}}>Strong Team</TableCell>
              <TableCell align="left" style={{fontWeight:'bolder'}}>Weak team</TableCell>

              <TableCell align="left" style={{fontWeight:'bolder'}}>Initial strong score</TableCell>
              <TableCell align="left" style={{fontWeight:'bolder'}}>Initial weak score</TableCell>
              <TableCell align="left" style={{fontWeight:'bolder'}}>Final strong score</TableCell>
              <TableCell align="left" style={{fontWeight:'bolder'}}>Final weak score</TableCell>
              <TableCell align="left" style={{fontWeight:'bolder'}}>Over/Under score</TableCell>

              <TableCell align="left" style={{fontWeight:'bolder'}}>Home Team</TableCell>
              <TableCell align="left" style={{fontWeight:'bolder'}}>Ratio win</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
           
              <TableRow
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {betMatch.bet_time}
                </TableCell>
                <TableCell align="left">{betMatch.result}</TableCell>
                <TableCell align="left">{betMatch.win_loss_percent ? betMatch.win_loss_percent.toLowerCase() : betMatch.win_loss_percent}</TableCell>
                <TableCell align="left">{betMatch.amount}</TableCell>
                <TableCell align="left">{betMatch.betteam}</TableCell>
                <TableCell align="left">{betMatch.status}</TableCell>
                <TableCell align="left">{betMatch.team1}</TableCell>
                <TableCell align="left">{betMatch.team2}</TableCell>
                <TableCell align="left">{betMatch.initial_team1_score}</TableCell>
                <TableCell align="left">{betMatch.initial_team2_score}</TableCell>
                <TableCell align="left">{betMatch.final_team1_score}</TableCell>
                <TableCell align="left">{betMatch.final_team2_score}</TableCell>
                <TableCell align="left">{betMatch.over_ratio}</TableCell>
                <TableCell align="left">{betMatch.home_team}</TableCell>
                <TableCell align="left">{betMatch.ratio_win}</TableCell>
  
              </TableRow>
  
          </TableBody>
        </Table>
        <div style={{borderBottom:'1px solid grey', borderTop:'1px solid grey', padding:'20px',margin:'20px 0'}}>
              {expert.length > 0 ?
               <div style={{ marginTop: '10px' }}>
                          <label>
                              Expert suggestion:
                              <textarea
                                  value={expert}
                                  onChange={(e) => setExpert(e.target.value)}
                                  rows="4"
                                  cols="100"
                                  style={{ display: 'block', marginTop: '5px' }}
                                  disabled={true}
                              />
                          </label>
                          <div style={{margin: '10px 0'}}>
                              Expert pick:
                              <span style={{padding:'0 10px', fontWeight:'bolder'}}>{betMatch.expert_chose ? betMatch.expert_chose.toUpperCase() : null}</span>
                          </div>
                </div> : null }
                
                <div style={{margin: '20px 0'}}>
                    <div  style={{margin: '30px 0', fontSize:'30px', textDecoration:'underline'}}>Personal Thoughts</div>
                    <label>Confident level bettings: 
                      <span style={{padding:'0 10px', fontWeight:'bolder'}}>{betMatch.confident_level ? betMatch.confident_level.toUpperCase() :  null}</span>
                    </label>
                    <h3>Reasons to bet</h3>
                    <ul>
                        {reasonToBet.split(';').map((reason, index) => (
                        <li key={index}>{index + 1}. {reason}</li>
                        ))}
                    </ul>
                </div>
                {
                    reasonToLoss === null ?
                
                  <div className="jobs1">
                      <div className='field_header'>
                          <div>Reason to {betMatch.result}</div>
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
                      <div style={{ marginTop: '10px' }}>
                      <label>
                          Additonal reasons to {betMatch.result}:
                          <textarea
                              value={reasonAddition}
                              onChange={(e) => setReasonAddition(e.target.value)}
                              rows="4"
                              cols="50"
                              style={{ display: 'block', marginTop: '5px' }}
                          />
                      </label>
                     </div>
                  </div>
                 : <div>
                <h3>Reasons to {betMatch.result}</h3>
                <ul>
                    {reasonToLoss.split(';').map((reason, index) => (
                    <li key={index}>{index + 1}. {reason}</li>
                    ))}
                </ul>
               </div>}
                 <Button variant="contained" style={{margin:'10px'}} onClick={handleSubmit} disabled={reasonToLoss !== null ? true : false}>Save</Button>
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

export default SoccerPortfolio;