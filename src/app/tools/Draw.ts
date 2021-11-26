import paper from "paper";
import { State } from "../LineArt";
import { Tool } from "./ToolManager";
export default class Draw extends Tool {
  path?: paper.Path;
  target?: paper.Segment;
  targetType?: string;
  transparentColor: paper.Color;
  constructor() {
    super();
    this.transparentColor = new paper.Color("#009dec33");
    this.onDoupleTap = () => {
      if (this.path) {
        this.path.selected = false;
        this.path = undefined;
      }
    };
    this.onTouchDown = (e: paper.ToolEvent) => {
      this.path = new paper.Path({
        strokeCap: "round",
        miterLimit: 1,
        strokeWidth: 1,
        strokeColor: "black",
        opacity: 1,
      });
      this.path.add(e.point);
      window.ACTIVE_FRAME.addChild(this.path);
    };
    this.onSingleTouchMove = (touch: paper.Point, e: paper.ToolEvent) => {
      if (this.path) {
        if (e.point.subtract(this.path.lastSegment.point).length > 10)
          this.path.add(e.point);
      }
    };
    this.onDualTouchMove = () => {
      if (this.path && !this.path.data.confirmed) {
        this.path.remove();
        this.path = undefined;
      }
    };
    this.onTouchRelease = (e: paper.ToolEvent) => {
      if (this.path) {
        //
        this.softenPath(4);
        this.path?.smooth();
        const path = this.path;
        const frame = window.ACTIVE_FRAME;
        frame.data.history = frame.data.history.slice(
          0,
          frame.data.current + 1
        );
        frame.data.history[frame.data.current].redo = () => {
          frame.addChild(path);
        };
        frame.data.history.push(new State());
        frame.data.current += 1;
        frame.data.history[frame.data.current].undo = () => {
          path.remove();
        };
        window.UPDATE.undoRedo && window.UPDATE.undoRedo();
        this.path = undefined;
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
