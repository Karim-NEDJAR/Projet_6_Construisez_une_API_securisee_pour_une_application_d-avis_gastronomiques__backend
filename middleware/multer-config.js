const multer = require("multer");

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
  "image/tif": "tif",
};

const space = " ";
const hyphen = "-";
const dot = ".";
const underscore = "_";
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    let name = file.originalname.split(dot)[0];
    name = name.split(space).join(hyphen);
    const extension = MIME_TYPES[file.mimetype];
    if (
      extension !== "jpg" &&
      extension !== "jpeg" &&
      extension !== "png" &&
      extension !== "webp" &&
      extension !== "tiff" &&
      extension !== "tif" &&
      extension !== "gif" &&
      extension !== "gif" &&
      extension !== "bmp" &&
      extension !== "svg" &&
      extension !== "ico"
    ) {
      callback(
        "\nE R R E U R   ==========>>>>   F O R M A T    D E   F I C H I E R    N O N    S U P P O R T É   ! \n",
        false
      );
    } else {
      const timestamp = Date.now();
      callback(null, name + underscore + timestamp + dot + extension);
    }
  },
});

module.exports = multer({ storage: storage }).single("image");
