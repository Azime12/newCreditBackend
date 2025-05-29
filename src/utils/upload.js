const multer = require("multer");
const fs = require("fs");
const path = require("path");

const makeDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "uploads/others";
    if (file.fieldname === "profilePhoto") folder = "uploads/profile";
    if (["idFrontPhoto", "idBackPhoto"].includes(file.fieldname)) folder = "uploads/id";
    makeDir(folder);
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  },
});


const upload = multer({ storage });
module.exports = upload;
