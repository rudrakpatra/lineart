import { Fullscreen } from "@mui/icons-material";
import React from "react";
import "./App.css";
import LineArt from "./app/LineArt";

import Tools from "./app/Tools";
import ToggleFullScreen from "./app/ToggleFullScreen";
function App() {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d");
  if (ctx) new LineArt(ctx);
  else console.error("no renderering context found");
  console.log("App");
  return (
    <div className="App">
      <Tools />
      <ToggleFullScreen canvas={canvas} />
    </div>
  );
}

export default App;
