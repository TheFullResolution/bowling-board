import React, { useEffect, useRef } from "react";
import {
  createStyles,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import range from "lodash.range";
import { RANGE_FOR_POINTS } from "../../config";
import { makeStyles } from "@material-ui/core/styles";
import { FrameState, PlayerState } from "../../state";
import { createFrameSelector } from "../../state/Frame.state";
import { useSelector } from "../../stateUtils/useSelector";

interface Props {
  player: PlayerState;
  isLast?: boolean;
  strike?: boolean;
  spare?: boolean;
}

const useStyles = makeStyles((theme) =>
  createStyles({
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

export const FrameTileForm: React.FC<Props> = ({
  player,
  isLast,
  spare,
  strike,
}) => {
  const classes = useStyles();

  const frameSelector = useRef(createFrameSelector(player.id));

  const [frameState] = useSelector(frameSelector.current, {
    id: "",
    score1: null,
    score2: null,
  });

  const score2options = RANGE_FOR_POINTS - (frameState.score1 ?? 0);

  useEffect(() => {
    FrameState.update({ id: player.id, score1: null, score2: null });
  }, [player.id, player.automatic]);

  const createHandleChange = (type: "score1" | "score2") => (
    event: React.ChangeEvent<any>
  ) => {
    const val =
      type === "score1"
        ? { score1: event.target.value }
        : { score2: event.target.value };
    FrameState.update({ id: player.id, ...val });
  };

  const score2Value =
    !isLast && frameState.score1 === 10 ? 0 : frameState.score2 ?? "";

  return (
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
          value={frameState.score1 ?? ""}
          onChange={createHandleChange("score1")}
          label="First Round"
        >
          {range(RANGE_FOR_POINTS).map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {isLast && spare ? null : (
        <FormControl
          variant="outlined"
          className={classes.formcontrol}
          size={"small"}
        >
          <InputLabel id="select-label-2">Second Round</InputLabel>
          <Select
            labelId="select-label-2"
            id="select-2"
            value={score2Value}
            onChange={createHandleChange("score2")}
            label="Second Round"
          >
            {range(isLast ? RANGE_FOR_POINTS : score2options).map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </div>
  );
};
