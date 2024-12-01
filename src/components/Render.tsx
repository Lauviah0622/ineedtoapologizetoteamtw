import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ComponentProps,
} from 'react';
import { createRoot } from 'react-dom/client';
import {
  Stage,
  Layer,
  Rect,
  Text,
  Image as CanvaImage,
  Group,
  Path,
  Line,
} from 'react-konva';
import { type Apology, type Reason } from './New';
import React from 'react';

import Konva from 'konva';
import { getTextsWidth, getArrangedTexts, getLines } from './getSpepraterText';

const Canvas = ({
  data,
  height,
  width,
  canvasRef,
  container,
  containerWidth,
  containerHeight,
}: {
  data: Apology;
  width: number;
  height: number;
  canvasRef: any;
  containerHeight: number;
  containerWidth: number;
  container: string;
}) => {
  const pH = (c: number) => height * c * 0.01;
  const pW = (c: number) => width * c * 0.01;
  const ch = (c: number = 1) => (c * width) / 30;

  const Paragraph = React.forwardRef<
    typeof Text,
    {
      x: number;
      y: number;
      width?: number;
      children: string;
      align?: ComponentProps<typeof Text>['align'];
      textDecoration?: ComponentProps<typeof Text>['textDecoration'];
      offsetX?: ComponentProps<typeof Text>['offsetX'];
    }
  >(({ x, y, width = pW(37), children, align = 'left', offsetX }, ref) => {
    return (
      <Text
        ref={ref as any}
        text={children}
        x={x}
        y={y}
        width={width}
        fontSize={ch()}
        lineHeight={ch(0.06)}
        align={align}
        offsetX={offsetX}
      />
    );
  });

  const Checkbox = ({
    x,
    y,
    checked,
  }: {
    x: number;
    y: number;
    checked: boolean;
  }) => {
    const strokeWidth = ch(0.13);
    return (
      <Group x={pW(x)} y={pH(y)} scaleX={0.8} scaleY={0.8}>
        <Rect
          width={ch()}
          height={ch()}
          x={0}
          y={0}
          stroke={'black'}
          strokeWidth={strokeWidth}
          cornerRadius={2}
        />
        {checked && (
          <Line
            points={[ch(0.2), ch(0.5), ch(0.5), ch(0.8), ch(0.85), ch(-0.25)]}
            strokeWidth={strokeWidth}
            stroke="black"
            lineCap="round"
            lineJoin="round"
          />
        )}
      </Group>
    );
  };

  const ListItem = ({
    x,
    y,
    checked,
    children,
  }: {
    x: number;
    y: number;
    checked: boolean;
    children: string;
  }) => {
    return (
      <Group x={x} y={y}>
        <Checkbox x={0} y={0} checked={checked} />
        <Paragraph x={pW(4)} y={pH(-0.4)} width={pW(37)}>
          {children}
        </Paragraph>
      </Group>
    );
  };

  const Reasons = ({ x, y }: { x: number; y: number }) => {
    const lineHeight = ch(3);

    const reasons = data.reasons;
    const content = ([...reasons] as Reason[])
      .filter((r) => !!r)
      .map((reason, index) => {
        const [text, checked] = reason;
        const x = (index % 2) * pW(43.0);
        const y = Math.floor(index / 2) * lineHeight;
        return (
          <ListItem x={x} y={y} checked={checked}>
            {text}
          </ListItem>
        );
      });

    return (
      <Group x={pW(x)} y={pH(y)}>
        {content}
        {data.otherReason && (
          <Group y={lineHeight * 3}>
            <Checkbox x={0} y={0} checked={true} />
            <Paragraph x={pW(4)} y={pH(-0.4)} width={pW(82)}>
              {data.otherReason}
            </Paragraph>
          </Group>
        )}
      </Group>
    );
  };

  const Confession = ({
    apologizer,
    apologizee,
    confession,
    centerX,
    centerY,
  }: {
    apologizer: string;
    apologizee: string;
    confession: string;
    centerX: number;
    centerY: number;
  }) => {
    const [height, setHeight] = useState(0);
    const WIDTH = pW(74);

    const p1 = '本人 ';
    const p2 = ' 在此向 ';
    const p3 = ' 道歉';

    const text = p1 + apologizee + p2 + apologizer + p3;

    const fontSize = ch();

    const rects = getTextsWidth(text, { fontSize });
    const positions = getArrangedTexts(rects, {
      width: WIDTH,
    });
    const lines = getLines(rects, positions, [
      [p1.length, (p1 + apologizee).length],
      [
        (p1 + apologizee + p2).length,
        (p1 + apologizee + p2 + apologizer).length,
      ],
    ]);

    const apologyBottom =
      positions[positions.length - 1].top + rects[rects.length - 1].height;

    const totalHeight = apologyBottom + height;

    return (
      <Group
        x={pW(centerX)}
        y={pH(centerY)}
        offsetX={WIDTH / 2}
        offsetY={totalHeight / 2}
      >
        {Array.from(text).map((char, index) => {
          return (
            <Text
              key={index}
              text={char}
              fontSize={fontSize}
              x={positions[index].left}
              y={positions[index].top}
            />
          );
        })}
        {lines.map((point, index) => {
          return (
            <Line points={point} key={index} stroke="black" strokeWidth={2} />
          );
        })}
        <Paragraph
          y={apologyBottom + 5}
          x={0}
          width={WIDTH}
          align="center"
          ref={(node) => {
            node && setHeight((node as any).textHeight);
          }}
        >
          {confession}
        </Paragraph>
      </Group>
    );
  };

  const image = new Image(300, 300);
  image.src = data.avatar;
  image.crossOrigin = 'Anonumous';

  const scale = containerWidth / width;

  console.log({
    '1 / scale': 1 / scale,
    scaleX: scale,
    containerWidth,
    width,
    containerHeight,
    height,
  });

  const ref = useRef<any>(null);

  useImperativeHandle(
    canvasRef,
    () => {
      return {
        getBlob: async () => {
          try {
            if (!ref.current) return;

            const pixelRatio = Math.max(1 / scale, 1) * 2;
            const stage = ref.current.getStage();
            const blob = await stage.toBlob({
              mimeType: 'image/jpeg',
              pixelRatio,
            });

            return blob;
          } catch (err) {
            throw err;
          }
        },
      };
    },
    [width, containerWidth, height, containerHeight]
  );

  return (
    <Stage
      width={containerWidth}
      height={containerHeight}
      scaleX={scale}
      scaleY={scale}
      ref={ref}
      container={container}
    >
      <Layer>
        <Rect width={width} height={height} x={0} y={0} fill={'white'} />
        <CanvaImage
          image={image}
          x={pW(9)}
          y={pH(6)}
          height={pW(38)}
          width={pW(38)}
        />
        <Text text={`${data.apologizee}道歉表`} x={pW(54)} y={pH(16)} fontSize={ch(1.5)} />
        <Paragraph
          x={pW(9)}
          y={pH(36)}
        >{`道歉人：${data.apologizer}`}</Paragraph>
        <Paragraph x={pW(54)} y={pH(36)}>{`日期：${data.date}`}</Paragraph>
        <Paragraph x={pW(9)} y={pH(44)}>{`道歉原因：`}</Paragraph>
        <Reasons x={9} y={48} />

        <Confession
          centerX={50}
          centerY={80}
          apologizee={data.apologizer}
          apologizer={data.apologizee}
          confession={data.confession}
        />
      </Layer>
    </Stage>
  );
};

const Render = ({
  data,
  canvasRef,
}: {
  data: Apology;
  canvasRef: React.LegacyRef<typeof Stage>;
}) => {
  const [rect, setRect] = useState<DOMRect>();
  const id = 'stage';

  return (
    <div
      className="preview"
      id={id}
      ref={(e) => {
        if (!e || !!rect) return;

        const clientRect = e.getBoundingClientRect();
        setRect(clientRect);
      }}
    >
      <Canvas
        data={data}
        containerHeight={rect?.height ?? 0}
        containerWidth={rect?.width ?? 0}
        height={900}
        width={600}
        canvasRef={canvasRef}
        container={id}
      />
    </div>
  );
};

export default Render;
