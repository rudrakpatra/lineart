import Paper from "@mui/material/Paper";
import paper from "paper";
import React, { createContext, useEffect, useRef, useState } from "react";
import { theme } from "../../App";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import AnimationIcon from "@mui/icons-material/Animation";
import IconButton from "@mui/material/IconButton";

declare global {
  interface Window {
    TIME: number;
  }
}
window.TIME = 0;
class Metric {
  frame: { height: number; width: number };
  constructor() {
    this.frame = { height: 35, width: 60 };
  }
}
const metric = new Metric();
const GlobalContext = createContext<{}>({});
function clamp(n: number, min: number, max: number) {
  if (n > max) {
    return max;
  } else if (n < min) {
    return min;
  } else {
    return n;
  }
}

function DopeSheet() {
  const [frames, setFrames] = useState(window.FRAMELAYER.children);
  const x_max = (window.innerWidth - metric.frame.width) / 2;
  const x_min = x_max - metric.frame.width * (frames.length - 1);
  const [x, setx] = useState(x_max);
  const [active, setActive] = useState(0);

  const [onionSkin, setOnionSkin] = React.useState(true);
  const [loopingAnimation, setLoopingAnimation] = React.useState(false);
  useEffect(() => {
    //console.log(active)
  }, [active]);
  //animation
  const [playing, setPlaying] = React.useState(false);
  paper.view.onFrame = (e: { delta: number; time: number; count: number }) => {
    if (window.TIME > 24 / 1000) {
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
    frames.forEach((frame) => {
      frame.visible = false;
      frame.selected = false;
    });
    const activeFrame = frames[active];
    if (activeFrame) {
      if (onionSkin) {
        let prev = activeFrame.previousSibling;
        let next = activeFrame.nextSibling;
        if (loopingAnimation) {
          const first = frames[0];
          const last = frames[frames.length - 1];
          if (activeFrame === first) prev = last;
          else if (activeFrame === last) next = first;
        }
        if (prev) prev.set({ visible: true, opacity: 0.5 });

        if (next) next.set({ visible: true, opacity: 0.5 });
      }
      window.ACTIVEFRAME = activeFrame as paper.Group;
      activeFrame.set({ visible: true, opacity: 1 });
    }
  }, [active, onionSkin, loopingAnimation, frames]);

  //dragging & scrolling the frames
  const dragLast = useRef(0);
  const scroll_sensitivity = 2;

  const handleScrollStart = (e: React.TouchEvent) => {
    dragLast.current = e.touches[0].clientX;
  };
  const handleScrollMove = (e: React.TouchEvent) => {
    const value =
      scroll_sensitivity * (x + e.touches[0].clientX - dragLast.current) - x;
    dragLast.current = e.touches[0].clientX;
    setx(clamp(value, x_min, x_max));
  };
  useEffect(() => {
    if (!playing) {
      const checkActive = (index: number) => {
        const left = -(index + 0.5) * metric.frame.width;
        const right = -(index - 0.5) * metric.frame.width;
        const rel_x = x - x_max;
        return rel_x > left && rel_x < right;
      };
      const getActive = () => {
        let new_active = 0;
        for (let i = 0; i < frames.length; i++) {
          if (checkActive(i)) {
            new_active = i;
            break;
          }
        }
        return new_active;
      };
      setActive(getActive());
    }
  }, [playing, x, x_max, frames.length]);
  return (
    <GlobalContext.Provider value={{}}>
      <Paper
        onTouchStart={handleScrollStart}
        onTouchMove={handleScrollMove}
        style={{ paddingBottom: 5, background: theme.palette.grey[200] }}
      >
        <div
          style={{
            background: theme.palette.grey[300],
            padding: 2,
          }}
        >
          <div
            style={{
              display: "flex",
              transform: `translateX(${x}px)`,
              opacity: playing ? 0.4 : 1,
            }}
          >
            {frames.map((frame, i) => {
              return <Frame active={active === i} index={i} />;
            })}
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
          setx={setx}
          x_max={x_max}
        />
      </Paper>
    </GlobalContext.Provider>
  );
}
function Frame(props: { active: boolean; index: number }) {
  const margin = 2;
  const padding = 3;
  const width = metric.frame.width - 2 * (margin + padding);
  const height = metric.frame.height;
  return (
    <Paper
      style={{
        userSelect: "none",
        margin: margin,
        height: height,
        paddingLeft: padding,
        paddingRight: padding,
        width: width,
        minWidth: width,
        background: props.active
          ? theme.palette.secondary.main
          : theme.palette.primary.main,
      }}
    >
      {props.index}
    </Paper>
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
  setx: React.Dispatch<React.SetStateAction<number>>;
  x_max: number;
}) {
  const iconSize = "large";
  const style = {
    display: "flex",
    alignItems: "center",
    padding: 2,
    marginDown: 2,
    margin: 5,
    borderRadius: 6,
    background: theme.palette.grey[300],
  };
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
          color={props.loopingAnimation ? "secondary" : "disabled"}
        />
      </IconButton>
      <hr style={{ border: "none" }} />
      <IconButton
        style={style}
        onClick={(e) => {
          new paper.Group({ visible: false }).insertAbove(
            props.frames[props.active]
          );
          if (props.frames[props.active])
            props.frames[props.active].selected = false;
          props.setFrames(window.FRAMELAYER.children.slice());
          props.setActive(props.active + 1);
          props.setx(-(props.active + 1) * metric.frame.width + props.x_max);
        }}
      >
        <AddCircleOutlineIcon fontSize={iconSize} />
      </IconButton>
      <IconButton
        style={style}
        onClick={(e) => {
          if (props.frames[props.active]) {
            props.frames[props.active].clone();
            props.frames[props.active].selected = false;
          }
          props.setFrames(window.FRAMELAYER.children.slice());
          props.setActive(props.active + 1);
          props.setx(-(props.active + 1) * metric.frame.width + props.x_max);
        }}
      >
        <ContentCopyIcon fontSize={iconSize} />
      </IconButton>
      <IconButton
        style={style}
        onClick={() => {
          if (props.frames.length === 1)
            new paper.Group({ visible: false }).insertAbove(
              props.frames[props.active]
            );
          props.frames[props.active].remove();

          const newActive = Math.max(
            0,
            Math.min(props.frames.length - 1, props.active - 1)
          );
          props.setActive(newActive);
          props.setx(-newActive * metric.frame.width + props.x_max);
          props.setFrames(window.FRAMELAYER.children.slice());
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
          color={props.onionSkin ? "secondary" : "disabled"}
        />
      </IconButton>
    </div>
  );
}
export default DopeSheet;
