import {
  useCallback,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from 'react';
import { type Apology, createDefaultApology } from '@/utils/apology';
import { toBlob } from 'html-to-image';

type Reason = Apology['reasons'][number];

type TReasonItem = {
  checked: Reason[1];
  text: Reason[0];
};

type Handler<TValue> = (value: TValue) => void;

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

const Editor = () => {
  const [isPreview, setIsPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(createDefaultApology);
  const ref = useRef<HTMLDivElement>(null);

  const EditorComponent = useCallback(
    ({ preview, editing }: { preview: ReactNode; editing: ReactNode }) =>
      isPreview ? preview : editing,
    [isPreview]
  );

  return (
    <>
      <div className="form" ref={ref}>
        <div className="avatar">
          <img
            src="https://upload.wikimedia.org/wikipedia/en/0/03/Chinese_Taipei_national_baseball_team.png"
            alt="tw-baseball"
          />
        </div>
        <div className="header">中華隊道歉表</div>
        <div className="apologist">
          <span>道歉人：</span>
          <EditorComponent
            preview={<DisplayText children={data.apologist} />}
            editing={
              <input
                type="text"
                value={data.apologist}
                onChange={(e) => {
                  setData((d) => ({
                    ...d,
                    apologist: e.target.value,
                  }));
                }}
              />
            }
          />
        </div>
        <div className="date">
          日期：
          <EditorComponent
            preview={<DisplayText children={data.date} />}
            editing={
              <input
                type="date"
                value={data.date}
                onChange={(e) => {
                  setData((d) => ({
                    ...d,
                    date: e.target.value,
                  }));
                }}
              />
            }
          />
        </div>
        <div className="reason">
          <div>道歉原因：</div>
          <ul className={isPreview ? 'items' : 'items editing'}>
            {data.reasons.map(([text, checked], index) => {
              if (isPreview) {
                return <ReasonItem key={index} text={text} checked={checked} />;
              }
              // 這裡可以選擇要用 form，還是直接用 li

              const onCheckedChange = () => {
                setData((d) => {
                  const nextReason: Reason = [...d.reasons[index]];

                  nextReason[1] = !nextReason[1];

                  console.log('nextReason', nextReason);

                  const nextReasons = [...d.reasons];

                  nextReasons[index] = nextReason;

                  return { ...d, reasons: nextReasons };
                });
              };

              const onTextChange = (value: string) => {
                setData((d) => {
                  const nextReason: Reason = [...d.reasons[index]];
                  nextReason[0] = value;

                  const nextReasons = [...d.reasons];

                  nextReasons[index] = nextReason;

                  return { ...d, reasons: nextReasons };
                });
              };

              return (
                <EditableReasonItem
                  key={index}
                  {...{ text, checked, onTextChange, onCheckedChange }}
                />
              );
            })}
          </ul>
          <div className="other">
            <EditorComponent
              preview={
                data.otherReason && (
                  <DisplayText
                    className="checked"
                    children={data.otherReason}
                  />
                )
              }
              editing={
                <span className={data.otherReason ? 'checked' : ''}>
                  <input
                    type="text"
                    value={data.otherReason}
                    onChange={(e) => {
                      setData((d) => ({
                        ...d,
                        otherReason: e.target.value,
                      }));
                    }}
                  />
                </span>
              }
            />
          </div>
        </div>
        <div className="apology">
          <p>
            本人
            <span className="field">{data.apologist}</span>
            在此向
            <span className="surround-space">中華隊</span>道歉
          </p>
          <p>
            <EditorComponent
              preview={<DisplayText children={data.confession} />}
              editing={
                <textarea
                  rows={2}
                  value={data.confession}
                  onChange={(e) => {
                    setData((d) => ({
                      ...d,
                      confession: e.target.value,
                    }));
                  }}
                />
              }
            />
          </p>
        </div>
      </div>
      <div className="submit">
        <button
          onClick={() => {
            setIsPreview(!isPreview);
          }}
        >
          {isPreview ? '編輯' : '預覽'}
        </button>
        {isPreview && (
          <button
            disabled={isLoading}
            onClick={async () => {
              setIsLoading(true)
              if (!ref.current) {
                return;
              }
              const blob = await toBlob(ref.current);
              if (!blob) return;

              const reader = new FileReader();
              reader.readAsDataURL(blob);

              const base64Image = await new Promise<string>(
                (resolve, reject) => {
                  reader.addEventListener('load', () => {
                    const result = reader.result;
                    if (typeof result !== 'string') {
                      reject();
                      return;
                    }
                    resolve(result);
                  });
                }
              );

              const headers = new Headers();
              headers.append('Content-Type', 'text/json');

              const response = await fetch('/new', {
                method: 'POST',
                body: JSON.stringify({ img: base64Image, data }),
                headers,
              });
              const id = await response.text();
              setIsLoading(false);

              window.location.href = '/from/' + id;
            }}
          >
            {isLoading ? '處理中' : '送出'}
          </button>
        )}
      </div>
    </>
  );
};

export default Editor;
