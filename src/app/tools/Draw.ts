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
      //@ts-ignore
      const touches = e.event.touches as TouchList;
      if (touches.length > 1) return;
      console.log(e);
      this.stroke = new paper.Path();
      window.ACTIVEFRAME.addChild(this.stroke);
      this.stroke.strokeColor = new paper.Color(0.5);
    };
    this.onMouseDrag = (e: paper.ToolEvent) => {
      //@ts-ignore
      const touches = e.event.touches as TouchList;
      if (touches.length > 1) return;
      if (this.stroke) this.stroke.add(e.point);
    };
    this.onMouseUp = (e: paper.ToolEvent) => {
      //@ts-ignore
      const touches = e.event.touches as TouchList;
      if (touches.length > 1) return;
      this.stroke?.smooth();
      this.stroke?.simplify(50);
      this.stroke = undefined;
    };
  }
}
