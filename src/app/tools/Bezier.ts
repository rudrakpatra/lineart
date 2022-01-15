import paper from "paper";
import { reversibleAction } from "../LineArt";
import { Tool } from "./ToolManager";
export default class Bezier extends Tool {
  path?: paper.Path;
  copy?: paper.Path;
  target?: paper.Segment;
  targetType?: string;
  transparentColor: paper.Color;
  constructor() {
    super();
    this.transparentColor = new paper.Color("#009dec33");
    this.setup = () => {
      paper.settings.handleSize = 10;
      const selection = window.SELECTION;
      if (selection && selection.className === "Path") {
        this.copy = selection as paper.Path;
        this.path = selection.clone() as paper.Path;
        this.path.fullySelected = true;

        selection.remove();
        window.SELECTION = undefined;
      }
    };
    this.onCancellation = this.cancelPath;
    this.onDoupleTap = this.commitPath;
    this.onTouchDown = (e: paper.ToolEvent) => {
      this.target = undefined;
      this.targetType = undefined;
      if (this.path?.visible && this.path?.fullySelected)
        this.setTargetType(e.point);
      else {
        this.path = new paper.Path({
          miterLimit: 1,
          strokeWidth: 4,
          strokeColor: window.LINECOLOR,
          strokeCap: "round",
          strokeJoin: "round",
          fillColor: window.LINECOLOR,
          strokeScaling: true,
          opacity: 1,
          closed: true,
        });
        this.copy = undefined;
        window.ACTIVE_FRAME.addChild(this.path);
        this.path.add(e.point);
        this.path.add(e.point);
        const [pt1, pt2] = this.path.segments;
        pt1.handleIn = new paper.Point(0, 0);
        pt1.handleOut = new paper.Point(0, 0);
        pt2.handleIn = new paper.Point(0, 0);
        pt2.handleOut = new paper.Point(0, 0);
        this.path.fullySelected = true;
      }
    };

    /**
     *point   A-- B handle Out from A
     *        |   \
     *        |    \
     *handle C|_____D point
     */
    this.onSingleTouchMove = (touch: paper.Point, e: paper.ToolEvent) => {
      if (this.path?.visible && this.path?.fullySelected) {
        if (this.targetType) {
          const [pt1, pt2] = this.path.segments;
          let lastAngle, angle;
          let lastLength, length;
          switch (this.targetType) {
            case "a":
              lastAngle = pt1.point.subtract(pt2.point).angle;
              lastLength = pt2.point.subtract(pt1.point).length;
              pt1.point = pt1.point.add(e.delta);
              angle = pt1.point.subtract(pt2.point).angle;
              length = pt2.point.subtract(pt1.point).length;
              pt1.handleIn.angle += angle - lastAngle;
              pt1.handleOut.angle += angle - lastAngle;
              pt1.handleIn.length *= length / lastLength;
              pt1.handleOut.length *= length / lastLength;
              pt2.handleIn = pt1.point.add(pt1.handleOut).subtract(pt2.point);
              pt2.handleOut = pt1.point.add(pt1.handleIn).subtract(pt2.point);
              break;
            case "b":
              pt1.handleOut = pt1.handleOut.add(e.delta);
              pt2.handleIn = pt2.handleIn.add(e.delta);
              break;
            case "c":
              pt1.handleIn = pt1.handleIn.add(e.delta);
              pt2.handleOut = pt2.handleOut.add(e.delta);
              break;
            case "d":
              lastAngle = pt2.point.subtract(pt1.point).angle;
              lastLength = pt2.point.subtract(pt1.point).length;
              pt2.point = pt2.point.add(e.delta);
              angle = pt2.point.subtract(pt1.point).angle;
              length = pt2.point.subtract(pt1.point).length;
              pt2.handleIn.angle += angle - lastAngle;
              pt2.handleOut.angle += angle - lastAngle;
              pt2.handleIn.length *= length / lastLength;
              pt2.handleOut.length *= length / lastLength;
              pt1.handleIn = pt2.point.add(pt2.handleOut).subtract(pt1.point);
              pt1.handleOut = pt2.point.add(pt2.handleIn).subtract(pt1.point);
              break;
          }
        } else {
          if (this.path && this.path.segments.length) {
            const [pt1, pt2] = this.path.segments;
            const mid = pt1.point.add(pt2.point).multiply(0.5);
            pt2.point = pt2.point.add(e.delta);
            pt1.handleIn = mid.subtract(pt1.point);
            pt1.handleOut = mid.subtract(pt1.point);
            pt2.handleIn = mid.subtract(pt2.point);
            pt2.handleOut = mid.subtract(pt2.point);
          }
        }
      }
    };
    this.onDualTouchMove = () => {
      this.cancelPath();
    };
    this.onTouchRelease = (e: paper.ToolEvent) => {
      if (this.path?.visible && this.path?.fullySelected) {
        const [pt1, pt2] = this.path.segments;
        const length = pt2.point.subtract(pt1.point).length;
        if (length == 0) this.cancelPath();
        else {
          this.path.data.confirmed = true;
          this.path.selectedColor = null;
        }
      }
      // this.softenPath(4);
      // this.path.smooth();
    };
  }
  setTargetType(point: paper.Point) {
    let nearest = Infinity;
    if (this.path) {
      const [pt1, pt2] = this.path.segments;
      const a = pt1.point.subtract(point).length;
      const b = pt1.point.add(pt1.handleOut).subtract(point).length;
      const c = pt1.point.add(pt1.handleIn).subtract(point).length;
      const d = pt2.point.subtract(point).length;
      if (nearest > a * 1.2) {
        nearest = a;
        this.targetType = "a";
      }
      if (nearest > b) {
        nearest = b;
        this.targetType = "b";
      }
      if (nearest > c) {
        nearest = c;
        this.targetType = "c";
      }
      if (nearest > d * 1.2) {
        nearest = d;
        this.targetType = "d";
      }
    }
    if (this.path) this.path.selectedColor = this.transparentColor;
  }
  commitPath() {
    if (this.path) {
      this.path.data.fullyConfirmed = true;
      this.path.selected = false;
      //
      const path = this.path;
      const frame = window.ACTIVE_FRAME;
      const lastPath = this.copy;
      if (lastPath) {
        reversibleAction(
          frame,
          () => {
            path.selected = false;
            lastPath.remove();
            frame.addChild(path);
          },
          () => {
            lastPath.selected = false;
            path.remove();
            frame.addChild(lastPath);
          }
        );
      } else
        reversibleAction(
          frame,
          () => {
            frame.addChild(path);
          },
          () => {
            path.remove();
          }
        );
      this.path = undefined;
    }
  }
  cancelPath() {
    if (this.path && !this.path.data.confirmed) {
      this.copy = undefined;
      if (this.path?.visible && this.path?.fullySelected) {
        this.path.remove();
        this.path = undefined;
      }
    }
  }
}
