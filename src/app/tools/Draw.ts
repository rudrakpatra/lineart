import paper from "paper";
export default class Draw extends paper.Tool {
  stroke?: paper.Path;
  onActivate: () => void;
  constructor() {
    super();
    this.onActivate = () => {
      paper.project.deselectAll();
    };
    this.onMouseDown = (e: paper.ToolEvent) => {
      console.log("sf");
      this.stroke = new paper.Path();
      window.ACTIVEFRAME.addChild(this.stroke);
      this.stroke.strokeColor = new paper.Color(0.5);
    };
    this.onMouseDrag = (e: paper.ToolEvent) => {
      if (this.stroke) this.stroke.add(e.point);
    };
    this.onMouseUp = (e: paper.ToolEvent) => {
      this.stroke?.smooth();
      this.stroke = undefined;
    };
  }
}
