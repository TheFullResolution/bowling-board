import React from "react";
import {
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import { useSelector } from "../stateUtils/useSelector";
import {
  scoreBoardSelector,
  sessionGamesSelector,
} from "../App/GameStates/Session.state";
import range from "lodash.range";

interface Props {}

export const ScoreBoard: React.FC<Props> = () => {
  const [totals] = useSelector(scoreBoardSelector, []);
  const [gameNumber] = useSelector(sessionGamesSelector, 0);

  return (
    <Container maxWidth="md">
      <Box my={6}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Score Board
        </Typography>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Player</TableCell>
              <TableCell align="right">Won Games</TableCell>
              <TableCell align="right">Total Score</TableCell>
              {range(gameNumber).map((el) => (
                <TableCell key={el} align="right">
                  Game {el + 1}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {totals.map((scores) => (
              <TableRow key={scores.id}>
                <TableCell component="th" scope="row">
                  {scores.value}
                </TableCell>
                <TableCell align="right">{scores.won}</TableCell>
                <TableCell align="right">{scores.totals}</TableCell>
                {scores.games.map((points) => (
                  <TableCell key={points} align="right">
                    {points}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};
