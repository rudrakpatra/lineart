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
export const newFrame = () => {
  return new paper.Group({
    visible: false,
    data: { history: [new State()], current: 0 },
  });
};
export const reversibleAction = (
  frame: paper.Group,
  action: () => void,
  undo_action?: () => void
) => {
  frame.data.history = frame.data.history.slice(0, frame.data.current + 1);
  frame.data.history.push(new State());
  frame.data.history[frame.data.current].redo = action;
  frame.data.history.push(new State());
  frame.data.current += 1;
  frame.data.history[frame.data.current].undo = undo_action;
  window.UPDATE.undoRedo && window.UPDATE.undoRedo();
  action();
};
class State {
  undo?: () => void;
  redo?: () => void;
  constructor(undo?: () => void, redo?: () => void) {
    this.undo = undo;
    this.redo = redo;
  }
}
