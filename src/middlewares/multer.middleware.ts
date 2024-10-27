import multer from "multer"; 
import fs from "fs";

const uploadDir = "src/uploads";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = file.fieldname + "-" + uniqueSuffix + ".jpg";
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });
export default upload;
