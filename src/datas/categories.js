import {
  Flame,
  UtensilsCrossed,
  CupSoda,
  Sandwich,
  Cookie,
  Soup,
} from "lucide-react";

const categories = [
  {
    id: "all",
    name: "Tất cả",
    icon: UtensilsCrossed,
  },
 
  {
    id: "drink",
    name: "Nước",
    icon: CupSoda,
  },
  {
    id: "bread",
    name: "Bánh mì",
    icon: Sandwich,
  },
  {
    id: "cake",
    name: "Bánh",
    icon: Cookie,
  },
  {
    id: "rice",
    name: "Cơm",
    icon: Soup,
  },
];

export default categories;