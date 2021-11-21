import { Paper } from "@material-ui/core";
import paper from "paper";
import Icon from "@mdi/react";
import React, { createContext, useEffect, useRef, useState } from "react";
import { theme } from "../../App";
import {
  mdiDelete,
  mdiPause,
  mdiPlay,
  mdiTransitionMasked,
  mdiContentDuplicate,
  mdiRefresh,
  mdiPlusBox,
} from "@mdi/js";
class Metric {
  frame: { height: number; width: number };
  constructor() {
    this.frame = { height: 30, width: 60 };
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

  setTimeout(() => {
    if (frames.length > 1) {
      if (playing && (active + 1 < frames.length || loopingAnimation))
        setActive((active + 1) % frames.length);
    }
  }, 1000 / 24);
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
  const padding = theme.spacing(1);
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
  const iconSize = 2;
  const activeColor = theme.palette.secondary.main;
  const standardColor = theme.palette.grey[500];
  return (
    <div
      style={{
        display: "flex",
        userSelect: "none",
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center" }}
        onClick={() => {
          props.setPlaying(!props.playing);
        }}
      >
        <Icon
          path={props.playing ? mdiPause : mdiPlay}
          size={iconSize}
          color={standardColor}
        />
      </div>
      <div
        style={{ display: "flex", alignItems: "center" }}
        onClick={() => {
          props.setLoopingAnimation(!props.loopingAnimation);
        }}
      >
        <Icon
          path={mdiRefresh}
          size={iconSize}
          rotate={180}
          color={props.loopingAnimation ? activeColor : standardColor}
        />
      </div>
      <hr style={{ border: "none" }} />
      <div
        style={{ display: "flex", alignItems: "center" }}
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
        <Icon path={mdiPlusBox} size={iconSize} color={standardColor} />
      </div>
      <div
        style={{ display: "flex", alignItems: "center" }}
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
        <Icon
          path={mdiContentDuplicate}
          size={iconSize}
          color={standardColor}
        />
      </div>
      <div
        style={{ display: "flex", alignItems: "center" }}
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
        <Icon path={mdiDelete} size={iconSize} color={standardColor} />
      </div>
      <div
        style={{ display: "flex", alignItems: "center" }}
        onClick={() => {
          props.setOnionSkin(!props.onionSkin);
        }}
      >
        <Icon
          path={mdiTransitionMasked}
          size={iconSize}
          color={props.onionSkin ? activeColor : standardColor}
        />
      </div>
    </div>
  );
}
export default DopeSheet;
