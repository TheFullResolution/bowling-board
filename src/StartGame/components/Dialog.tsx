import React from "react";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  useMediaQuery,
  useTheme,
  Dialog as MaterialDialog
} from "@material-ui/core";
import { TransitionProps } from "@material-ui/core/transitions";

interface Props {
  open: boolean;
  handleClose: () => void;
  formId: string;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const Dialog: React.FC<Props> = ({
  open,
  handleClose,
  children,
  formId
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <MaterialDialog
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
        {children}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button
          type="submit"
          form={formId}
          color="primary"
          variant="contained"
        >
          Start Game
        </Button>
      </DialogActions>
    </MaterialDialog>
  );
};
