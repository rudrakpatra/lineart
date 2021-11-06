declare global {
  interface Window {
    LineArt: LineArt;
  }
}
/**
 * adds LineArt to window
 * @param canvas canvas element
 */
export function setupLineArt(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (ctx) window.LineArt = new LineArt(ctx);
  else console.error("no renderering context found");
}
export default class LineArt {
  ctx: CanvasRenderingContext2D;
  lines: Line[];
  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.lines = [];
    window.onresize = (e) => {
      this.fullscreen();
    };
    this.ctx.canvas.onmousemove = (e: MouseEvent) => {
      if (e.buttons === 1) {
        //
      }
    };
    this.fullscreen();
  }
  fullscreen() {
    this.ctx.canvas.width = window.innerWidth;
    this.ctx.canvas.height = window.innerHeight;
    this.update();
  }
  update() {
    console.log("update");
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(10, 100);
    this.ctx.lineTo(100, 10);
    this.ctx.stroke();
    this.ctx.lineWidth = 1;
    this.ctx.moveTo(110, 75);
    this.ctx.arc(100, 75, 10, 0, 2 * Math.PI);
    this.ctx.stroke();
  }
}
class Line {
  segments: Segment[];
  constructor() {
    this.segments = [];
  }
  add(segment: Segment) {
    this.segments.push(segment);
  }
}
class Segment {
  point: Point;
  handleIn?: Point;
  handleOut?: Point;
  constructor(point: Point) {
    this.point = point;
  }
}
class Point {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
