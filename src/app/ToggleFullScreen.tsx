import React from "react";
import Button from "@mui/material/Button";
import Icon from "@mdi/react";
import { mdiFullscreen } from "@mdi/js";
import { mdiFullscreenExit } from "@mdi/js";

export default function ToggleFullScreen(props: { canvas: HTMLCanvasElement }) {
  const toggleFullScreen = (canvas: HTMLCanvasElement) => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    document.documentElement.onfullscreenchange = (ev: Event) => {
      setPath(document.fullscreenElement ? mdiFullscreenExit : mdiFullscreen);
    };
  };
  const [path, setPath] = React.useState(
    !document.fullscreenElement ? mdiFullscreen : mdiFullscreenExit
  );
  return (
    <div style={{ position: "fixed", bottom: 10, right: 10 }}>
      {detectMobile() ? (
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
function detectMobile() {
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
