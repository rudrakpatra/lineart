import paper from "paper";
export default class Edit extends paper.Tool {
  item?: paper.Item;
  segment?: paper.Segment;
  strokeHit?: paper.HitResult;
  constructor() {
    super();
    this.onMouseDown = (e: paper.ToolEvent) => {
      paper.project.deselectAll();
      if (this.item) {
        this.segment = undefined;
        const hit = this.item.hitTest(e.point, {
          segments: true,
          stroke: true,
          tolerance: 20 / paper.view.zoom,
        });
        if (hit) {
          if (hit.type === "stroke") {
            const path = hit.item as paper.Path;
            this.segment = path.insert(hit.location.index + 1, hit.point);
          } else if (hit.type === "segment") {
            this.segment = hit.segment;
            paper.project.deselectAll();
            this.segment.selected = true;
            return;
          }
        }
      }
      this.item = undefined;
      const hitFill = paper.project.hitTest(e.point, {
        fill: true,
        tolerance: 15 / paper.view.zoom,
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
