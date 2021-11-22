import React, { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// import { mdiDragVariant } from "@mdi/js";
// import { mdiResize } from "@mdi/js";
// import { mdiLayersTriple } from "@mdi/js";
// import { mdiVectorSquareEdit } from "@mdi/js";
// import { mdiSelectionEllipse } from "@mdi/js";
import { mdiVectorBezier } from "@mdi/js";

// import { mdiPalette } from "@mdi/js";
import { mdiDraw } from "@mdi/js";

import Icon from "@mdi/react";
import { theme } from "../App";
import Draw from "./tools/Draw";
// import Edit from "./tools/Edit";
import Bezier from "./tools/Bezier";

const draw = new Draw();
// const edit = new Edit();
const beizer = new Bezier();
export default function Tools() {
  const items = [
    // new Item(mdiDragVariant, () => {}),
    // new Item(mdiResize, () => {}),
    // new Item(mdiLayersTriple, () => {}),
    // new Item(mdiSelectionEllipse, () => {}),
    // new Item(mdiVectorSquareEdit, () => {
    //   edit.activate();
    // }),
    new Item(mdiVectorBezier, () => {
      beizer.activate();
    }),
    new Item(mdiDraw, () => {
      draw.activate();
    }),
    // new Item(mdiPalette, () => {}),
  ];
  return <BasicMenu items={items} />;
}
class Item {
  onClick: Function;
  icon: JSX.Element;
  constructor(path: string, onClick: Function) {
    this.onClick = onClick;
    this.icon = <Icon path={path} size={1} />;
  }
}

function BasicMenu(props: { items: Item[] }) {
  let [active, setActive] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const closeMenu = () => {
    setAnchorEl(null);
  };

  return (
    <div style={{ position: "fixed", bottom: 10, left: 10 }}>
      <Button
        id="basic-button"
        aria-controls="basic-menu"
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          open ? closeMenu() : openMenu(e);
        }}
        color={"primary"}
        variant="contained"
      >
        {props.items[active].icon}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        open={open}
        transitionDuration={100}
        onClose={closeMenu}
        PaperProps={{
          style: {
            background: theme.palette.grey[200],
          },
        }}
        MenuListProps={{
          "aria-labelledby": "basic-button",
          style: {
            background: theme.palette.grey[200],
            color: theme.palette.common.black,
          },
        }}
      >
        {props.items.map((item, index) => (
          <MenuItem
            key={index}
            onClick={(e: any) => {
              setActive(index);
              item.onClick(e);
              closeMenu();
            }}
          >
            {item.icon}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
