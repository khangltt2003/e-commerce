import puppeteer from "puppeteer";
import fs from "fs";

const browser = await puppeteer.launch();

const scrapCategories = async (browser, url) => {
  const page = await browser.newPage();
  await page.goto(url);
  await page.waitForSelector("#shopify-section-all-collections");

  const scrapedData = await page.evaluate(() => {
    const query = "div#shopify-section-all-collections > div.all-collections > div.sdcollections-content > ul.sdcollections-list > li";
    const categories = Array.from(document.querySelectorAll(query)).map((el) => {
      return {
        category: el.querySelector(".collection-name").innerText,
        link: el.querySelector("a").href,
      };
    });
    return categories;
  });
  return scrapedData;
};

const scrapItemLink = async (browser, url) => {
  try {
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector("#collection-product-grid");
    const scrapedData = await page.evaluate(() => {
      const query =
        "#collection-product-grid > div.grid-element > div.grid-view-item > div.grid-normal-display > div.grid__layout > div.grid-view-item__title > a";
      const itemLink = Array.from(document.querySelectorAll(query)).map((el) => el.href);
      return itemLink;
    });
    return scrapedData;
  } catch (error) {
    console.log("Cannot scrap item links Error " + error);
  }
};

const scrapItem = async (browser, url) => {
  try {
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector("div#shopify-section-product-template", { timeout: 10000 });

    const scrapedData = await page.evaluate(() => {
      //get name
      const name = document.querySelector("div#shopify-section-product-template > header.section-header > div.wrapper > h3")?.innerText;

      //get category
      const category = document.querySelectorAll("nav.breadcrumb > a")[1].innerText.toLowerCase();

      //get brand
      const brand = name.split(" ")[0].toLowerCase();

      //get price
      const price = document.querySelector("span.money")?.innerText;

      //get thumb
      const thumb = document.querySelector("img#ProductPhotoImg")?.src;

      //get image
      const images = Array.from(
        document.querySelectorAll(
          "#ProductThumbs > div.owl-wrapper-outer > div.owl-wrapper > div.owl-item > li.thumb__element > a.product-single__thumbnail"
        )
      ).map((el) => {
        return el.href;
      });
      //get description
      const description = Array.from(document.querySelectorAll("div#desc >  ul.spec > li")).map((el) => el.innerText);

      //get variant
      const variants = Array.from(document.querySelectorAll("form.product-single__form > div.radio-wrapper")).map((type) => {
        const label = type.querySelector("label.single-option-radio__label")?.innerText;
        const options = Array.from(type.querySelectorAll("fieldset.single-option-radio > input.single-option-selector__radio")).map((el) => el.value);
        return {
          label: label,
          options: options,
        };
      });

      return {
        name: name ? name : "none",
        category: category ? category : "none",
        brand: brand ? brand : "none",
        price: price ? parseFloat(price.replace("$", "")) : "none",
        description: description ? description : "none",
        thumb: thumb,
        images: images ? images : "none",
        variants: variants ? variants : "none",
      };
    });
    return scrapedData;
  } catch (error) {
    console.log("cannot scrap page " + url + " Error: " + error);
  }
};

const url = "https://digital-world-2.myshopify.com/";
// const categories = await scrapCategories(browser, url);

// const itemLink = await scrapItemLink(browser, "https://digital-world-2.myshopify.com/collections/smartphone");
// console.log(itemLink);

// const itemData = await scrapItem(
//   browser,
//   "https://digital-world-2.myshopify.com/collections/smartphone/products/cum-sociis-natoque-penatibus-et-magnis-6"
// );
// console.log(itemData);

const scrapData = async (browser, url) => {
  const categories = await scrapCategories(browser, url);

  const itemLinks = await Promise.all(
    categories.map(async (el) => {
      const itemLink = await scrapItemLink(browser, el.link);
      return itemLink;
    })
  );

  //push all link into an array
  const itemsPromise = [];
  for (let cate of itemLinks) {
    for (let item of cate) {
      itemsPromise.push(await scrapItem(browser, item));
    }
  }
  const res = await Promise.all(itemsPromise);
  return res;
};

const data = await scrapData(browser, url);

fs.writeFileSync("items.json", JSON.stringify(data), (err) => {
  if (err) console.log("cannot write to file");
});
await browser.close();
