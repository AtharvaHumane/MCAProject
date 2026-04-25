const router = require("express").Router();
const User = require("../models/User");

router.post("/register", async (req,res)=>{
  console.log('user-----',req.body)
  const user = await User.create(req.body);
  res.json(user);
});

router.post("/login", async (req,res)=>{
  const loginWith = req.body.loginWith === "phone" ? "phone" : "email";
  const email = typeof req.body.email === "string" ? req.body.email.trim() : "";
  const phone = typeof req.body.phone === "string" ? req.body.phone.trim() : "";
  const password = typeof req.body.password === "string" ? req.body.password : "";

  if (!password) {
    return res.status(400).json("Password is required");
  }

  if (loginWith === "email" && !email) {
    return res.status(400).json("Email is required");
  }

  if (loginWith === "phone" && !phone) {
    return res.status(400).json("Phone number is required");
  }

  const query =
    loginWith === "phone"
      ? { phone }
      : { email };

  const user = await User.findOne(query);

  if (!user) {
    return res.status(404).json({
      message: "Invalid password or username",
      field: loginWith
    });
  }

  if (user.password !== password) {
    return res.status(401).json({
      message: "Invalid password or username",
      field: "password"
    });
  }

  const userData = user.toObject();
  delete userData.password;

  res.json(userData);
});

router.get("/owners", async (req, res) => {
  try {
    const owners = await User.find({ role: "owner" }).select("_id name email");
    res.json(owners);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch owners", error: error.message });
  }
});

router.get("/cart/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("savedCart");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ savedCart: user.savedCart || [] });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch saved cart", error: error.message });
  }
});

router.put("/cart/:userId", async (req, res) => {
  try {
    const savedCart = Array.isArray(req.body.savedCart) ? req.body.savedCart : [];

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { savedCart },
      { new: true, runValidators: true }
    ).select("savedCart");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ savedCart: user.savedCart || [] });
  } catch (error) {
    res.status(500).json({ message: "Failed to save cart", error: error.message });
  }
});

module.exports = router;
