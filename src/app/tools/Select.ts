import paper from "paper";
export default class Select extends paper.Tool {
  segment?: paper.Segment;
  constructor() {
    super();
    this.onMouseDrag = (e: paper.ToolEvent) => {
      const hit = window.ACTIVE_FRAME.hitTest(e.point, {
        segments: true,
        stroke: true,
        tolerance: 30 / paper.view.zoom,
      });
      if (hit) {
        if (hit.type === "stroke" || hit.type === "segment") {
          const item = hit.item;
          item.selected = true;
        }
      }
    };
  }
}
