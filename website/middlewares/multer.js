const multer = require('multer');

const storage = multer.diskStorage({
  filename: function (req,file,cb) {
    cb(null, file.originalname)
  }
});

// upload image
const upload = multer({ storage: storage });

module.exports = {upload};