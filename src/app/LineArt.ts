export default class LineArt {
  ctx: CanvasRenderingContext2D;
  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.ctx.canvas.onresize = (e) => {
      this.update();
    };
  }
  update() {
    console.log("update");
    this.ctx.beginPath();
    this.ctx.moveTo(10, 10);
    this.ctx.lineTo(100, 10);
    this.ctx.stroke();
  }
}
