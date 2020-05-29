import React, { useState } from "react";
import randomatic from "randomatic";
import { Box, Button, Fade, IconButton, TextField } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import ClearIcon from "@material-ui/icons/Clear";

interface Props {}

export const PlayerForm: React.FC<Props> = () => {
  const [players, setPlayers] = useState<string[]>([randomatic("Aa", 10)]);

  const addPlayer = () => {
    const playerId = randomatic("Aa", 10);

    setPlayers([...players, playerId]);
  };

  const createPopPlayer = (name: string) => () => {
    setPlayers(players.filter(player => player !== name));
  };

  return (
    <>
      {players.map((id, index) => {
        const popPlayer = createPopPlayer(id);
        return (
          <Fade in={true} appear={true} key={id} timeout={550}>
            <Box display="flex">
              <TextField
                autoFocus
                margin="dense"
                id={id}
                label={`Player ${index + 1} Name`}
                type="text"
                fullWidth
                variant="outlined"
              />
              {index > 0 && (
                <IconButton onClick={popPlayer}>
                  <ClearIcon />
                </IconButton>
              )}
            </Box>
          </Fade>
        );
      })}
      <Box my={2}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          color="default"
          onClick={addPlayer}
        >
          Add More Players
        </Button>
      </Box>
    </>
  );
};
