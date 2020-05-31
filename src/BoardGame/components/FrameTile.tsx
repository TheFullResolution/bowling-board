import React, { useReducer } from "react";
import {
  createStyles,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
} from "@material-ui/core";
import { Player } from "../../App/App.types";
import range from "lodash.range";
import { makeStyles } from "@material-ui/core/styles";
import cls from "classnames";
const RANGE_FOR_POINTS = 11;

interface Props {
  player: Player;
  frame: number;
  currentFrame: number;
}

const initialFormState = {
  firstValue: "" as const,
  firstOptions: RANGE_FOR_POINTS,
  secondValue: "" as const,
  secondOptions: RANGE_FOR_POINTS,
};

interface FormState {
  firstValue: "" | number;
  firstOptions: number;
  secondValue: "" | number;
  secondOptions: number;
}

interface Action {
  type: "updateFirst" | "updateSecond";
  value: number | "";
}

const formReducer = (state: FormState, action: Action): FormState => {
  switch (action.type) {
    case "updateFirst": {
      const secondOptions =
        typeof action.value === "number"
          ? RANGE_FOR_POINTS - action.value
          : RANGE_FOR_POINTS;

      return {
        ...state,
        firstValue: action.value,
        secondValue: "",
        secondOptions,
      };
    }

    case "updateSecond": {
      return { ...state, secondValue: action.value };
    }
  }
};

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      padding: theme.spacing(1),
      display: "flex",
      alignItems: "center",
    },
    currentFrame: {
      border: `3px solid ${theme.palette.secondary.light}`,
    },
    formWrapper: {
      flex: "auto",
    },
    formcontrol: {
      width: "100%",
      "&:not(:first-child)": {
        marginTop: theme.spacing(1),
      },
    },
  })
);

export const FrameTile: React.FC<Props> = ({ player, frame, currentFrame }) => {
  const [formState, dispatchChange] = useReducer(formReducer, initialFormState);

  const isCurrent = frame === currentFrame;

  const createHandleChange = (type: Action["type"]) => (
    event: React.ChangeEvent<any>
  ) => {
    dispatchChange({
      type,
      value: event.target.value,
    });
  };

  const classes = useStyles();

  return (
    <Paper
      elevation={player.automatic ? 1 : 5}
      className={cls(classes.container, { [classes.currentFrame]: isCurrent })}
    >
      {!player.automatic && isCurrent ? (
        <div className={classes.formWrapper}>
          <FormControl
            variant="outlined"
            className={classes.formcontrol}
            size={"small"}
          >
            <InputLabel id="select-label-1">First Round</InputLabel>
            <Select
              labelId="select-label-1"
              id="select-1"
              value={formState.firstValue}
              onChange={createHandleChange("updateFirst")}
              label="First Round"
            >
              {range(formState.firstOptions).map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl
            variant="outlined"
            className={classes.formcontrol}
            size={"small"}
          >
            <InputLabel id="select-label-2">Second Round</InputLabel>
            <Select
              labelId="select-label-2"
              id="select-2"
              value={formState.secondValue}
              disabled={formState.secondOptions === 0}
              onChange={createHandleChange("updateSecond")}
              label="Second Round"
            >
              {range(formState.secondOptions).map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      ) : null}
    </Paper>
  );
};
