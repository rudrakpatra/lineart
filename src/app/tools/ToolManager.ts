import paper from "paper";

export class Tool {
  add(toolManager: ToolManager) {
    //@ts-ignore
    toolManager.active = this;
  }
  /**called once when a pointer touches to surface */
  onTouchDown(e: paper.ToolEvent, touchEvent: TouchEvent): void {}

  /**called once when a pointer leaves the surface */
  onTouchRelease(e: paper.ToolEvent, touchEvent: TouchEvent): void {}
  /**called once after quick touch release*/
  onSingleTap(e: paper.ToolEvent, touchEvent: TouchEvent): void {}
  /**called once after quick touch release, touch and release */
  onDoupleTap(e: paper.ToolEvent, touchEvent: TouchEvent): void {}
  /**called every time the touched the pointer moves along the surface*/
  onSingleTouchMove(touch: paper.Point, e: paper.ToolEvent): void {}
  /**called every time the touched  the 2 pointers moves along the surface*/
  onDualTouchMove(
    touch1: paper.Point,
    touch2: paper.Point,
    e: paper.ToolEvent
  ): void {}
}
export default class ToolManager {
  private paperTool: paper.Tool;
  private quickTapTimeSpan: number;
  private quickTaps: number;
  active?: Tool[];

  constructor() {
    this.paperTool = new paper.Tool();
    this.paperTool.activate();
    this.quickTapTimeSpan = 250; //ms
    this.quickTaps = 0;
    this.paperTool.onMouseDown = (e: paper.ToolEvent) => {
      //@ts-ignore
      const te = e.event as TouchEvent;
      if (te.touches.length === 1) {
        this.quickTaps += 1;
        setTimeout(() => {
          this.quickTaps = 0;
        }, this.quickTapTimeSpan);
        this.active?.forEach((tool) => tool.onTouchDown(e, te));
      }
    };
    this.paperTool.onMouseUp = (e: paper.ToolEvent) => {
      //@ts-ignore
      const te = e.event as TouchEvent;
      this.active?.forEach((tool) => tool.onTouchRelease(e, te));
      switch (this.quickTaps) {
        case 1:
          this.active?.forEach((tool) => tool.onSingleTap(e, te));
          break;
        case 2:
          this.active?.forEach((tool) => tool.onDoupleTap(e, te));
          break;
      }
    };
    this.paperTool.onMouseDrag = (e: paper.ToolEvent) => {
      //@ts-ignore
      const te = e.event as TouchEvent;
      switch (te.touches.length) {
        case 1:
          this.active?.forEach((tool) =>
            tool.onSingleTouchMove(
              new paper.Point(te.touches[0].clientX, te.touches[0].clientY),
              e
            )
          );
          break;
        case 2:
          this.active?.forEach((tool) =>
            tool.onDualTouchMove(
              new paper.Point(te.touches[0].clientX, te.touches[0].clientY),
              new paper.Point(te.touches[1].clientX, te.touches[1].clientY),
              e
            )
          );
          break;
      }
    };
  }
}
