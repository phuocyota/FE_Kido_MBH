// src/api/category.js

import {
  fetch,
  parseResponse,
  buildAssetUrl,
} from "./client";

import { API } from "./endpoint";

// GET FULL CATEGORY + PRODUCTS
export const getFullCategories =
  async () => {

    // 👇 lấy token
    const token =
      localStorage.getItem("accessToken");

    const res = await fetch(
      API.CATEGORY.GET_FULL,
      {
        method: "GET",
      },
      token // 👈 truyền token vào đây
    );

    return parseResponse(res);
  };

// FORMAT PRODUCTS
export const formatProducts =
  (categories) => {

    return categories.flatMap((category) =>
      category.products.map((p) => ({
        id: p.id,
        name: p.name,
        price: Number(p.price),

        image: p.imageUrl
          ? buildAssetUrl(p.imageUrl)
          : "",

        category: category.name,
        unit: p.unit,
      }))
    );
  };