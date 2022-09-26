import puppetter from 'puppeteer'
import path from 'path'
import { srcToImg } from './utils/srcToImg'
;(async function () {
  const browser = await puppetter.launch()
  const page = await browser.newPage()
  await page.goto('https://image.baidu.com')
  await page.focus('#kw')
  await page.keyboard.sendCharacter('jk 1920*1080')
  await page.click('.s_newBtn')
  page.on('load', async function () {
    const sources = await page.evaluate(async () => {
      const images = await document.getElementsByClassName('main_img')
      return Array.from(images).map((img) => (img as any).src)
    })
    console.log(sources)
    for (let src of sources) {
      await srcToImg(src, path.resolve('src', 'img'))
    }
  })

  // await browser.close()
})()
