import React from "react";
import "./App.css";
import Tools from "./app/Tools";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import ToggleFullScreen from "./app/ToggleFullScreen";
import DopeSheet from "./app/components/DopeSheet";
import { setupLineArt } from "./app/LineArt";
import { orange } from "@material-ui/core/colors";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
setupLineArt(canvas);

export const theme = createTheme({
  // here are default values in ms
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
  },
  palette: { secondary: orange },
});
function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <DopeSheet />
        <Tools />
        <ToggleFullScreen canvas={canvas} />
      </ThemeProvider>
    </div>
  );
}

export default App;
