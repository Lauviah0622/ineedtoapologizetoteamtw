import Yoga, {
  Edge,
  FlexDirection,
  Wrap,
  PositionType,
  Direction,
  Gutter,
  Justify,
} from 'yoga-layout';
import Konva from 'konva';

type Rect = {
  width: number;
  height: number;
};

export const getArrangedTexts = (
  chars: Rect[],
  config: {
    width: number;
    // height: number,
  }
) => {
  const root = Yoga.Node.create();
  root.setFlexDirection(FlexDirection.Row);
  root.setWidth(config.width);
  // root.setHeight(config.height);
  root.setFlexWrap(Wrap.Wrap);
  root.setGap(Gutter.Row, 1);
  root.setGap(Gutter.Column, 1);
  root.setJustifyContent(Justify.Center);

  const children = [];
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    const child = Yoga.Node.create();
    child.setHeight(c.height);
    child.setWidth(c.width);
    root.insertChild(child, i);

    children.push(child);
  }

  root.calculateLayout(config.width, undefined, Direction.LTR);

  return children.map((child) => {
    return {
      left: child.getComputedLeft(),
      top: child.getComputedTop(),
    };
  });
};

export const getTextsWidth = (
  text: string,
  { fontSize }: { fontSize: number }
) => {
  return Array.from(text).map((char, index) => {
    const instance = new Konva.Text({
      text: char,
      fontSize: fontSize,
      lineHeight: 1.3,
    });

    return {
      text: char,
      index: index,
      width: instance.getTextWidth(),
      height: instance.height(),
    };
  });
};

export const getLines = (
  rects: Rect[],
  positions: { left: number; top: number }[],
  spans: [number, number][]
) => {
  const lines = [];

  for (const [from, to] of spans) {
    let start = from;
    let pStartX: number;
    let pStartY: number;
    const OFFSET = -5;

    for (let i = start; i <= to; i++) {
      const r = rects[i];
      const p = positions[i];


      const point = [p.left, p.top + r.height + OFFSET] as const;

      if (i === start) {
        pStartX = point[0];
        pStartY = point[1];
        continue;
      }

      const rectPrev = rects[i - 1];
      const posPrev = positions[i - 1];
      const pPrev = [
        posPrev.left + rectPrev.width,
        posPrev.top + rectPrev.height + OFFSET,
      ] as const;


      if (i === to ) {
        lines.push([
          pStartX!,
          pStartY!,
          pPrev[0],
          pPrev[1],
        ]);
        continue;
      }

      
      if (point[1] !== pStartY!) {
        lines.push([pStartX!, pStartY!, pPrev[0], pPrev[1]]);

        pStartX = point[0];
        pStartY = point[1];
      }
    }
  }

  return lines;
};


export const calcListItemPos = () => {

}