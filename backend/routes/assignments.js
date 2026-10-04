const express = require("express");
const mongoose = require("mongoose");
const Assignment = require("../models/Assignment");
const auth = require("../middleware/auth");

const router = express.Router();

router.use(auth);

// Validate IDs
router.param("id", (req, res, next, id) => {
  if (!mongoose.isObjectIdOrHexString(id)) {
    return res.status(400).json({
      message: "Invalid assignment ID",
    });
  }

  next();
});

// ADD ASSIGNMENT
router.post("/", async (req, res) => {
  try {
    const { title, subject, description = "", dueDate } = req.body || {};

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

    if (
      title.trim().length > 150 ||
      subject.trim().length > 100 ||
      typeof description !== "string" ||
      description.length > 2000
    ) {
      return res.status(400).json({
        message: "Check title, subject and description lengths",
      });
    }

    const deadline =
      typeof dueDate === "string" && dueDate.trim()
        ? new Date(dueDate)
        : new Date(NaN);

    if (Number.isNaN(deadline.getTime())) {
      return res.status(400).json({
        message: "A valid due date is required",
      });
    }

    const assignment = await Assignment.create({
      title: title.trim(),
      subject: subject.trim(),
      description: description.trim(),
      dueDate: deadline,
      user: req.user._id,
    });

    return res.status(201).json({
      message: "Assignment added successfully",
      assignment,
    });
  } catch (error) {
    console.error("Add assignment error:", error.message);

    return res.status(500).json({
      message: "Could not add assignment",
    });
  }
});

// GET CURRENT USER'S ASSIGNMENTS
router.get("/", async (req, res) => {
  try {
    const assignments = await Assignment.find({
      user: req.user._id,
    }).sort({ dueDate: 1 });

    return res.json({ assignments });
  } catch (error) {
    console.error("Load assignments error:", error.message);

    return res.status(500).json({
      message: "Could not load assignments",
    });
  }
});

// CHANGE STATUS
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body || {};

    if (!["Pending", "Completed"].includes(status)) {
      return res.status(400).json({
        message: "Status must be Pending or Completed",
      });
    }

    const assignment = await Assignment.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      { $set: { status } },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found",
      });
    }

    return res.json({
      message: "Status updated successfully",
      assignment,
    });
  } catch (error) {
    console.error("Update status error:", error.message);

    return res.status(500).json({
      message: "Could not update status",
    });
  }
});

// DELETE CURRENT USER'S ASSIGNMENT
router.delete("/:id", async (req, res) => {
  try {
    const assignment = await Assignment.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found",
      });
    }

    return res.json({
      message: "Assignment deleted successfully",
    });
  } catch (error) {
    console.error("Delete assignment error:", error.message);

    return res.status(500).json({
      message: "Could not delete assignment",
    });
  }
});

module.exports = router;