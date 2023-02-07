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
const underscore = "_";
const dot = ".";
const timestamp = Date.now();
const storage = multer.diskStorage({
    destination: (req, file, callback) => { 
        callback(null, "images"); 
    },
    filename: (req, file, callback) => {
        let name = file.originalname.split(dot)[0] ;
         name = name.split(space).join(underscore);
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name +  timestamp + dot + extension);
    }
});

module.exports = multer({ storage: storage }).single("image");