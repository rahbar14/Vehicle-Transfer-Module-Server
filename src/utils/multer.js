const multer = require("multer");
const fs = require("fs");

if (!fs.existsSync("./public")) fs.mkdirSync("./public")
if (!fs.existsSync("./public/uploads")) fs.mkdirSync("./public/uploads")

module.exports = (folder) => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            if (!fs.existsSync(`./public/uploads/${folder}`)) fs.mkdirSync(`./public/uploads/${folder}`)
            cb(null, `./public/uploads/${folder}`)
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            file.folder = folder;
            cb(null, file.fieldname + '-' + uniqueSuffix + "." + file.originalname.split(".").pop())
        }
    })

    return multer({ storage: storage });
}