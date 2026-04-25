const router = require("express").Router();
const Booking = require("../models/Booking");

router.post("/", async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: "Failed to create booking", error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const data = await Booking.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookings", error: error.message });
  }
});

router.get("/owner/:ownerId", async (req, res) => {
  try {
    const data = await Booking.find({ owner: req.params.ownerId });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch owner bookings", error: error.message });
  }
});

router.put("/accept/:id", async (req, res) => {
  try {
    const updated = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "accepted" },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to accept booking", error: error.message });
  }
});

router.put("/reject/:id", async (req, res) => {
  try {
    const updated = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to reject booking", error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updated = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updated) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update booking", error: error.message });
  }
});

module.exports = router;
