import React, {useState,useEffect} from 'react';
import './soccer_reason.styles.css';

const SoccerReason = ({
    team1Motivation,
    team2Motivation,
    team1Notes,
    team2Notes,
    setTeam1Motivation,
    setTeam2Motivation,
    setTeam1Notes,
    setTeam2Notes,
  
    team1DefensivePower,
    team2DefensivePower,
    team1DefenseNotes,
    team2DefenseNotes,
    setTeam1DefensivePower,
    setTeam2DefensivePower,
    setTeam1DefenseNotes,
    setTeam2DefenseNotes,
  
    team1OffensivePower,
    team2OffensivePower,
    team1OffenseNotes,
    team2OffenseNotes,
    setTeam1OffensivePower,
    setTeam2OffensivePower,
    setTeam1OffenseNotes,
    setTeam2OffenseNotes,

    team1FeelingWin,
    team2FeelingWin,
    team1FeelingWinNotes,
    team2FeelingWinNotes,
    setTeam1FeelingWin,
    setTeam2FeelingWin,
    setTeam1FeelingWinNotes,
    setTeam2FeelingWinNotes,

    team1,
    team2

  }) => {
        return (
            <table border="1">
              <thead>
                <tr>
                  <th>Reason</th>
                  <th>{team1}</th>
                  <th>{team2}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Team Motivation</td>
                  <td>
                    <select
                      value={team1Motivation}
                      onChange={(e) => setTeam1Motivation(e.target.value)}
                    >
                      <option value="strong">Strong</option>
                      <option value="medium">Medium</option>
                      <option value="weak">Weak</option>
                    </select>
                  </td>
                  <td>
                    <select
                      value={team2Motivation}
                      onChange={(e) => setTeam2Motivation(e.target.value)}
                    >
                      <option value="strong">Strong</option>
                      <option value="medium">Medium</option>
                      <option value="weak">Weak</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>Motivation Notes</td>
                  <td>
                    <textarea
                      value={team1Notes}
                      onChange={(e) => setTeam1Notes(e.target.value)}
                      rows="8"
                      cols="40"
                    />
                  </td>
                  <td>
                    <textarea
                      value={team2Notes}
                      onChange={(e) => setTeam2Notes(e.target.value)}
                      rows="8"
                      cols="40"
                    />
                  </td>
                </tr>
                <tr>
                  <td>Defensive Power</td>
                  <td>
                    <select
                      value={team1DefensivePower}
                      onChange={(e) => setTeam1DefensivePower(e.target.value)}
                    >
                      <option value="strong">Strong</option>
                      <option value="medium">Medium</option>
                      <option value="weak">Weak</option>
                    </select>
                  </td>
                  <td>
                    <select
                      value={team2DefensivePower}
                      onChange={(e) => setTeam2DefensivePower(e.target.value)}
                    >
                      <option value="strong">Strong</option>
                      <option value="medium">Medium</option>
                      <option value="weak">Weak</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>Defense Notes</td>
                  <td>
                    <textarea
                      value={team1DefenseNotes}
                      onChange={(e) => setTeam1DefenseNotes(e.target.value)}
                      rows="8"
                      cols="40"
                    />
                  </td>
                  <td>
                    <textarea
                      value={team2DefenseNotes}
                      onChange={(e) => setTeam2DefenseNotes(e.target.value)}
                      rows="8"
                      cols="40"
                    />
                  </td>
                </tr>
                <tr>
                  <td>Offensive Power</td>
                  <td>
                    <select
                      value={team1OffensivePower}
                      onChange={(e) => setTeam1OffensivePower(e.target.value)}
                    >
                      <option value="strong">Strong</option>
                      <option value="medium">Medium</option>
                      <option value="weak">Weak</option>
                    </select>
                  </td>
                  <td>
                    <select
                      value={team2OffensivePower}
                      onChange={(e) => setTeam2OffensivePower(e.target.value)}
                    >
                      <option value="strong">Strong</option>
                      <option value="medium">Medium</option>
                      <option value="weak">Weak</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>Offense Notes</td>
                  <td>
                    <textarea
                      value={team1OffenseNotes}
                      onChange={(e) => setTeam1OffenseNotes(e.target.value)}
                      rows="8"
                      cols="40"
                    />
                  </td>
                  <td>
                    <textarea
                      value={team2OffenseNotes}
                      onChange={(e) => setTeam2OffenseNotes(e.target.value)}
                      rows="8"
                      cols="40"
                    />
                  </td>
                </tr>

                <tr>
                  <td>Feeling Win</td>
                  <td>
                    <select
                      value={team1FeelingWin}
                      onChange={(e) => setTeam1FeelingWin(e.target.value)}
                    >
                      <option value="strong">Strong</option>
                      <option value="medium">Medium</option>
                      <option value="weak">Weak</option>
                    </select>
                  </td>
                  <td>
                    <select
                      value={team2FeelingWin}
                      onChange={(e) => setTeam2FeelingWin(e.target.value)}
                    >
                      <option value="strong">Strong</option>
                      <option value="medium">Medium</option>
                      <option value="weak">Weak</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>Feeling Notes</td>
                  <td>
                    <textarea
                      value={team1FeelingWinNotes}
                      onChange={(e) => setTeam1FeelingWinNotes(e.target.value)}
                      rows="8"
                      cols="40"
                    />
                  </td>
                  <td>
                    <textarea
                      value={team2FeelingWinNotes}
                      onChange={(e) => setTeam2FeelingWinNotes(e.target.value)}
                      rows="8"
                      cols="40"
                    />
                  </td>
                </tr>
              </tbody>
            </table>)
}

export default SoccerReason;