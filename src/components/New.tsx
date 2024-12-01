import {
  useCallback,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from 'react';
import { type Apology, createDefaultApology } from '@/utils/apology';
import { toJpeg } from 'html-to-image';
import Editor from './Editor';
import Render from './Render';
import { Stage, Layer, Rect, Text } from 'react-konva';
import { createApology, uploadImage } from "../db";

export type Reason = Apology['reasons'][number];

export { type Apology };

export type TReasonItem = {
  checked: Reason[1];
  text: Reason[0];
};

export type Handler<TValue> = (value: TValue) => void;

const DisplayText = (props: ComponentProps<'span'>) => {
  return <span {...props} />;
};

const ReasonItem = ({ checked, text }: TReasonItem) => {
  return <li className={checked ? 'checked' : ''}>{text}</li>;
};

const EditableReasonItem = ({
  checked,
  text,
  onTextChange,
  onCheckedChange,
}: TReasonItem & {
  onCheckedChange: () => void;
  onTextChange: Handler<TReasonItem['text']>;
}) => {
  return (
    <li>
      <input type="checkbox" checked={checked} onChange={onCheckedChange} />
      <input
        type="text"
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
      />
    </li>
  );
};

const New = () => {
  const [isPreview, setIsPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef<any>(null);
  const [data, setData] = useState(createDefaultApology);

  console.log(canvasRef);

  return (
    <>
      <main style={{ visibility: isPreview ? 'visible' : 'hidden' }}>
        <Render data={data} canvasRef={canvasRef} />
      </main>
      <main style={{ visibility: isPreview ? 'hidden' : 'visible' }}>
        <Editor data={data} setData={setData} />
      </main>
      <div className="actions">
        <button
          onClick={() => {
            setIsPreview((s) => !s);
          }}
        >
          {isPreview ? '返回' : '預覽'}
        </button>
        {isPreview && (
          <button
            onClick={async () => {
              try {
                const blob = await canvasRef.current.getBlob();
                
                const res = await createApology(JSON.stringify(data));

                const id = res.data?.[0].id;

                const uploadRes = await uploadImage(blob, `${id}.jpg`);

                // TODO redirect to page



                window.location.href = '/from/' + id;
              } catch {
                window.location.href = '/error';
              }
            }}
          >
            送出
          </button>
        )}
        {isPreview && (
          <button
            onClick={async () => {
              const blob = await canvasRef.current.getBlob();
              if (!blob) return; 
              
              const url = URL.createObjectURL(blob);

              const link = document.createElement('a');
              link.href = url;
              link.download = `x.jpeg`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            下載
          </button>
        )}
      </div>
    </>
  );
};

export default New;
