const express = require("express");
const app = express();
const port = 3000;
const axios = require("axios");

const getPublix = async () => {
  const url = `https://services.publix.com/api/v4/savings?page=1`;
  try {
    const response = await axios.get(url);
    const savings = response.data.Savings;
    const clean = savings.map((item) => {
      return {
        title: item.title,
        description: item.description,
        savings: item.savings,
        store: `Publix`,
        image: item.enhancedImageUrl,
      };
    });
    return clean;
  } catch (error) {
    console.error(error);
  }
};

const getWinnDixie = async () => {
  const pubIds = await getWinnDixiePubId();
  try {
    const urls = pubIds.map(async id => await axios.get(`https://dam.flippenterprise.net/flyerkit/publication/${id}/products?display_type=all&locale=en&access_token=144f255172b672dfe5bd75d2e8fb126a`))
    const values = await Promise.all(urls);
    const allData = values.flatMap(value => value.data);
    const clean = allData.map((item) => {
      return {
        title: item.name,
        description: item.description,
        price: `${item.pre_price_text}${item.price_text}${item.pre_price_text}`,
        store: `Winn-Dixie`,
        image: item.large_image_url,
      };
    });
    return clean;
  } catch (error) {
    console.error(error);
  }
};

const getWinnDixiePubId = async () => {
  const url = `https://dam.flippenterprise.net/flyerkit/publications/winndixie?locale=en&access_token=144f255172b672dfe5bd75d2e8fb126a&show_storefronts=true&postal_code=33073&store_code=0349`;
  try {
    const response = await axios.get(url);
    const ids = response.data.map(pub => pub.id);
    return ids;
  } catch (error) {
    console.error(error);
  }
};

const paginate = (results, offset, rowcount) => {
  return results.slice(offset, offset + rowcount);
};

app.get("/", async (req, res) => {
  res.send(`Forbidden`);
});

app.get("/api/publix", async (req, res) => {
  const store = await getPublix();
  res.send(store);
});

app.get("/api/winndixie", async (req, res) => {
  const store = await getWinnDixie();
  res.send(store);
});

app.get("/api/search", async ({ query }, res) => {
  let { q, skip = 0, take = 10 } = query;
  const publix = await getPublix();
  const winndixie = await getWinnDixie();
  let data = [...publix, ...winndixie];

  skip = parseInt(skip, 10);
  take = parseInt(take, 10);

  if (q) {
    data = data.filter((r) =>
      r.title.toLowerCase().includes(q.toLowerCase())
    );
  }

  res.json({
    count: data.length,
    results: paginate(data, skip, take),
  });
});

app.listen(port, () => {});
