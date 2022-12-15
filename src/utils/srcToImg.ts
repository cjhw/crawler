import http from 'http'
import https from 'https'
import { createWriteStream, writeFile } from 'fs'
import { promisify } from 'util'
import path from 'path'

const wirteFileAsync = promisify(writeFile)

async function srcToImg(url: string, dir: string) {
  if (/f=(JPEG|PNG|JPG|GIF)/.test(url)) {
    await urlToImg(url, dir)
  } else {
    await base64ToImg(url, dir)
  }
}

const urlToImg = async (url: string, dir: string) => {
  let mod = /https:/.test(url) ? https : http
  const matches: any = url.match(/f=(JPEG|PNG|JPG|GIF)/)
  const ext = matches[1].toLowerCase()
  console.log(ext)

  const file = path.join(dir, `${Date.now()}.${ext}`)
  mod.get(url, (res) => {
    res.pipe(createWriteStream(file)).on('finish', () => {
      console.log('写入完成')
    })
  })
}

const base64ToImg = async (url: string, dir: string) => {
  const matches: any = url.match(/^data:(.+);base64,(.+)/)
  try {
    const ext = matches[1].split('/')[1].replace('jpeg', 'jpg')
    const file = path.join(dir, `${Date.now()}.${ext}`)
    await wirteFileAsync(file, matches[2], 'base64')
  } catch (error) {
    console.log('非法base64字符串')
  }
}

export { srcToImg }
