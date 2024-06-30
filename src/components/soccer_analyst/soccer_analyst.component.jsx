import React, { useCallback, useMemo, useState,useEffect  } from 'react';
import './soccer_analyst.styles.css';
import {apiDomain} from '../../services/config';
import axios from 'axios';
import LeagueName from '../league_name/league_name.component';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ModeIcon from '@mui/icons-material/Mode';
import { DefaultizedPieValueType } from '@mui/x-charts/models';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { Box, ThemeProvider } from '@mui/material';

import DownloadingIcon from '@mui/icons-material/Downloading';
const SoccerAnalyst = ({token,type,data}) => {

    const [teamChart,setTeamChart] = useState([]);
    const [overChart,setOverChart] = useState([]);
    const [ratioChart,setRatioChart] = useState([]);
    const [totalTeam,setTotalTeam] = useState(0);
    const [totalOver,setTotalOver] = useState(0);
    const [totalRatio,setTotalRatio] = useState(0);

    ///
    const [hisTeam1,setHisTeam1] = useState([]);
    const [hisTeam2,setHisTeam2] = useState([]);

    ///

    const [leagueName,setLeagueName] = useState([]);
    const [checkedItems, setCheckedItems] = useState(new Set(data.league_name));
    const [isAllLeagueChecked, setIsAllLeagueChecked] = useState(false);


    const [scrollScoreTeamStrong, setScrollScoreTeamStrong] = useState(Math.abs(data.initial_team1_score));
    const [scorecheck,setScoreCheck] = useState(false);

    const [scrollOver, setScrollOver] = useState(Math.abs(data.over_under_score));
    const [overSign,setOverSign] = useState('=');
    const [overcheck,setOverCheck] = useState(false);

    const [scrollRatioTeam1, setScrollRatioTeam1] = useState(Math.abs(data.team1_ratio));
    const [scrollRatioTeam2, setScrollRatioTeam2] = useState(Math.abs(data.team2_ratio));
    const [scrollRatioDistance, setScrollRatioDistance] = useState(0);
    const [ratiocheck,setRatioCheck] = useState(false);


    const [homeTeam,setHomeTeam] = useState(data.team1 === data.home_team ? 'Strong team' : 'Weak team');
    const [homecheck,setHomeCheck] = useState(false);

    const [teamName,setTeamName] = useState(data.team1);
    const [teamNameCheck,setTeamNameCheck] = useState(false);

    const [scrollOverWin, setScrollOverWin] = useState(data.over_ratio);
    const [scrollUnderWin, setScrollUnderWin] = useState(data.under_ratio);
    const [scrollOverDistance, setScrollOverDistance] = useState(0);
    const [overUndercheck,setOverUnderCheck] = useState(false);

    const [scrollRatioTeam1Win, setScrollRatioTeam1Win] = useState((parseFloat(data.team1_win_ratio) - 1).toFixed(2));
    const [scrollRatioTeam2Win, setScrollRatioTeam2Win] = useState((parseFloat(data.team2_win_ratio) - 1).toFixed(2));
    const [scrollRatioEvenWin, setScrollRatioEvenWin] = useState((parseFloat(data.team_even) - 1).toFixed(2));
    const [scrollRatioDistanceWin, setScrollRatioDistanceWin] = useState(0);

    const [ratioWinCheck,setRatioWinCheck] = useState(false);

    const [teamDepen,setTeamDepen] = useState([]);
    const [overDepen,setOverDepen] = useState([]);
    const [ratioDepen,setRatioDepen] = useState([]);


    useEffect(()=> {
        if(token !== null){
          const config = {
            headers: {
              'x-auth-token': token
            }
          };
          axios.get(`${apiDomain}/soccer/getleaguename`, config)
                      .then(response => {
                         setLeagueName(response.data.league_name);
                      })
            .catch(error => {
                 console.log(error)
           });
        }else{
           
        }
        
      },[token])

      useEffect(()=> {
        if(token !== null){
          console.log(Array.from(checkedItems))
          const config = {
            params: {
                leagueName:  Array.from(checkedItems),
                isAllLeagueChecked,
                teamNameCheck,
                teamName,
                team1Initial: scrollScoreTeamStrong,
                scorecheck,
                scrollOver,
                overcheck,
                homeTeam,
                homecheck,
                scrollRatioTeam1,
                scrollRatioTeam2,
                scrollRatioDistance,
                ratiocheck,
                team1: data.team1,
                team2: data.team2,
                ///
                overSign,
                overUndercheck,
                scrollOverWin,
                scrollUnderWin,
                scrollOverDistance,
                ///
                ratioWinCheck,
                scrollRatioTeam1Win,
                scrollRatioTeam2Win,
                scrollRatioEvenWin,
                scrollRatioDistanceWin,
                ///
                team1: data.team1,
                team2: data.team2
                
            },
            headers: {
              'x-auth-token': token
            }
          };
          axios.get(`${apiDomain}/soccer/getwincount`, config)
                      .then(response => {
                        //  setLeagueName(response.data.league_name);
                        setTeamChart(response.data.countTeamWin);
                        setOverChart(response.data.countOverWin);
                        setRatioChart(response.data.countRatioWin);
                        setTotalTeam(response.data.totalTeam);
                        setTotalOver(response.data.totalOver);
                        setTotalRatio(response.data.totalRatio);
                        setTeamDepen(response.data.teamDepen);
                        setOverDepen(response.data.overDepen);
                        setRatioDepen(response.data.ratioDepen);
                        setHisTeam1(response.data.team1His)
                        setHisTeam2(response.data.team2His)

                      })
            .catch(error => {
                 console.log(error)
           });
        }else{
           
        }
        
      },[token,checkedItems,isAllLeagueChecked,teamName,teamNameCheck,scrollScoreTeamStrong,scorecheck,scrollOver,overcheck,homeTeam,
        homecheck,
        scrollRatioTeam1,
        scrollRatioTeam2,
        scrollRatioDistance,
        ratiocheck,
        overSign,
        overUndercheck,
        scrollOverWin,
        scrollUnderWin,
        scrollOverDistance,
        ratioWinCheck,
        scrollRatioTeam1Win,
        scrollRatioTeam2Win,
        scrollRatioEvenWin,
        scrollRatioDistanceWin
    ])


    const getArcLabel1 = (params) => {
      const percent = params.value / totalTeam;
      return `${(percent * 100).toFixed(0)}%`;
    };
    const getArcLabel2 = (params) => {
      const percent = params.value / totalOver;
      return `${(percent * 100).toFixed(0)}%`;
    };

    const getArcLabel3 = (params) => {
      const percent = params.value / totalRatio;
      return `${(percent * 100).toFixed(0)}%`;
    };


    const handleScrollRatioWin1Change = (e) => {
        setScrollRatioTeam1Win(Number(e.target.value));
        // Simulate an API call
      };

      const handleScrollRatioWin2Change = (e) => {
        setScrollRatioTeam2Win(Number(e.target.value));
        // Simulate an API call
      };

      const handleScrollRatioWinEvenChange = (e) => {
        setScrollRatioEvenWin(Number(e.target.value));
        // Simulate an API call
      };

      const handleScrollRatioWinDistanceChange = (e) => {
        setScrollRatioDistanceWin(Number(e.target.value));
        // Simulate an API call
      };


      const handleScrollScoreChange = (e) => {
        setScrollScoreTeamStrong(Number(e.target.value));
        // Simulate an API call
      };

      const handleScrollOverChange = (e) => {
        setScrollOver(Number(e.target.value));
        // Simulate an API call
      };

      const handleScrollTeam1Change = (e) => {
        setScrollRatioTeam1(Number(e.target.value));
        // Simulate an API call
      };

      const handleScrollTeam2Change = (e) => {
        setScrollRatioTeam2(Number(e.target.value));
        // Simulate an API call
      };

    

      const handleScrollDistanceChange = (e) => {
        setScrollRatioDistance(Number(e.target.value));
        // Simulate an API call
      };


      const handleScrollOverWinChange = (e) => {
        setScrollOverWin(Number(e.target.value));
        // Simulate an API call
      };

      const handleScrollUnderWinChange = (e) => {
        setScrollUnderWin(Number(e.target.value));
        // Simulate an API call
      };

    

      const handleScrollDistanceOverChange = (e) => {
        setScrollOverDistance(Number(e.target.value));
        // Simulate an API call
      };

      const handleRadioHomeChange = (e) => {
        setHomeTeam(e.target.value);
      };

      const handleRadioOverChange = (e) => {
        setOverSign(e.target.value);
      };

      const handleRadioNameChange = (e) => {
        setTeamName(e.target.value);
      };

      const handleAllCheckedChange = (newIsAllChecked) => {
        setIsAllLeagueChecked(newIsAllChecked);
    };

    const handleCheckChange = (newCheckedItems) => {
        setCheckedItems(newCheckedItems);
        // Simulate an API call
        console.log('API call with checked items:', Array.from(newCheckedItems));
    };
    return(
        <div>
                <div style={{textAlign:'center', fontSize:'25px', margin:'10px 0'}}>History matches</div>
                <div className='his_table'>
                    <div className='his1'>
                       <div className='title'>{data.team1}</div>
                       {
                        hisTeam1.map((item,index) => 
                        <div key={index} style={{display:'flex', justifyContent:'start', alignContent:'center', alignItems:'center', padding:'10px 10px',borderBottom:'1px solid black'}}>
                          <Tooltip title={`${item.match_date}`}  placement='top'>
                            <IconButton>
                              <CalendarMonthIcon color='primary'/>
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={`${item.league_name}`}  placement='top'>
                            <IconButton>
                              <ModeIcon color='secondary'/>
                            </IconButton>
                          </Tooltip>
                          <Box
                              sx={{
                                minWidth: 45,
                                height: 22,
                                alignItems:'center',
                                textAlign:'center',
                                borderRadius: 1,
                                border:'1px solid blue',
                                // bgcolor: 'green',
                                // '&:hover': {
                                //   bgcolor: 'primary.dark',
                                // },
                              }}
                          >
                            {item.initial_team1_score}
                          </Box>
                          <Box
                              sx={{
                       
                                alignItems:'center',
                                textAlign:'center',
                                borderRadius: 1,
                                fontWeight: item.team1 === item.home_team ? 'bolder' : 'normal',
                                margin: '0 5px',
                                // border:'1px solid blue',
                                minWidth: 140,
                                // '&:hover': {
                                //   bgcolor: 'primary.dark',
                                // },
                              }}
                          >
                            {item.team1}
                          </Box>
                          <Box
                              sx={{
                                minWidth: 25,
                                height: 22,
                                alignItems:'center',
                                textAlign:'center',
                                borderRadius: 1,
                                border:'1px solid red',
                                // bgcolor: 'green',
                                // '&:hover': {
                                //   bgcolor: 'primary.dark',
                                // },
                              }}
                          >
                            {item.ht_team1_score}
                          </Box>
                          <Box
                              sx={{
                                minWidth: 25,
                                height: 22,
                                alignItems:'center',
                                textAlign:'center',
                                borderRadius: 1,
                                // border:'1px solid red',
                                // bgcolor: 'green',
                                // '&:hover': {
                                //   bgcolor: 'primary.dark',
                                // },
                              }}
                          >
                            {item.final_team1_score}
                          </Box>
                          -
                          <Box
                              sx={{
                                minWidth: 25,
                                height: 22,
                                alignItems:'center',
                                textAlign:'center',
                                borderRadius: 1,
                                // border:'1px solid red',
                                // bgcolor: 'green',
                                // '&:hover': {
                                //   bgcolor: 'primary.dark',
                                // },
                              }}
                          >
                            {item.final_team2_score}
                          </Box>
                          <Box
                              sx={{
                                minWidth: 25,
                                height: 22,
                                alignItems:'center',
                                textAlign:'center',
                                borderRadius: 1,
                                border:'1px solid red',
                                // bgcolor: 'green',
                                // '&:hover': {
                                //   bgcolor: 'primary.dark',
                                // },
                              }}
                          >
                            {item.ht_team2_score}
                          </Box>
                          <Box
                              sx={{
                               minWidth: 140,
                                height: 22,
                                alignItems:'center',
                                textAlign:'center',
                                borderRadius: 1,
                                fontWeight: item.team2 === item.home_team ? 'bolder' : 'normal',
                                margin: '0 5px',
                                // border:'1px solid blue',
                                // bgcolor: 'green',
                                // '&:hover': {
                                //   bgcolor: 'primary.dark',
                                // },
                              }}
                          >
                            {item.team2}
                          </Box>
                          <Box
                              sx={{
                                minWidth: 25,
                                height: 22,
                                alignItems:'center',
                                textAlign:'center',
                                borderRadius: 1,
                                border:'1px solid blue',
                                // bgcolor: 'green',
                                // '&:hover': {
                                //   bgcolor: 'primary.dark',
                                // },
                              }}
                          >
                            {item.initial_team2_score}
                          </Box>
                          {
                            item.betList.length > 0 ?
                            <Tooltip title={`Click to view details`}  placement='top'>
                            <IconButton>
                              <DownloadingIcon color='error'/>
                            </IconButton>
                          </Tooltip> : null
                          }
                        </div>)
                       }
                    </div>
                    <div className='his2'>
                      <div className='title'>{data.team2}</div>
                      { hisTeam2.map((item,index) => 
                        <div key={index} style={{display:'flex', justifyContent:'start', alignContent:'center', alignItems:'center', padding:'10px 10px',borderBottom:'1px solid black'}}>
                          <Tooltip title={`${item.match_date}`}  placement='top'>
                            <IconButton>
                              <CalendarMonthIcon color='primary'/>
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={`${item.league_name}`}  placement='top'>
                            <IconButton>
                              <ModeIcon color='secondary'/>
                            </IconButton>
                          </Tooltip>
                          <Box
                              sx={{
                                minWidth: 45,
                                height: 22,
                                alignItems:'center',
                                textAlign:'center',
                                borderRadius: 1,
                                border:'1px solid blue',
                                // bgcolor: 'green',
                                // '&:hover': {
                                //   bgcolor: 'primary.dark',
                                // },
                              }}
                          >
                            {item.initial_team1_score}
                          </Box>
                          <Box
                              sx={{
                       
                                alignItems:'center',
                                textAlign:'center',
                                borderRadius: 1,
                                fontWeight: item.team1 === item.home_team ? 'bolder' : 'normal',
                                // border:'1px solid blue',
                                minWidth: 140,
                                // '&:hover': {
                                //   bgcolor: 'primary.dark',
                                // },
                              }}
                          >
                            {item.team1}
                          </Box>
                          <Box
                              sx={{
                                minWidth: 25,
                                height: 22,
                                alignItems:'center',
                                textAlign:'center',
                                borderRadius: 1,
                                border:'1px solid red',
                                // bgcolor: 'green',
                                // '&:hover': {
                                //   bgcolor: 'primary.dark',
                                // },
                              }}
                          >
                            {item.ht_team1_score}
                          </Box>
                          <Box
                              sx={{
                                minWidth: 25,
                                height: 22,
                                alignItems:'center',
                                textAlign:'center',
                                borderRadius: 1,
                                // border:'1px solid red',
                                // bgcolor: 'green',
                                // '&:hover': {
                                //   bgcolor: 'primary.dark',
                                // },
                              }}
                          >
                            {item.final_team1_score}
                          </Box>
                          -
                          <Box
                              sx={{
                                minWidth: 25,
                                height: 22,
                                alignItems:'center',
                                textAlign:'center',
                                borderRadius: 1,
                                // border:'1px solid red',
                                // bgcolor: 'green',
                                // '&:hover': {
                                //   bgcolor: 'primary.dark',
                                // },
                              }}
                          >
                            {item.final_team2_score}
                          </Box>
                          <Box
                              sx={{
                                minWidth: 25,
                                height: 22,
                                alignItems:'center',
                                textAlign:'center',
                                borderRadius: 1,
                                border:'1px solid red',
                                // bgcolor: 'green',
                                // '&:hover': {
                                //   bgcolor: 'primary.dark',
                                // },
                              }}
                          >
                            {item.ht_team2_score}
                          </Box>
                          <Box
                              sx={{
                               minWidth: 140,
                                height: 22,
                                alignItems:'center',
                                textAlign:'center',
                                borderRadius: 1,
                                fontWeight: item.team2 === item.home_team ? 'bolder' : 'normal'
                                // border:'1px solid blue',
                                // bgcolor: 'green',
                                // '&:hover': {
                                //   bgcolor: 'primary.dark',
                                // },
                              }}
                          >
                            {item.team2}
                          </Box>
                          <Box
                              sx={{
                                minWidth: 25,
                                height: 22,
                                alignItems:'center',
                                textAlign:'center',
                                borderRadius: 1,
                                border:'1px solid blue',
                                // bgcolor: 'green',
                                // '&:hover': {
                                //   bgcolor: 'primary.dark',
                                // },
                              }}
                          >
                            {item.initial_team2_score}
                          </Box>
                          {
                            item.betList.length > 0 ?
                            <Tooltip title={`Click to view details`}  placement='top'>
                            <IconButton>
                              <DownloadingIcon color='error'/>
                            </IconButton>
                          </Tooltip> : null
                          }
                        </div>)
                       }
                    </div>
                </div>
                <div style={{textAlign:'center', fontSize:'25px', margin:'10px 0'}}>Chart analysts</div>
                <div className='soccer_analyst'>
                    <div className='soccer_league'>
                        <LeagueName
                        items={leagueName}
                        checkedItems={checkedItems}
                        onCheckChange={handleCheckChange}
                        onAllCheckedChange={handleAllCheckedChange}                        />
                    </div>
                    <div className='soccer_diagram'>
                        <div className='filter'>
                        <div className="scrollable-checkbox">
                            <label>
                            <input
                                type="checkbox"
                                checked={scorecheck}
                                onChange={(e) => setScoreCheck(!scorecheck)}
                            />
                            Handicap: {scrollScoreTeamStrong}
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="10"
                                step="0.25"
                                value={scrollScoreTeamStrong}
                                onChange={handleScrollScoreChange}
                                disabled={!scorecheck}
                            />
                        </div>
                        <div className="scrollable-checkbox">
                            <label>
                            <input
                                type="checkbox"
                                checked={ratiocheck}
                                onChange={(e) => setRatioCheck(!ratiocheck)}
                            />
                            Percent win strong|weak|distance: {(parseFloat(scrollRatioTeam1) + parseFloat(scrollRatioDistance)).toFixed(2)} &gt;= S &gt;={(parseFloat(scrollRatioTeam1) - parseFloat(scrollRatioDistance)).toFixed(2)}
                            <span style={{color:'red', margin: '0 10px', fontSize:'20px'}}>|</span>
                            {(parseFloat(scrollRatioTeam2) + parseFloat(scrollRatioDistance)).toFixed(2)} &gt;= W &gt;={(parseFloat(scrollRatioTeam2) - parseFloat(scrollRatioDistance)).toFixed(2)}
                            <span style={{color:'red', margin: '0 10px', fontSize:'20px'}}>|</span>
                            {scrollRatioDistance}
                            </label>
                            <div style={{display:'flex'}}>
                                        <input
                                        type="range"
                                        min="0"
                                        max="2"
                                        step="0.01"
                                        value={scrollRatioTeam1}
                                        onChange={handleScrollTeam1Change}
                                        disabled={!ratiocheck}
                                    />
                                       <input
                                        type="range"
                                        min="0"
                                        max="2"
                                        step="0.01"
                                        value={scrollRatioTeam2}
                                        onChange={handleScrollTeam2Change}
                                        disabled={!ratiocheck}
                                    />
                                       <input
                                        type="range"
                                        min="0"
                                        max="2"
                                        step="0.01"
                                        value={scrollRatioDistance}
                                        onChange={handleScrollDistanceChange}
                                        disabled={!ratiocheck}
                                    />
                            </div>
                        </div>
                        </div>
                        <div className='filter'>
                        <div className="scrollable-checkbox">
                            <label>
                            <input
                                type="checkbox"
                                checked={homecheck}
                                onChange={(e) => setHomeCheck(!homecheck)}
                            />
                            Home team: {homeTeam}
                            </label>
                            <div style={{display:'flex'}}>
                               <label>
                                <input
                                    type="radio"
                                    value="Strong team"
                                    checked={homeTeam === 'Strong team'}
                                    onChange={handleRadioHomeChange}
                                    disabled={!homecheck}
                                />
                                Strong
                                </label>
                                <label>
                                <input
                                    type="radio"
                                    value="Weak team"
                                    checked={homeTeam === 'Weak team'}
                                    onChange={handleRadioHomeChange}
                                    disabled={!homecheck}
                                />
                                Weak
                                </label>
                            </div>
                            </div>
                            <div className="scrollable-checkbox">
                            <label>
                            <input
                                type="checkbox"
                                checked={teamNameCheck}
                                onChange={(e) => setTeamNameCheck(!teamNameCheck)}
                            />
                            Team name: {teamName}
                            </label>
                            <div style={{display:'flex'}}>
                               <label>
                                <input
                                    type="radio"
                                    value={data.team1}
                                    checked={teamName === data.team1}
                                    onChange={handleRadioNameChange}
                                    disabled={!teamNameCheck}
                                />
                                {data.team1}
                                </label>
                                <label>
                                <input
                                    type="radio"
                                    value={data.team2}
                                    checked={teamName === data.team2}
                                    onChange={handleRadioNameChange}
                                    disabled={!teamNameCheck}
                                />
                                {data.team2}
                                </label>
                            </div>
                            </div>
                        </div>
                        <PieChart
                          series={[
                            {
                              data: teamChart,
                              arcLabel: getArcLabel1,
                            },
                          ]}
                            width={600}
                            height={200}
                          />
                           <div>Total count: <strong>{totalTeam}</strong> matches</div>
                           <div style={{marginBottom:'10px'}}>Dependencies: {teamDepen.join(', ')}</div>
                        <div style={{borderBottom:'1px solid grey'}}></div>
                        <div className='filter'>
                        <div className="scrollable-checkbox">
                            <label>
                            <input
                                type="checkbox"
                                checked={overcheck}
                                onChange={(e) => setOverCheck(!overcheck)}
                            />
                            Over/Under {overSign} {scrollOver}
                            </label>
                            <div style={{display:'flex'}}>
                            <input
                                type="range"
                                min="0"
                                max="10"
                                step="0.25"
                                value={scrollOver}
                                onChange={handleScrollOverChange}
                                disabled={!overcheck}
                            />
                               <label>
                                <input
                                    type="radio"
                                    value=">"
                                    checked={overSign === '>'}
                                    onChange={handleRadioOverChange}
                                    disabled={!overcheck}
                                />
                                {'>'}
                                </label>
                                <label>
                                <input
                                    type="radio"
                                    value="="
                                    checked={overSign === '='}
                                    onChange={handleRadioOverChange}
                                    disabled={!overcheck}
                                />
                                {'='}
                                </label>
                                <label>
                                <input
                                    type="radio"
                                    value="<"
                                    checked={overSign === '<'}
                                    onChange={handleRadioOverChange}
                                    disabled={!overcheck}
                                />
                                {'<'}
                                </label>
                            </div>
                            
                        </div>
                        <div className="scrollable-checkbox">
                            <label>
                            <input
                                type="checkbox"
                                checked={overUndercheck}
                                onChange={(e) => setOverUnderCheck(!overUndercheck)}
                            />
                            Percent win over|under|distance: {(parseFloat(scrollOverWin) + parseFloat(scrollOverDistance)).toFixed(2)} &gt;= O &gt;={(parseFloat(scrollOverWin) - parseFloat(scrollOverDistance)).toFixed(2)}
                            <span style={{color:'red', margin: '0 10px', fontSize:'20px'}}>|</span>
                            {(parseFloat(scrollUnderWin) + parseFloat(scrollOverDistance)).toFixed(2)} &gt;= U &gt;={(parseFloat(scrollUnderWin) - parseFloat(scrollOverDistance)).toFixed(2)}<span style={{color:'red', margin: '0 10px', fontSize:'20px'}}>|</span>{scrollOverDistance}
                            </label>
                            <div style={{display:'flex'}}>
                                        <input
                                        type="range"
                                        min="0"
                                        max="3"
                                        step="0.01"
                                        value={scrollOverWin}
                                        onChange={handleScrollOverWinChange}
                                        disabled={!overUndercheck}
                                    />
                                       <input
                                        type="range"
                                        min="0"
                                        max="3"
                                        step="0.01"
                                        value={scrollUnderWin}
                                        onChange={handleScrollUnderWinChange}
                                        disabled={!overUndercheck}
                                    />
                                       <input
                                        type="range"
                                        min="0"
                                        max="2"
                                        step="0.01"
                                        value={scrollOverDistance}
                                        onChange={handleScrollDistanceOverChange}
                                        disabled={!overUndercheck}
                                    />
                            </div>
                        </div>
                        
                        </div>
                        <PieChart
                          series={[
                            {
                              data: overChart,
                              arcLabel: getArcLabel2,
                            },
                          ]}
                            width={600}
                            height={200}
                          />
                           <div>Total count: <strong>{totalOver}</strong> matches</div>
                           <div style={{marginBottom:'10px'}}>Dependencies: {overDepen.join(', ')}</div>

                        <div style={{borderBottom:'1px solid grey'}}></div>
                        <div className='filter'>
                        <div className="scrollable-checkbox">
                            <label>
                            <input
                                type="checkbox"
                                checked={ratioWinCheck}
                                onChange={(e) => setRatioWinCheck(!ratioWinCheck)}
                            />
                            Percent win team1/team2/even/distance: 
                            {(parseFloat(scrollRatioTeam1Win) + parseFloat(scrollRatioDistanceWin)).toFixed(2)} &gt;= W &gt;={(parseFloat(scrollRatioTeam1Win) - parseFloat(scrollRatioDistanceWin)).toFixed(2)}
                            <span style={{color:'red', margin: '0 10px', fontSize:'20px'}}>|</span>
                            {(parseFloat(scrollRatioTeam2Win) + parseFloat(scrollRatioDistanceWin)).toFixed(2)} &gt;= W &gt;={(parseFloat(scrollRatioTeam2Win) - parseFloat(scrollRatioDistanceWin)).toFixed(2)}
                            <span style={{color:'red', margin: '0 10px', fontSize:'20px'}}>|</span>
                            {(parseFloat(scrollRatioEvenWin) + parseFloat(scrollRatioDistanceWin)).toFixed(2)} &gt;= E &gt;={(parseFloat(scrollRatioEvenWin) - parseFloat(scrollRatioDistanceWin)).toFixed(2)}
                            <span style={{color:'red', margin: '0 10px', fontSize:'20px'}}>|</span>
                            {scrollRatioDistanceWin}
                            </label>
                            <div style={{display:'flex'}}>
                                        <input
                                        type="range"
                                        min="0"
                                        max="30"
                                        step="0.01"
                                        value={scrollRatioTeam1Win}
                                        onChange={handleScrollRatioWin1Change}
                                        disabled={!ratioWinCheck}
                                    />
                                       <input
                                        type="range"
                                        min="0"
                                        max="30"
                                        step="0.01"
                                        value={scrollRatioTeam2Win}
                                        onChange={handleScrollRatioWin2Change}
                                        disabled={!ratioWinCheck}
                                    />
                                       <input
                                        type="range"
                                        min="0"
                                        max="30"
                                        step="0.01"
                                        value={scrollRatioEvenWin}
                                        onChange={handleScrollRatioWinEvenChange}
                                        disabled={!ratioWinCheck}
                                    />
                                    <input
                                        type="range"
                                        min="0"
                                        max="5"
                                        step="0.01"
                                        value={scrollRatioDistanceWin}
                                        onChange={handleScrollRatioWinDistanceChange}
                                        disabled={!ratioWinCheck}
                                    />
                                    
                            </div>
                            <PieChart
                          series={[
                            {
                              data: ratioChart,
                              arcLabel: getArcLabel3,
                            },
                          ]}
                            width={600}
                            height={200}
                          />
                          <div>Total count: <strong>{totalRatio}</strong> matches</div>
                          <div style={{marginBottom:'10px'}}>Dependencies: {ratioDepen.join(', ')}</div>

                        </div>
                      
                        </div>
                    </div>
                </div> 
        </div>
       
    )
}

export default SoccerAnalyst;