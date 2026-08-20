export type NewsItem = {
  slug: string;
  date: string;
  title: string;
  photo: string;
};

export const newsItems: NewsItem[] = [
  {
    slug: "central-columbia-school-district-partnership",
    date: "July 9, 2026",
    title:
      "Central Columbia School District Partners With IvySchool.ai For Artificial Intelligence Course To Upskill Their Students On Artificial Intelligence",
    photo: "/images/news-columbia.jpg",
  },
  {
    slug: "zion-elementary-school-partnership",
    date: "June 28, 2026",
    title:
      "Zion Elementary School Partners With IvySchool.ai For Artificial Intelligence Course To Upskill Their Students On Artificial Intelligence",
    photo: "/images/news-zion.jpg",
  },
  {
    slug: "jacksonville-university-partnership",
    date: "July 21, 2026",
    title:
      "Jacksonville University Partners With IvySchool.ai For Artificial Intelligence Course To Upskill Their Students On Artificial Intelligence",
    photo: "/images/news-jacksonville.jpg",
  },
];
