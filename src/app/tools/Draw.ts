import paper from "paper";
import { reversibleAction } from "../LineArt";
import { Tool } from "./ToolManager";
export default class Draw extends Tool {
  path?: paper.Path;
  raster?: paper.Raster;
  constructor() {
    super();

    this.onTouchDown = (e: paper.ToolEvent) => {
      this.path = new paper.Path({
        strokeJoin: "round",
        strokeCap: "round",
        miterLimit: 1,
        strokeWidth: 1,
        strokeColor: "black",
        opacity: 1,
        // selected: true,
      });
      this.path.add(e.point);
      window.ACTIVE_FRAME.addChild(this.path);
    };
    this.onSingleTouchMove = (touch: paper.Point, e: paper.ToolEvent) => {
      if (this.path) {
        if (
          e.point.subtract(this.path.lastSegment.previous?.point).length >
          3 / paper.view.zoom
        ) {
          this.path.add(e.point);
        } else this.path.lastSegment.point = e.point;
        this.path.smooth();
      }
    };
    this.onDualTouchMove = () => {
      if (this.path && !this.path.data.confirmed) {
        this.path.remove();
        this.path = undefined;
      }
    };
    this.onCancellation = () => {
      if (this.path) {
        this.path.remove();
        this.path = undefined;
      }
    };
    this.onTouchRelease = (e: paper.ToolEvent) => {
      if (this.path) {
        this.path.smooth();
        const frame = window.ACTIVE_FRAME;
        const path = this.path;

        reversibleAction(
          frame,
          () => {
            // console.log(last_raster.id, "to", raster.id);
            frame.addChild(path);
          },
          () => {
            // console.log(raster.id, "to", last_raster.id);
            path.remove();
          }
        );
        // frame.selected = true;
        this.path = undefined;
        // console.log(frame.children);
      }
    };
  }
  softenPath(iterations: number) {
    for (let i = 0; i < iterations; i += 1) {
      this.path?.segments.forEach((segment) => {
        if (segment.previous && segment.next)
          segment.point = segment.previous.point
            .add(segment.next.point)
            .multiply(0.5);
      });
    }
  }
}
