import IconButton from "@mui/material/IconButton";
import Icon from "@mdi/react";
import { mdiRedoVariant, mdiUndoVariant } from "@mdi/js";
import { useReducer } from "react";
import { theme } from "./App";

function UndoRedo() {
  const [, update] = useReducer((x) => x + 1, 0);
  window.UPDATE.undoRedo = update;
  const frame = window.ACTIVE_FRAME;
  const undo = frame.data.history[frame.data.current].undo;
  const redo = frame.data.history[frame.data.current].redo;
  const style = {
    padding: 5,
    marginDown: 2,
    margin: 5,
    borderRadius: 6,
    background: theme.palette.grey[200],
  };
  return (
    <div style={{ position: "fixed" }}>
      <IconButton
        style={style}
        onClick={() => {
          if (undo) {
            window.dispatchEvent(window.onToolCancellation);
            undo();
            frame.data.current -= 1;
            update();
          }
        }}
        disabled={!undo}
      >
        <Icon path={mdiUndoVariant} size={1} />
      </IconButton>
      <IconButton
        style={style}
        onClick={() => {
          if (redo) {
            window.dispatchEvent(window.onToolCancellation);
            redo();
            frame.data.current += 1;
            update();
          }
        }}
        disabled={!redo}
      >
        <Icon path={mdiRedoVariant} size={1} />
      </IconButton>
    </div>
  );
}

export default UndoRedo;
