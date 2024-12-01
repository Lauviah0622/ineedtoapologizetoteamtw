export const getDateString = (d: Date) => {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

type Reason = [string, boolean];

type DateString = string;

export type Apology = {
  apologizer: string;
  apologizee: string;
  date: DateString;
  reasons: Reason[];
  otherReason: string;
  confession: string;
  avatar: string;
};

export const createDefaultApology = (): Apology => {
  return {
    apologizer: '',
    apologizee: '中華隊',
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
  img: string;
  title: string;
};

export const APOLOGIZEES: Record<string, Avatar> = {
  中華隊: {
    img: 'https://upload.wikimedia.org/wikipedia/en/0/03/Chinese_Taipei_national_baseball_team.png',
    title: '中華隊',
  },
  江國豪: { img: '/apologizees/12.jpg', title: '江國豪' },
  邱智呈: { img: '/apologizees/14.jpg', title: '邱智呈' },
  陳冠宇: { img: '/apologizees/17.jpg', title: '陳冠宇' },
  林凱威: { img: '/apologizees/18.jpg', title: '林凱威' },
  張奕: { img: '/apologizees/19.jpg', title: '張奕' },
  陳柏清: { img: '/apologizees/20.jpg', title: '陳柏清' },
  吳俊偉: { img: '/apologizees/21.jpg', title: '吳俊偉' },
  陳傑憲: { img: '/apologizees/24.jpg', title: '陳傑憲' },
  李凱威: { img: '/apologizees/25.jpg', title: '李凱威' },
  林家正: { img: '/apologizees/27.jpg', title: '林家正' },
  曾頌恩: { img: '/apologizees/32.jpg', title: '曾頌恩' },
  潘傑楷: { img: '/apologizees/35.jpg', title: '潘傑楷' },
  黃恩賜: { img: '/apologizees/39.jpg', title: '黃恩賜' },
  '吉力吉撈・鞏冠': {
    img: '/apologizees/4.jpg',
    title: '吉力吉撈・鞏冠',
  },
  林昱珉: { img: '/apologizees/45.jpg', title: '林昱珉' },
  岳東華: { img: '/apologizees/58.jpg', title: '岳東華' },
  陳冠偉: { img: '/apologizees/59.jpg', title: '陳冠偉' },
  王志煊: { img: '/apologizees/64.jpg', title: '王志煊' },
  黃子鵬: { img: '/apologizees/69.jpg', title: '黃子鵬' },
  莊昕諺: { img: '/apologizees/71.jpg', title: '莊昕諺' },
  郭俊麟: { img: '/apologizees/75.jpg', title: '郭俊麟' },
  林安可: { img: '/apologizees/77.jpg', title: '林安可' },
  林立: { img: '/apologizees/83.jpg', title: '林立' },
  朱育賢: { img: '/apologizees/85.jpg', title: '朱育賢' },
  張政禹: { img: '/apologizees/9.jpg', title: '張政禹' },
  江坤宇: { img: '/apologizees/90.jpg', title: '江坤宇' },
  戴培峰: { img: '/apologizees/95.jpg', title: '戴培峰' },
  陳晨威: { img: '/apologizees/98.jpg', title: '陳晨威' },
  曾豪駒: { img: '/apologizees/totoro.jpg', title: '曾豪駒' },
};;
