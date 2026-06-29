import coca from "../assets/coca.jpg";
import trasua from "../assets/trasua.jpg";
import banhmi from "../assets/banhmi.jpg";
import banhngot from "../assets/banhngot.jpeg";

 const products = [
  {
    id: 1,
    name: "Trà sữa truyền thống",
    image: trasua,
    category: "Nước",
    price: 20000,
    oldPrice: 30000,
    sold: 725,
    like: 56,
    remain: 8,
    flashSale: true,
  },
  {
    id: 2,
    name: "Coca Cola",
    image: coca,
    category: "Nước",
    price: 10000,
    sold: 200,
    like: 20,
    remain: 15,
    flashSale: false,
  },
  {
    id: 3,
    name: "Bánh ngọt",
    image: banhngot,
    category: "Bánh",
    price: 15000,
    sold: 180,
    like: 15,
    remain: 5,
    flashSale: false,
  },
  {
    id: 4,
    name: "Bánh mì xúc xích",
    image: banhmi,
    category: "Bánh mì",
    price: 25000,
    sold: 520,
    like: 88,
    remain: 10,
    flashSale: true,
  },
];

export default products;