import Paper from "@mui/material/Paper";
import paper from "paper";
import React, { useEffect, useState } from "react";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import AnimationIcon from "@mui/icons-material/Animation";
import IconButton from "@mui/material/IconButton";
import { theme } from "../../App";
import { newFrame } from "../LineArt";
import { Button, Typography } from "@mui/material";

declare global {
  interface Window {
    TIME: number;
  }
}
window.TIME = 0;
class Metric {
  frame: { height: number; width: number };
  constructor() {
    this.frame = { height: 35, width: Math.round(window.innerWidth / 7) };
  }
}
const metric = new Metric();
// function clamp(n: number, min: number, max: number) {
//   if (n > max) {
//     return max;
//   } else if (n < min) {
//     return min;
//   } else {
//     return n;
//   }
// }

function DopeSheet() {
  const [frames, setFrames] = useState(window.FRAME_LAYER.children);
  const [active, setActive] = useState(0);
  const [onionSkin, setOnionSkin] = React.useState(true);
  const [loopingAnimation, setLoopingAnimation] = React.useState(false);
  useEffect(() => {
    //console.log(active)
  }, [active]);
  //animation
  const [playing, setPlaying] = React.useState(false);
  paper.view.onFrame = (e: { delta: number; time: number; count: number }) => {
    if (window.TIME > 12 / 1000) {
      window.TIME = 0;
      if (frames.length > 1) {
        if (playing && (active + 1 < frames.length || loopingAnimation))
          setActive((active + 1) % frames.length);
      }
    } else {
      window.TIME += e.delta;
    }
  };
  useEffect(() => {
    window.dispatchEvent(window.onToolCancellation);
    window.FRAME_LAYER.children.forEach((frame) => {
      frame.visible = false;
    });
    const activeFrame = frames[active];
    if (activeFrame) {
      window.UPDATE.undoRedo && window.UPDATE.undoRedo();
      if (onionSkin) {
        let prev = activeFrame.previousSibling;
        let next = activeFrame.nextSibling;
        if (loopingAnimation) {
          const first = frames[0];
          const last = frames[frames.length - 1];
          if (activeFrame === first) prev = last;
          else if (activeFrame === last) next = first;
        }
        if (prev)
          prev.set({
            visible: true,
            strokeColor: "red",
          });

        if (next)
          next.set({
            visible: true,
            strokeColor: "green",
          });
      }
      window.ACTIVE_FRAME = activeFrame as paper.Group;
      activeFrame.set({ visible: true, strokeColor: "black" });
    }
  }, [active, onionSkin, loopingAnimation, frames]);
  return (
    <Paper style={{ paddingBottom: 5, background: theme.palette.grey[200] }}>
      <div
        style={{
          background: theme.palette.grey[300],
        }}
      >
        <div
          onScroll={(e) => {
            // console.log(e);
            //@ts-ignore
            const x = e.target.scrollLeft / e.target.scrollWidth;
            if (!playing) {
              setActive(Math.round(x * (frames.length + 6)));
            }
          }}
          style={{
            display: "flex",
            overflowX: "scroll",
            opacity: playing ? 0.5 : 1,
          }}
        >
          <div style={{ minWidth: metric.frame.width }}></div>
          <div style={{ minWidth: metric.frame.width }}></div>
          <div style={{ minWidth: metric.frame.width }}></div>
          {frames.map((frame, i) => {
            return (
              <Frame
                key={i}
                active={active === i}
                onClick={() => {
                  if (!playing) {
                    setActive(i);
                  }
                }}
                index={i}
              />
            );
          })}
          <div style={{ minWidth: metric.frame.width }}></div>
          <div style={{ minWidth: metric.frame.width }}></div>
          <div style={{ minWidth: metric.frame.width }}></div>
        </div>
      </div>
      <Menu
        playing={playing}
        setPlaying={setPlaying}
        loopingAnimation={loopingAnimation}
        setLoopingAnimation={setLoopingAnimation}
        active={active}
        setActive={setActive}
        onionSkin={onionSkin}
        setOnionSkin={setOnionSkin}
        frames={frames}
        setFrames={setFrames}
      />
    </Paper>
  );
}
function Frame(props: { active: boolean; onClick: Function; index: number }) {
  const margin = 1;
  const padding = 1;
  const width = metric.frame.width - 2 * (margin + padding);
  const height = metric.frame.height;
  return (
    <Button
      onClick={(e) => {
        props.onClick();
      }}
      style={{
        userSelect: "none",
        margin: margin,
        marginBottom: height / 5,
        height: height,
        paddingLeft: padding,
        paddingRight: padding,
        width: width,
        minWidth: width,
        background: props.active
          ? theme.palette.primary.main
          : theme.palette.secondary.main,
      }}
    >
      <Typography color={"white"}>{props.index}</Typography>
    </Button>
  );
}

