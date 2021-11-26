import React, { useState } from "react";
// import IconButton from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ButtonGroup from "@mui/material/ButtonGroup";

// import { mdiDragVariant } from "@mdi/js";
// import { mdiResize } from "@mdi/js";
// import { mdiLayersTriple } from "@mdi/js";
// import { mdiVectorSquareEdit } from "@mdi/js";
// import { mdiSelectionEllipse } from "@mdi/js";

// import { mdiPalette } from "@mdi/js";
import { mdiVectorBezier } from "@mdi/js";
import { mdiDraw } from "@mdi/js";

import Icon from "@mdi/react";
import { theme } from "../App";
import ToolManager from "./tools/ToolManager";

import Draw from "./tools/Draw";
import Bezier from "./tools/Bezier";
import TwoFingerPanZoom from "./tools/TwoFingerPanZoom";
import paper from "paper";
declare global {
  interface Window {
    TOOLMANAGER: ToolManager;
    TOOLS: ToolList;
  }
}
class ToolList {
  draw: Draw;
  bezier: Bezier;
  twoFingerPanZoom: TwoFingerPanZoom;
  constructor() {
    this.draw = new Draw();
    this.bezier = new Bezier();
    this.twoFingerPanZoom = new TwoFingerPanZoom();
  }
}
window.TOOLMANAGER = new ToolManager();
window.TOOLS = new ToolList();
export default function Tools() {
  const tools = window.TOOLS;
  window.TOOLMANAGER.active = [tools.bezier, tools.twoFingerPanZoom];
  const items = [
    // new Item(mdiDragVariant, () => {}),
    // new Item(mdiResize, () => {}),
    // new Item(mdiLayersTriple, () => {}),
    // new Item(mdiSelectionEllipse, () => {
    //   select.activate();
    // }),
    // // new Item(mdiVectorSquareEdit, () => {
    // //   edit.activate();
    // // }),
    new Item(mdiVectorBezier, () => {
      window.TOOLMANAGER.active = [tools.bezier, tools.twoFingerPanZoom];
    }),
    new Item(mdiDraw, () => {
      paper.project.deselectAll();
      window.TOOLMANAGER.active = [tools.draw, tools.twoFingerPanZoom];
    }),
    // new Item(mdiPalette, () => {}),
  ];
  return <ButtonGroupMenu items={items} />;
}
class Item {
  onClick: Function;
  icon: JSX.Element;
  constructor(path: string, onClick: Function) {
    this.onClick = onClick;
    this.icon = <Icon path={path} size={1} />;
  }
}

function ButtonGroupMenu(props: { items: Item[] }) {
  let [active, setActive] = useState(0);
  return (
    <div style={{ position: "fixed", bottom: 10, left: 10 }}>
      <ButtonGroup
        orientation="vertical"
        variant="contained"
        style={{
          background: theme.palette.grey[100],
          color: theme.palette.common.black,
        }}
      >
        {props.items.map((item, index) => (
          <IconButton
            key={index}
            color={index === active ? "primary" : "secondary"}
            size={"large"}
            onClick={(e: any) => {
              setActive(index);
              item.onClick(e);
            }}
          >
            {item.icon}
          </IconButton>
        ))}
      </ButtonGroup>
    </div>
  );
}
