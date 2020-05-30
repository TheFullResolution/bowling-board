import React, { FormEventHandler } from "react";
import { Box, Button, Fade, IconButton, TextField } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import ClearIcon from "@material-ui/icons/Clear";

interface Props {
  players: { id: string; value: string }[];
  createRemovePlayer: (id: string) => () => void;
  addPlayer: () => void;
  handleSubmit: FormEventHandler<HTMLFormElement>;
  createOnChange: (id: string) => React.ChangeEventHandler<HTMLInputElement>;
  formId: string;
  showformValid: boolean;
}

export const PlayerForm: React.FC<Props> = ({
  players,
  createRemovePlayer,
  createOnChange,
  addPlayer,
  handleSubmit,
  formId,
  showformValid,
}) => {
  return (
    <form onSubmit={handleSubmit} id={formId}>
      {players.map(({ id, value }, index) => {
        const removePlayer = createRemovePlayer(id);
        const onChange = createOnChange(id);
        return (
          <Fade in={true} appear={true} key={id} timeout={550}>
            <Box display="flex">
              <TextField
                autoFocus
                error={showformValid && !value}
                margin="dense"
                id={id}
                label={`Player ${index + 1} Name`}
                type="text"
                value={value}
                onChange={onChange}
                fullWidth
                autoComplete={"off"}
                variant="outlined"
              />
              {index > 0 && (
                <IconButton onClick={removePlayer}>
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
    </form>
  );
};
