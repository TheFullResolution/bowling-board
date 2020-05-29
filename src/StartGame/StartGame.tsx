import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  useMediaQuery,
  useTheme
} from "@material-ui/core";
import { TransitionProps } from "@material-ui/core/transitions";
import { PlayerForm } from "./components/PlayerForm";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const StartGame: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Start Game
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        fullScreen={isMobile}
        disableBackdropClick
        TransitionComponent={Transition}
        maxWidth="sm"
        keepMounted
        fullWidth
      >
        <DialogTitle id="form-dialog-title">Add Players</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Before you start the game, add all players to the list.
          </DialogContentText>
          <PlayerForm />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary" variant="contained">
            Start Game
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
