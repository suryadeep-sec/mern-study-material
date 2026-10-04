const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
    fields: 3,
    fieldSize: 1000,
    parts: 4,
  },

  fileFilter(req, file, callback) {
    if (
      file.mimetype !== "application/pdf" ||
      !file.originalname.toLowerCase().endsWith(".pdf")
    ) {
      return callback(new Error("Only PDF files are allowed"));
    }

    callback(null, true);
  },
});

function uploadPDF(req, res, next) {
  upload.single("pdf")(req, res, (error) => {
    if (error) {
      return res.status(400).json({
        message:
          error.code === "LIMIT_FILE_SIZE"
            ? "PDF must be 5 MB or smaller"
            : error.message,
      });
    }

    next();
  });
}

module.exports = uploadPDF;
