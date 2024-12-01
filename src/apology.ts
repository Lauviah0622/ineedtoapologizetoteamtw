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
  江國豪: { img: '/public/apologizees/12.jpg', title: '江國豪' },
  邱智呈: { img: '/public/apologizees/14.jpg', title: '邱智呈' },
  陳冠宇: { img: '/public/apologizees/17.jpg', title: '陳冠宇' },
  林凱威: { img: '/public/apologizees/18.jpg', title: '林凱威' },
  張奕: { img: '/public/apologizees/19.jpg', title: '張奕' },
  陳柏清: { img: '/public/apologizees/20.jpg', title: '陳柏清' },
  吳俊偉: { img: '/public/apologizees/21.jpg', title: '吳俊偉' },
  陳傑憲: { img: '/public/apologizees/24.jpg', title: '陳傑憲' },
  李凱威: { img: '/public/apologizees/25.jpg', title: '李凱威' },
  林家正: { img: '/public/apologizees/27.jpg', title: '林家正' },
  曾頌恩: { img: '/public/apologizees/32.jpg', title: '曾頌恩' },
  潘傑楷: { img: '/public/apologizees/35.jpg', title: '潘傑楷' },
  黃恩賜: { img: '/public/apologizees/39.jpg', title: '黃恩賜' },
  '吉力吉撈・鞏冠': {
    img: '/public/apologizees/4.jpg',
    title: '吉力吉撈・鞏冠',
  },
  林昱珉: { img: '/public/apologizees/45.jpg', title: '林昱珉' },
  岳東華: { img: '/public/apologizees/58.jpg', title: '岳東華' },
  陳冠偉: { img: '/public/apologizees/59.jpg', title: '陳冠偉' },
  王志煊: { img: '/public/apologizees/64.jpg', title: '王志煊' },
  黃子鵬: { img: '/public/apologizees/69.jpg', title: '黃子鵬' },
  莊昕諺: { img: '/public/apologizees/71.jpg', title: '莊昕諺' },
  郭俊麟: { img: '/public/apologizees/75.jpg', title: '郭俊麟' },
  林安可: { img: '/public/apologizees/77.jpg', title: '林安可' },
  林立: { img: '/public/apologizees/83.jpg', title: '林立' },
  朱育賢: { img: '/public/apologizees/85.jpg', title: '朱育賢' },
  張政禹: { img: '/public/apologizees/9.jpg', title: '張政禹' },
  江坤宇: { img: '/public/apologizees/90.jpg', title: '江坤宇' },
  戴培峰: { img: '/public/apologizees/95.jpg', title: '戴培峰' },
  陳晨威: { img: '/public/apologizees/98.jpg', title: '陳晨威' },
  曾豪駒: { img: '/public/apologizees/totoro.jpg', title: '曾豪駒' },
};;
