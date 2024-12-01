
export const getDateString = (d: Date) => {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

type Reason = [string, boolean];

type DateString = string;

export type Apology = {
  apologist: string;
  date: DateString;
  reasons: Reason[];
  otherReason: string;
  confession: string;
  avatar: string
};


export const createDefaultApology = (): Apology => {
  return {
    apologist: '',
    date: getDateString(new Date()),
    reasons: defaultReasons.map((r) => {
      return [r, false];
    }),
    otherReason: '',
    confession: '',
    avatar:
      'https://upload.wikimedia.org/wikipedia/en/0/03/Chinese_Taipei_national_baseball_team.png',
  };
};

const defaultReasons = [
  '我被球迷帶風向了',
  '我以為中華隊只有小孩時強',
  '我不懂棒球',
  '我沒有真的看比賽',
  '我以為臺灣只有啦啦隊強',
  '我小看中華隊的左傾打線',
];

type Avatar = {
  src: string;
  alt: string;
}

const avatars: Avatar[] = [
  {
    src: 'https://upload.wikimedia.org/wikipedia/en/0/03/Chinese_Taipei_national_baseball_team.png',
    alt: 'tw-team',
  },
];