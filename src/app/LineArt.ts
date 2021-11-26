import paper from "paper";
declare global {
  interface Window {
    GUI_LAYER: paper.Layer;
    FRAME_LAYER: paper.Layer;
    ACTIVE_FRAME: paper.Group;
    CURRENT: number;
    UPDATE: {
      undoRedo?: Function;
    };
  }
}
export class State {
  undo?: () => void;
  redo?: () => void;
  constructor(undo?: () => void, redo?: () => void) {
    this.undo = undo;
    this.redo = redo;
  }
}
export function setupLineArt(canvas: HTMLCanvasElement) {
  paper.project = new paper.Project(canvas);
  paper.settings.handleSize = 10;
  window.FRAME_LAYER = new paper.Layer({ data: { frameLayer: true } });
  window.ACTIVE_FRAME = new paper.Group({
    visible: true,
    data: { history: [new State()], current: 0 },
  });
  window.GUI_LAYER = new paper.Layer({ data: { guiLayer: true } });
  window.UPDATE = {};
}
