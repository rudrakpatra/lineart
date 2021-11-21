import paper from "paper";
export default class Bezier extends paper.Tool {
  bezierStroke?: paper.Path;
  segmentA?: paper.Segment;
  segmentB?: paper.Segment;
  step: number;
  onActivate: () => void;
  constructor() {
    super();
    this.onActivate = () => {
      paper.project.deselectAll();
    };
    this.step = 0;
    this.onMouseDown = (e: paper.ToolEvent) => {
      switch (this.step) {
        case 0:
          this.bezierStroke = new paper.Path();
          window.ACTIVEFRAME.addChild(this.bezierStroke);
          this.bezierStroke.strokeColor = new paper.Color(1, 0, 0);
          this.bezierStroke.add(e.point);
          this.bezierStroke.add(e.point);
          this.segmentA = this.bezierStroke.segments[0];
          this.segmentB = this.bezierStroke.segments[1];
      }
    };
    this.onMouseDrag = (e: paper.ToolEvent) => {
      switch (this.step) {
        case 0:
          if (this.segmentB) this.segmentB.point = e.point;
          break;
        case 1:
          if (this.segmentA)
            this.segmentA.handleOut = this.segmentA.handleOut.add(e.delta);
          break;
        case 2:
          if (this.segmentB)
            this.segmentB.handleIn = this.segmentB.handleIn.add(e.delta);
      }
    };
    this.onMouseUp = (e: paper.ToolEvent) => {
      this.step = (this.step + 1) % 3;
      this.bezierStroke = undefined;
    };
  }
}
