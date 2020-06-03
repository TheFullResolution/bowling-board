import React from "react";
import { useAppState } from "../../stateUtils/useAppState";
import { appInstructionsModalSelector, AppState } from "../../App/App.state";
import {
  Button,
  Dialog as MaterialDialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import WarningIcon from "@material-ui/icons/Warning";
import HelpIcon from "@material-ui/icons/Help";
import { ActionType } from "../../App/App.actions";

interface Props {}

export const Instructions: React.FC<Props> = () => {
  const [open] = useAppState({
    selector: appInstructionsModalSelector,
    defaultStateKey: "showInstructions",
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClose = () => {
    AppState.dispatch({ type: ActionType.closeInstructions });
  };

  return (
    <MaterialDialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      fullScreen={isMobile}
      disableBackdropClick
      maxWidth="sm"
      keepMounted
      fullWidth
    >
      <DialogTitle id="form-dialog-title">Instructions</DialogTitle>
      <DialogContent>
        <DialogContentText>How to use the board:</DialogContentText>
        <List>
          <ListItem>
            <ListItemIcon>
              <ArrowForwardIosIcon />
            </ListItemIcon>
            <ListItemText>
              Click Button on top of the page to go to next frame
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <ArrowForwardIosIcon />
            </ListItemIcon>
            <ListItemText>
              Results will be generated randomly for each player
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <ArrowForwardIosIcon />
            </ListItemIcon>
            <ListItemText>
              You can toggle under the name of the player to reveal the form for
              manual points' entry
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <WarningIcon />
            </ListItemIcon>
            <ListItemText>
              If you do not select the second score, it will be treated as 0
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <WarningIcon />
            </ListItemIcon>
            <ListItemText>
              If you do not select the first score, the player's score will be
              automatically generated
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <HelpIcon />
            </ListItemIcon>
            <ListItemText>
              For the extra frame, you can select both scores to be 10 if you
              had a strike in a 10th frame, other frames will have the second
              score automatically deducted
            </ListItemText>
          </ListItem>
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </MaterialDialog>
  );
};
