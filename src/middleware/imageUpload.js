import multer from "multer";
import sharp from "sharp";

const imageStorage = multer.memoryStorage();
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Only accepted Image"));
  }
};

const uploadImage = multer({
  storage: imageStorage,
  fileFilter: imageFilter
});

const uploadOneImage = async (req, res, next) => {
  const upload = uploadImage.single("image");
  upload(req, res, function(err) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message
      });
    }
    next();
  });
};

const resizeImage = async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`;
  try {
    await sharp(req.file.buffer)
      .toFormat("jpeg")
      .jpeg()
      .toFile(`public/images/${req.file.filename}`);

    next();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export default { uploadOneImage, resizeImage };
