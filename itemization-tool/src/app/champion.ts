export interface Champion {
  id: string;
  name: string;
  image: string;
}

export const NULL_CHAMPION: Champion = {
  id: "Null",
  name: "Null",
  image: "/champs/Null.png"
}
