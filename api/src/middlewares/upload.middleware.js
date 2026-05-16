import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/jpg"];

    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Format file tidak didukung"));
    }

    cb(null, true);
  },
});

export default upload;
