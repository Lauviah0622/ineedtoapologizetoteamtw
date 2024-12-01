import { useRef } from 'react';
import {
  type TReasonItem,
  type Handler,
  type Reason,
  type Apology,
} from './New';
import { APOLOGIZEES } from '../apology';

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
        maxLength={22}
        onChange={(e) => onTextChange(e.target.value)}
      />
    </li>
  );
};

const Upload = ({ onUpload }: { onUpload: (dataUrl: string) => void }) => {
  return (
    <div>
      <input
        type="file"
        id="file"
        onChange={(e) => {
          if (!e.target.files?.[0]) {
            return;
          }

          const url = URL.createObjectURL(e.target.files?.[0]);

          onUpload(url);
        }}
      />
      <label htmlFor="file">上傳圖片</label>
    </div>
  );
};

const Editor = ({
  setData,
  data,
}: {
  data: Apology;
  setData: React.Dispatch<React.SetStateAction<Apology>>;
}) => {
  const ref = useRef(data.apologizee);

  return (
    <div className="form">
      <div className="avatar">
        <img src={data.avatar} alt="tw-baseball" />
        <div>
          <Upload
            onUpload={(url) => {
              const prevUrl = data.avatar;
              setData((d) => ({
                ...d,
                avatar: url,
              }));

              if (prevUrl.match(/^blob/)) {
                URL.revokeObjectURL(prevUrl);
              }

              console.log(url);
            }}
          />
          <select
            onChange={(e) => {
              const key = e.target.value;
              const { img, title } = APOLOGIZEES[key];

              ref.current = title;

              setData((d) => ({
                ...d,
                avatar: img,
                apologizee: title,
              }));
            }}
          >
            {Object.entries(APOLOGIZEES).map(([key, { img, title }]) => (
              <option value={key}>{title}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="header">
        <span
          role="textbox"
          contentEditable
          onInput={(e: any) => {
            const apologizee = e.target.innerText;

            setData((d) => ({
              ...d,
              apologizee,
            }));
          }}
          onKeyDown={(e) => {
            const isValidKeyCode = (code: number) => {
              return [37, 38, 39, 40, 46, 8, 36, 35].includes(code);
            };
            if (
              (e.target as HTMLSpanElement).innerText.length > 16 &&
              !isValidKeyCode(e.keyCode)
            ) {
              e.preventDefault();
            }
          }}
        >
          {ref.current}
        </span>
        <span>道歉表</span>
      </div>
      <div className="apologizee">
        <span>道歉人：</span>
        <input
          type="text"
          value={data.apologizer}
          maxLength={16}
          onChange={(e) => {
            setData((d) => ({
              ...d,
              apologizer: e.target.value,
            }));
          }}
        />
      </div>
      <div className="date">
        日期：
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
      </div>
      <div className="reason">
        <div>道歉原因：</div>
        <ul className={'items editing'}>
          {data.reasons.map(([text, checked], index) => {
            const onCheckedChange = () => {
              setData((d) => {
                const nextReason: Reason = [...d.reasons[index]];

                nextReason[1] = !nextReason[1];

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
          <span className={data.otherReason ? 'checked' : ''}>
            <input
              type="text"
              value={data.otherReason}
              maxLength={48}
              onChange={(e) => {
                setData((d) => ({
                  ...d,
                  otherReason: e.target.value,
                }));
              }}
            />
          </span>
        </div>
      </div>
      <div className="apology">
        <p>
          本人
          <span className="field">{data.apologizer}</span>
          在此向
          <span className="surround-space">{data.apologizee}</span>道歉
        </p>
        <textarea
          rows={2}
          value={data.confession}
          onChange={(e) => {
            if (e.target.value.length > 80) {
              return;
            }

            setData((d) => ({
              ...d,
              confession: e.target.value,
            }));
          }}
        />
      </div>
    </div>
  );
};

export default Editor;
