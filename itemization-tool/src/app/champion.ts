export interface Champion {
  id: string;
  name: string;
  image: string;
}

export const NULL_CHAMPION: Champion = {
  id: "null",
  name: "null",
  image: "/champs/Null.png"
}
