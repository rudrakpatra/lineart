import paper from "paper";
import { Tool } from "./ToolManager";
export default class Select extends Tool {
  segment?: paper.Segment;
  constructor() {
    super();
    this.setup = () => {
      paper.settings.handleSize = 0;
      paper.project.deselectAll();
    };
    this.onTouchDown = (e: paper.ToolEvent) => {
      if (window.SELECTION) {
        window.SELECTION.selected = false;
        window.SELECTION.bounds.selected = false;
      }
      window.SELECTION = undefined;
      this.selectAtPoint(e.point);
    };
    this.onSingleTouchMove = (touch: paper.Point, e: paper.ToolEvent) => {
      if (window.SELECTION) {
        window.SELECTION.selected = false;
        window.SELECTION.bounds.selected = false;
      }

      window.SELECTION = undefined;
      this.selectAtPoint(e.point);
    };
    this.onDualTouchMove = () => {
      if (window.SELECTION && !window.SELECTION.data.confirmed) {
        window.SELECTION.selected = false;
      }
    };
  }
  selectAtPoint(point: paper.Point) {
    const hit = window.ACTIVE_FRAME.hitTest(point, {
      fill: true,
      tolerance: 4 / paper.view.zoom,
    });
    if (hit) {
      if (hit.type === "stroke" || hit.type === "segment") {
        window.ACTIVE_FRAME.selected = false;
        const item = hit.item;
        item.selected = true;
        window.SELECTION = item;
      }
    }
  }
}
