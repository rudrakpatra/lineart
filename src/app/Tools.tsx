import React, { useState } from "react";
// import IconButton from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ButtonGroup from "@mui/material/ButtonGroup";

// import { mdiDragVariant } from "@mdi/js";
// import { mdiResize } from "@mdi/js";
// import { mdiLayersTriple } from "@mdi/js";
// import { mdiVectorSquareEdit } from "@mdi/js";
import { mdiCursorPointer } from "@mdi/js";

// import { mdiPalette } from "@mdi/js";
import { mdiVectorBezier } from "@mdi/js";

import Icon from "@mdi/react";
import { theme } from "../App";
import ToolManager from "./tools/ToolManager";

import paper from "paper";

import TwoFingerPanZoom from "./tools/TwoFingerPanZoom";
import Bezier from "./tools/Bezier";
import Select from "./tools/Select";
declare global {
  interface Window {
    TOOLMANAGER: ToolManager;
    TOOLS: ToolList;
    LINECOLOR: paper.Color;
  }
}
class ToolList {
  bezier: Bezier;
  select: Select;
  twoFingerPanZoom: TwoFingerPanZoom;
  constructor() {
    this.bezier = new Bezier();
    this.select = new Select();
    this.twoFingerPanZoom = new TwoFingerPanZoom();
  }
}
window.TOOLMANAGER = new ToolManager();
window.TOOLS = new ToolList();
window.LINECOLOR = new paper.Color("#243e4a");
export default function Tools() {
  const tools = window.TOOLS;
  window.TOOLMANAGER.active = [tools.select, tools.twoFingerPanZoom];
  const items = [
    // new Item(mdiDragVariant, () => {}),
    // new Item(mdiResize, () => {}),
    // new Item(mdiLayersTriple, () => {}),
    new Item(mdiCursorPointer, () => {
      tools.select.setup();
      window.dispatchEvent(window.onToolCancellation);
      window.TOOLMANAGER.active = [tools.select, tools.twoFingerPanZoom];
    }),
    // // new Item(mdiVectorSquareEdit, () => {
    // //   edit.activate();
    // // }),
    new Item(mdiVectorBezier, () => {
      window.dispatchEvent(window.onToolCancellation);
      tools.bezier.setup();
      window.TOOLMANAGER.active = [tools.bezier, tools.twoFingerPanZoom];
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
