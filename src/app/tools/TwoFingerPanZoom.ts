import { Tool } from "./ToolManager";
import paper from "paper";
export default class TwoFingerPanZoom extends Tool {
  lastDist?: number;
  lastCenter?: paper.Point;
  constructor() {
    super();
    this.onDualTouchMove = (
      touch1: paper.Point,
      touch2: paper.Point,
      e: paper.ToolEvent
    ) => {
      const newCenter = touch1.add(touch2).multiply(0.5);
      if (!this.lastCenter) {
        this.lastCenter = touch1.add(touch2).multiply(0.5);
      }
      const dist = touch1.subtract(touch2).length;
      if (!this.lastDist) {
        this.lastDist = dist;
      }

      const scale = dist / this.lastDist;
      const delta = newCenter.subtract(this.lastCenter);
      paper.view.scale(scale, paper.view.viewToProject(newCenter));
      paper.view.translate(delta.multiply(1 / paper.view.zoom));
      this.lastCenter = newCenter;
      this.lastDist = dist;
    };
    this.onTouchRelease = () => {
      this.lastDist = undefined;
      this.lastCenter = undefined;
    };
  }
}
