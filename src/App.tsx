import React from "react";
import "./App.css";
import Tools from "./app/Tools";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import ToggleFullScreen from "./app/ToggleFullScreen";
import DopeSheet from "./app/components/DopeSheet";
import { setupLineArt } from "./app/LineArt";
import { blue, blueGrey } from "@mui/material/colors";
import UndoRedo from "./UndoRedo";
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
setupLineArt(canvas);

export const theme = createTheme({
  // here are default values in ms
  transitions: {
    duration: {
      shortest: 50,
      shorter: 100,
      short: 125,
      standard: 180,
      complex: 300,
      enteringScreen: 200,
      leavingScreen: 180,
    },
  },
  palette: { primary: blue, secondary: blueGrey },
});
function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <DopeSheet />
        <Tools />
        <UndoRedo />
        <ToggleFullScreen canvas={canvas} />
      </ThemeProvider>
    </div>
  );
}

export default App;
