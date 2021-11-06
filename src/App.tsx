import React from "react";
import "./App.css";
import { setupLineArt } from "./app/LineArt";

import Tools from "./app/Tools";
import ToggleFullScreen from "./app/ToggleFullScreen";
function App() {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  setupLineArt(canvas);
  console.log("App");
  return (
    <div className="App">
      <Tools />
      <ToggleFullScreen canvas={canvas} />
    </div>
  );
}

export default App;
