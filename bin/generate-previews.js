const sharp = require('sharp')
const fs = require('fs')
const { pipeline } = require('stream')
const path = require('path')

// Config
const resizeWidth = 100
const blur = 8

function isImage(filePath) {
    const extension = path.extname(filePath.toLowerCase())
    return [
        '.jpg', '.jpeg',
        '.png',
        '.webp',
    ].includes(extension)
}

function parseArgs(args) {
    return args.reduce((allArgs, arg, i) => {
        const [key, value] = arg.split('=')
        if (value) {
            allArgs[key] = value
        } else {
            allArgs[i] = arg
        }
        return allArgs
    }, {})
}


;(async (args) => {
    const inputFolder = path.resolve(__dirname, args.inputFolder ?? '../example/images')
    const outputFolder = path.resolve(__dirname, args.outputFolder ?? '../example/out')

    const images = (await fs.promises.readdir(inputFolder)).filter(isImage)

    for (const img of images) {
        await pipeline(
            fs.createReadStream(`${inputFolder}/${img}`),
            sharp().resize({ width: resizeWidth }),
            sharp().blur(blur),
            fs.createWriteStream(`${outputFolder}/${img}`),
            err => {
                if (err) {
                    console.error(err)
                } else {
                    console.log(`Preview generated for ${img}`)
                }
            }
        )
    }
})(parseArgs(process.argv.slice(2)))