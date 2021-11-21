import paper from "paper";
export default class Drag extends paper.Tool {
  item?: paper.Item;
  segment?: paper.Segment;
  constructor() {
    super();
    this.onMouseDown = (e: paper.ToolEvent) => {
      paper.project.deselectAll();
      if (this.item) {
        this.segment = undefined;
        const hitSegments = this.item.hitTest(e.point, {
          segments: true,
          tolerance: 30 / paper.view.zoom,
        });
        if (hitSegments) {
          if (hitSegments.type === "stroke") {
          } else if (hitSegments.type === "segment") {
            this.segment = hitSegments.segment;
            paper.project.deselectAll();
            this.segment.selected = true;
            return;
          }
        }
      }
      this.item = undefined;
      const hitFill = paper.project.hitTest(e.point, {
        fill: true,
        tolerance: 30 / paper.view.zoom,
      });
      if (hitFill?.item) {
        this.item = hitFill.item;
        this.item.selected = true;
        return;
      }
    };
    this.onMouseDrag = (e: paper.ToolEvent) => {
      if (this.segment) this.segment.point = this.segment.point.add(e.delta);
      else if (this.item) this.item.translate(e.delta);
    };
  }
}
