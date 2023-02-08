const multer = require('multer');

const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/bmp": "bmp",
    "image/gif": "gif",
    "image/x-icon": "ico",
    "image/svg+xml": "svg",
    "image/tiff": "tiff",
    "image/tif": "tif"
};

const space = " ";
const tiret = "-";
const dot = ".";
const underscore = "_";
const storage = multer.diskStorage({
    destination: (req, file, callback) => { 
        callback(null, "images"); 
    },
    filename: (req, file, callback) => {
        let name = file.originalname.split(dot)[0] ;
         name = name.split(space).join(tiret);
        const extension = MIME_TYPES[file.mimetype];
        const timestamp = Date.now();
        callback(null, name + underscore + timestamp + dot + extension);
    }
});

module.exports = multer({ storage: storage }).single("image");