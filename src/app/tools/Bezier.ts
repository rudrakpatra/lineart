import paper from "paper";
import { reversibleAction } from "../LineArt";
import { Tool } from "./ToolManager";
export default class Bezier extends Tool {
  path?: paper.Path;
  target?: paper.Segment;
  targetType?: string;
  transparentColor: paper.Color;
  constructor() {
    super();
    this.transparentColor = new paper.Color("#009dec33");
    this.onCancellation = () => {
      if (this.path) {
        this.path.remove();
        this.path = undefined;
      }
    };
    this.onDoupleTap = () => {
      if (this.path) {
        this.path.data.fullyConfirmed = true;
        this.path.selected = false;
        //
        const path = this.path;
        const frame = window.ACTIVE_FRAME;
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
    };
    this.onTouchDown = (e: paper.ToolEvent) => {
      this.target = undefined;
      this.targetType = undefined;
      if (this.path?.fullySelected) this.getnearestSegmentOrHandle(e.point);
      else {
        this.path = new paper.Path({
          strokeCap: "round",
          miterLimit: 1,
          strokeWidth: 1,
          strokeColor: "black",
          opacity: 1,
        });
        window.ACTIVE_FRAME.addChild(this.path);
        this.path?.add(e.point);
        this.path?.add(e.point);
        this.path.fullySelected = true;
      }
    };
    this.onSingleTouchMove = (touch: paper.Point, e: paper.ToolEvent) => {
      if (this.path?.fullySelected) {
        if (this.target) {
          switch (this.targetType) {
            case "handleIn":
              this.target.handleIn = e.delta.add(this.target.handleIn);
              break;
            case "handleOut":
              this.target.handleOut = e.delta.add(this.target.handleOut);
              break;
            case "segment":
              this.target.point = this.target.point.add(e.delta);
              break;
          }
          // let angle;
          // switch (this.targetType) {
          //   case "handleIn":
          //     angle = this.target.handleIn.multiply(-1).angle;
          //     if (this.target.handleOut.length)
          //       this.target.handleOut.angle = angle;
          //     break;
          //   case "handleOut":
          //     angle = this.target.handleOut.multiply(-1).angle;
          //     if (this.target.handleIn.length)
          //       this.target.handleIn.angle = angle;
          //     break;
          // }
        } else {
          if (this.path && this.path.segments.length) {
            const [ptA, ptB] = this.path.segments;
            ptA.handleOut = ptA.handleOut.add(e.delta.multiply(0.25));
            ptB.handleIn = ptB.handleIn.add(e.delta.multiply(-0.25));
            ptB.point = ptB.point.add(e.delta);
          }
        }
      }
    };
    this.onDualTouchMove = () => {
      if (this.path && !this.path.data.confirmed) {
        this.path.remove();
        this.path = undefined;
      }
    };
    this.onTouchRelease = (e: paper.ToolEvent) => {
      if (this.path?.fullySelected) {
        this.path.data.confirmed = true;
        this.path.selectedColor = null;
      }
      // this.softenPath(4);
      // this.path.smooth();
    };
  }
  getnearestSegmentOrHandle(point: paper.Point) {
    let nearest = Infinity;
    if (this.path) {
      this.path.segments.forEach((segment) => {
        const p2s = point.subtract(segment.point).length;
        const p2i = point.subtract(segment.point.add(segment.handleIn)).length;
        const p2o = point.subtract(segment.point.add(segment.handleOut)).length;
        if (p2i < nearest && segment.handleIn.length > 0) {
          this.target = segment;
          this.targetType = "handleIn";
          nearest = p2i;
        }
        if (p2o < nearest && segment.handleOut.length > 0) {
          this.target = segment;
          this.targetType = "handleOut";
          nearest = p2o;
        }
        if (p2s < nearest) {
          this.target = segment;
          this.targetType = "segment";
          nearest = p2s;
        }
      });
    }
    if (this.path) this.path.selectedColor = this.transparentColor;
  }
}
