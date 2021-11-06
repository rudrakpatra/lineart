import React from "react";
import Button from "@mui/material/Button";
import Icon from "@mdi/react";
import { mdiFullscreen } from "@mdi/js";
import { mdiFullscreenExit } from "@mdi/js";

export default function ToggleFullScreen(props: { canvas: HTMLCanvasElement }) {
  const toggleFullScreen = (canvas: HTMLCanvasElement) => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setPath(mdiFullscreenExit);
        canvas.height = window.screen.height;
        canvas.width = window.screen.width;
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setPath(mdiFullscreen);
          canvas.height = window.innerHeight;
          canvas.width = window.innerWidth;
        });
      }
    }
  };
  const [path, setPath] = React.useState(
    !document.fullscreenElement ? mdiFullscreen : mdiFullscreenExit
  );
  return (
    <div style={{ position: "fixed", bottom: 10, right: 10 }}>
      {detectMob() ? (
        <Button
          id="toggleFullScreenButton"
          onClick={() => toggleFullScreen(props.canvas)}
          variant="contained"
        >
          <Icon path={path} size={1} />
        </Button>
      ) : (
        <></>
      )}
    </div>
  );
}
function detectMob() {
  const toMatch = [
    /Android/i,
    /webOS/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i,
  ];

  return toMatch.some((toMatchItem) => {
    return navigator.userAgent.match(toMatchItem);
  });
}
