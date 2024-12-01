
import { type TReasonItem, type Handler, type Reason, type Apology } from './New';

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


const Editor = ({
  setData,
  data,
}: {
  data: Apology;
  setData: React.Dispatch<React.SetStateAction<Apology>>;
}) => {
  return (
    <div className="form">
      <div className="avatar">
        <img src={data.avatar} alt="tw-baseball" />
      </div>
      <div className="header">中華隊道歉表</div>
      <div className="apologist">
        <span>道歉人：</span>
        <input
          type="text"
          value={data.apologist}
          maxLength={16}
          onChange={(e) => {
            setData((d) => ({
              ...d,
              apologist: e.target.value,
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
          <span className="field">{data.apologist}</span>
          在此向
          <span className="surround-space">中華隊</span>道歉
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