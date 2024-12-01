import {
  useRef,
  useState,
  type ComponentProps,
} from 'react';
import { type Apology, createDefaultApology } from '@/apology';
import Editor from './Editor';
import Render from './Render';

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
  const [status, setStatus] = useState<0 | 1 | 2>(0);
  const isIdle = status === 0;
  const isLoading = status === 1;
  const isFetched = status === 2;

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
        {isIdle && (
          <button
            onClick={() => {
              setIsPreview((s) => !s);
            }}
          >
            {isPreview ? '返回' : '預覽'}
          </button>
        )}
        {isPreview && (
          <button
            disabled={!isIdle}
            onClick={async () => {
              try {
                setStatus(1);
                const blob = await canvasRef.current.getBlob();

                const res = await fetch('/new', {
                  method: 'POST',
                  body: JSON.stringify(data),
                });

                const id = await res.text();

                await fetch('/image/' + id, {
                  method: 'POST',
                  body: blob,
                  headers: {
                    'Content-Type': 'image/jpeg',
                  },
                });

                setStatus(2);

                // wait for a while, I'm just a free tier user 🥲
                await Promise.resolve((res: any) => {
                  setTimeout(res, 1000);
                });

                window.location.href = '/from/' + id;
              } catch {
                window.location.href = '/error';
              }
            }}
          >
            {status ? '讓子彈飛一會兒' : '送出'}
          </button>
        )}
        {isPreview && isIdle && (
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
