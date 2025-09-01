import puppeteer from 'puppeteer';
import * as fs from 'fs/promises';

// puppeteer is async, so we need to use await.
// You can only use await in an async function.

async function start() {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://learnwebcode.github.io/practice-requests/');
    // await page.goto('https://pptr.dev/');
    // await page.screenshot({ path: "wonderful.png", fullPage: true });


    const names = await page.evaluate(() => {
        // this will return a node list of elements, not an array directly.
        return Array.from(document.querySelectorAll(".info strong")).map(item => item.textContent);
    });
    await fs.writeFile("names.txt", names.join("\r\n"));

    //$$eval is designed to select multiple elements. It returns an actual array, not a node list.
    const photos = await page.$$eval("img", (imgs) => {
        return imgs.map(x => x.src);
    })

    // (for of) allows for await syntax.
    for (const photo of photos) {

        const imagePage = await page.goto(photo);

        // with .split().pop() we catch the last part of the url which is the name of the image.
        await fs.writeFile(photo.split("/").pop(), await imagePage.buffer());
    }

    await browser.close();
}

start();