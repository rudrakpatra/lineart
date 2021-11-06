import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import { mdiResize } from "@mdi/js";
import { mdiLayersTriple } from "@mdi/js";
import { mdiVectorPolylineEdit } from "@mdi/js";
import { mdiPalette } from "@mdi/js";
import { mdiDraw } from "@mdi/js";
import { mdiSelectionEllipse } from "@mdi/js";
import Icon from "@mdi/react";

export default function Tools() {
  const items = [
    new Item(mdiResize, () => {
      console.log("resize", window.LineArt);
    }),
    new Item(mdiLayersTriple, () => {
      console.log("layers", window.LineArt);
    }),
    new Item(mdiSelectionEllipse, () => {
      console.log("selection", window.LineArt);
    }),
    new Item(mdiVectorPolylineEdit, () => {
      console.log("polylineEdit", window.LineArt);
    }),
    new Item(mdiDraw, () => {
      console.log("draw", window.LineArt);
    }),
    new Item(mdiPalette, () => {
      console.log("palette", window.LineArt);
    }),
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
  let [active, setActive] = React.useState(0);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
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
        onClick={openMenu}
        variant="contained"
      >
        {props.items[active].icon}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={closeMenu}
        MenuListProps={{
          "aria-labelledby": "basic-button",
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