function Menu(props: {
  playing: boolean;
  setPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  loopingAnimation: boolean;
  setLoopingAnimation: React.Dispatch<React.SetStateAction<boolean>>;
  active: number;
  setActive: React.Dispatch<React.SetStateAction<number>>;
  frames: paper.Item[];
  setFrames: React.Dispatch<React.SetStateAction<paper.Item[]>>;
  onionSkin: boolean;
  setOnionSkin: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const iconSize = "large";
  const style = {
    display: "flex",
    alignItems: "center",
    padding: 2,
    marginDown: 2,
    margin: 5,
    borderRadius: 6,
    background: theme.palette.primary,
  } as unknown as React.CSSProperties;
  return (
    <div
      style={{
        display: "flex",
        userSelect: "none",
      }}
    >
      <IconButton
        style={style}
        onClick={() => {
          props.setPlaying(!props.playing);
        }}
      >
        {props.playing ? (
          <PauseCircleOutlineIcon fontSize={iconSize} />
        ) : (
          <PlayCircleOutlineIcon fontSize={iconSize} />
        )}
      </IconButton>
      <IconButton
        style={style}
        onClick={() => {
          props.setLoopingAnimation(!props.loopingAnimation);
        }}
      >
        <AllInclusiveIcon
          fontSize={iconSize}
          color={props.loopingAnimation ? "primary" : "disabled"}
        />
      </IconButton>
      <hr style={{ border: "none" }} />
      <IconButton
        style={style}
        onClick={(e) => {
          newFrame().insertAbove(props.frames[props.active]);
          if (props.frames[props.active])
            props.setFrames(window.FRAME_LAYER.children.slice());
          props.setActive(props.active + 1);
        }}
      >
        <AddCircleOutlineIcon fontSize={iconSize} />
      </IconButton>
      <IconButton
        style={style}
        onClick={(e) => {
          if (props.frames[props.active]) {
            props.frames[props.active].clone();
          }
          props.setFrames(window.FRAME_LAYER.children.slice());
          props.setActive(props.active + 1);
        }}
      >
        <ContentCopyIcon fontSize={iconSize} />
      </IconButton>
      <IconButton
        style={style}
        onClick={() => {
          if (props.frames.length === 1)
            newFrame().insertAbove(props.frames[props.active]);
          props.frames[props.active].remove();

          const newActive = Math.max(
            0,
            Math.min(props.frames.length - 1, props.active - 1)
          );
          props.setActive(newActive);
          props.setFrames(window.FRAME_LAYER.children.slice());
        }}
      >
        <DeleteOutlineIcon fontSize={iconSize} />
      </IconButton>
      <IconButton
        style={style}
        onClick={() => {
          props.setOnionSkin(!props.onionSkin);
        }}
      >
        <AnimationIcon
          fontSize={iconSize}
          color={props.onionSkin ? "primary" : "disabled"}
        />
      </IconButton>
    </div>
  );
}
export default DopeSheet;
