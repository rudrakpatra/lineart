import paper from "paper";
declare global {
  interface Window {
    GUILAYER: paper.Layer;
    FRAMELAYER: paper.Layer;
    ACTIVEFRAME: paper.Group;
  }
}
export function setupLineArt(canvas: HTMLCanvasElement) {
  window.screen.orientation.lock("portrait");
  paper.project = new paper.Project(canvas);
  paper.settings.handleSize = 8;
  window.FRAMELAYER = new paper.Layer({ data: { frameLayer: true } });
  window.ACTIVEFRAME = new paper.Group({ visible: true });

  // var from = new Point(paper.view.center);
  // var to = new Point(paper.view.center.x + 60, paper.view.center.y + 60);
  // var shape = new paper.Path.Rectangle(from, to);
  // shape.fillColor = new Color(0);
  // shape.strokeWidth = 1;
  // shape.strokeColor = new Color(0);
  // shape.clone();
}
