const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs/promises");
const path = require("path");
const { randomUUID } = require("crypto");

const Material = require("../models/Material");
const auth = require("../middleware/auth");
const uploadPDF = require("../middleware/upload");

const router = express.Router();

const uploadsDirectory = path.join(__dirname, "..", "uploads");

// All material routes require login
router.use(auth);

// UPLOAD MATERIAL
router.post("/", uploadPDF, async (req, res) => {
  let savedPath;

  try {
    const { title, subject, unit } = req.body || {};

    if (
      typeof title !== "string" ||
      typeof subject !== "string" ||
      !title.trim() ||
      !subject.trim()
    ) {
      return res.status(400).json({
        message: "Title and subject are required",
      });
    }

    if (title.trim().length > 150 || subject.trim().length > 100) {
      return res.status(400).json({
        message: "Title or subject is too long",
      });
    }

    const unitNumber = Number(unit);

    if (
      !Number.isInteger(unitNumber) ||
      unitNumber < 1 ||
      unitNumber > 5
    ) {
      return res.status(400).json({
        message: "Unit must be a number from 1 to 5",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a PDF",
      });
    }

    // Basic PDF header check
    const header = req.file.buffer.subarray(0, 5).toString("ascii");

    if (header !== "%PDF-") {
      return res.status(400).json({
        message: "File does not have a valid PDF header",
      });
    }

    await fs.mkdir(uploadsDirectory, { recursive: true });

    const filename = `${randomUUID()}.pdf`;
    savedPath = path.join(uploadsDirectory, filename);

    await fs.writeFile(savedPath, req.file.buffer);

    const material = await Material.create({
      title: title.trim(),
      subject: subject.trim(),
      unit: unitNumber,
      filename,
      uploadedBy: req.user._id,
    });

    return res.status(201).json({
      message: "Material uploaded successfully",
      material,
    });
  } catch (error) {
    // Remove the file if database saving fails
    if (savedPath) {
      await fs.unlink(savedPath).catch(() => {});
    }

    console.error("Upload error:", error.message);

    return res.status(500).json({
      message: "Could not upload material",
    });
  }
});


// LIST MATERIALS WITH SEARCH AND FILTERS
router.get("/", async (req, res) => {
  try {
    const { search, subject, unit } = req.query;
    const filter = {};

    // Query values must be strings
    for (const value of [search, subject, unit]) {
      if (value !== undefined && typeof value !== "string") {
        return res.status(400).json({
          message: "Invalid search or filter value",
        });
      }
    }

    if (search && search.trim()) {
      if (search.trim().length > 150) {
        return res.status(400).json({
          message: "Search is too long",
        });
      }

      // Treat special characters as normal search text
      const safeSearch = search
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      filter.title = {
        $regex: safeSearch,
        $options: "i",
      };
    }

    if (subject && subject.trim()) {
      filter.subject = subject.trim();
    }

    if (unit !== undefined) {
      const unitNumber = Number(unit);

      if (
        !Number.isInteger(unitNumber) ||
        unitNumber < 1 ||
        unitNumber > 5
      ) {
        return res.status(400).json({
          message: "Unit must be a number from 1 to 5",
        });
      }

      filter.unit = unitNumber;
    }

    const materials = await Material.find(filter)
      .populate("uploadedBy", "name")
      .sort({ createdAt: -1 });

    return res.json({
      count: materials.length,
      materials,
    });
  } catch (error) {
    console.error("Search error:", error.message);

    return res.status(500).json({
      message: "Could not load materials",
    });
  }
});



// Validate material ID for routes containing :id
router.param("id", (req, res, next, id) => {
  if (!mongoose.isObjectIdOrHexString(id)) {
    return res.status(400).json({
      message: "Invalid material ID",
    });
  }

  next();
});

// DOWNLOAD PDF
router.get("/:id/download", async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({
        message: "Material not found",
      });
    }

    const filePath = path.join(
      uploadsDirectory,
      material.filename
    );

    res.download(filePath, material.filename, (error) => {
      if (error && !res.headersSent) {
        res.status(error.statusCode === 404 ? 404 : 500).json({
          message: "Could not download PDF",
        });
      }
    });
  } catch (error) {
    console.error("Download error:", error.message);

    return res.status(500).json({
      message: "Could not download PDF",
    });
  }
});

// EDIT MATERIAL DETAILS  
router.put("/:id", async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    
    if (!material) {
      return res.status(404).json({
        message: "Material not found",
      });
    }

    if (!material.uploadedBy.equals(req.user._id)) {
      return res.status(403).json({
        message: "You can only edit your own material",
      });
    }

    const { title, subject, unit } = req.body || {};

    if (
      typeof title !== "string" ||
      typeof subject !== "string" ||
      !title.trim() ||
      !subject.trim()
    ) {
      return res.status(400).json({
        message: "Title and subject are required",
      });
    }

    if (title.trim().length > 150 || subject.trim().length > 100) {
      return res.status(400).json({
        message: "Title or subject is too long",
      });
    }

    const unitNumber = Number(unit);

    if (
      !Number.isInteger(unitNumber) ||
      unitNumber < 1 ||
      unitNumber > 5
    ) {
      return res.status(400).json({
        message: "Unit must be a number from 1 to 5",
      });
    }

    material.title = title.trim();
    material.subject = subject.trim();
    material.unit = unitNumber;

    await material.save();

    return res.json({
      message: "Material updated successfully",
      material,
    });
  } catch (error) {
    console.error("Update error:", error.message);

    return res.status(500).json({
      message: "Could not update material",
    });
  }
});

// DELETE MATERIAL AND PDF
router.delete("/:id", async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({
        message: "Material not found",
      });
    }

    if (!material.uploadedBy.equals(req.user._id)) {
      return res.status(403).json({
        message: "You can only delete your own material",
      });
    }

    const filePath = path.join(
      uploadsDirectory,
      material.filename
    );

    try {
      await fs.unlink(filePath);
    } catch (error) {
      // If PDF is already missing, still remove its database record
      if (error.code !== "ENOENT") {
        throw error;
      }
    }

    await material.deleteOne();

    return res.json({
      message: "Material deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error.message);

    return res.status(500).json({
      message: "Could not delete material",
    });
  }
});




module.exports = router;