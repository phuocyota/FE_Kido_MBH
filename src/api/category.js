// src/api/category.js

import {
  fetch,
  parseResponse,
  buildAssetUrl,
} from "./client";

import { API } from "./endpoint";
import { getAccessToken } from "./session";

// GET FULL CATEGORY + PRODUCTS
export const getFullCategories =
  async () => {

    const res = await fetch(
      API.CATEGORY.GET_FULL,
      {
        method: "GET",
      },
      getAccessToken()
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
