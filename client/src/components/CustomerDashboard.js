import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import AddShoppingCartRoundedIcon from "@mui/icons-material/AddShoppingCartRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";

const apiBaseUrl = "http://localhost:5000/api";

const salonGalleryImages = [
  "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1522336572468-97b06e8ef143?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1527799820374-36f3f9f5a1c0?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=80"
];

const getSalonImage = (index = 0) => salonGalleryImages[index % salonGalleryImages.length];

const serviceCatalog = [
  {
    type: "Hair Cut",
    subtitle: "Clean cuts, fades, and premium styling for every look.",
    image:
      "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=900&q=80",
    items: [
      { name: "Basic Hair Cut", price: 150, subtitle: "Neat everyday grooming" },
      { name: "Stylish Hair Cut", price: 250, subtitle: "Modern cut with shape" },
      { name: "Layer Cut", price: 300, subtitle: "Adds texture and movement" },
      { name: "Step Cut", price: 300, subtitle: "Layered stepped finish" },
      { name: "Fade Cut", price: 350, subtitle: "Sharp taper with clean edges" },
      { name: "Undercut", price: 300, subtitle: "Bold top-heavy style" },
      { name: "Kids Hair Cut", price: 120, subtitle: "Simple and comfortable" },
      { name: "Senior Citizen Cut", price: 100, subtitle: "Gentle, tidy grooming" },
      { name: "Beard + Hair Combo Cut", price: 400, subtitle: "Complete head-to-beard look" },
      { name: "Premium Salon Cut", price: 500, subtitle: "Signature luxury styling" }
    ]
  },
  {
    type: "Beard",
    subtitle: "Sharp beard trims, clean shaves, and grooming rituals.",
    image:
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=900&q=80",
    items: [
      { name: "Basic Beard Trim", price: 80, subtitle: "Quick tidy-up trim" },
      { name: "Beard Styling", price: 150, subtitle: "Shape and style control" },
      { name: "Clean Shave", price: 100, subtitle: "Smooth finish shave" },
      { name: "Razor Shave", price: 120, subtitle: "Classic barber razor work" },
      { name: "Beard Design", price: 180, subtitle: "Detailed design shaping" },
      { name: "Long Beard Set", price: 200, subtitle: "Controlled long-beard styling" },
      { name: "Beard Color", price: 250, subtitle: "Natural-looking color refresh" },
      { name: "Beard Spa", price: 300, subtitle: "Deep care and softening" },
      { name: "Hot Towel Shave", price: 180, subtitle: "Relaxing hot towel treatment" },
      { name: "Premium Beard Grooming", price: 350, subtitle: "Luxury grooming service" }
    ]
  },
  {
    type: "Massage",
    subtitle: "Relaxing massage therapies for body and mind.",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=900&q=80",
    items: [
      { name: "Head Massage", price: 100, subtitle: "Quick stress relief" },
      { name: "Oil Head Massage", price: 150, subtitle: "Deep soothing scalp care" },
      { name: "Shoulder Massage", price: 120, subtitle: "Release upper-body tension" },
      { name: "Full Body Massage", price: 600, subtitle: "Complete body relaxation" },
      { name: "Foot Massage", price: 150, subtitle: "Rest and recovery for feet" },
      { name: "Neck Massage", price: 120, subtitle: "Ease tight neck muscles" },
      { name: "Relaxation Massage", price: 400, subtitle: "Calming wellness session" },
      { name: "Deep Tissue Massage", price: 700, subtitle: "Targeted muscle release" },
      { name: "Aroma Therapy Massage", price: 800, subtitle: "Essential oil spa blend" },
      { name: "Premium Spa Massage", price: 1200, subtitle: "Full luxury treatment" }
    ]
  },
  {
    type: "Hair Spa",
    subtitle: "Nourishing spa care for softness, shine, and repair.",
    image:
      "https://images.unsplash.com/photo-1522336572468-97b06e8ef143?auto=format&fit=crop&w=900&q=80",
    items: [
      { name: "Basic Hair Spa", price: 300, subtitle: "Simple refresh and care" },
      { name: "Anti-Dandruff Spa", price: 400, subtitle: "Scalp comfort treatment" },
      { name: "Hair Fall Control Spa", price: 450, subtitle: "Strengthening support" },
      { name: "Protein Hair Spa", price: 500, subtitle: "Repair with protein care" },
      { name: "Smoothening Spa", price: 600, subtitle: "Softer, smoother finish" },
      { name: "Keratin Hair Spa", price: 700, subtitle: "Keratin smoothing care" },
      { name: "Scalp Treatment Spa", price: 550, subtitle: "Healthy scalp restoration" },
      { name: "Herbal Hair Spa", price: 450, subtitle: "Plant-based nourishment" },
      { name: "Oil Therapy Spa", price: 350, subtitle: "Warm oil therapy care" },
      { name: "Premium Hair Spa", price: 900, subtitle: "Luxury repair ritual" }
    ]
  },
  {
    type: "Face Mask",
    subtitle: "Fresh masks for glow, hydration, and skin clarity.",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80",
    items: [
      { name: "Basic Face Mask", price: 100, subtitle: "Simple skin refresh" },
      { name: "Fruit Face Mask", price: 150, subtitle: "Vitamin-rich glow care" },
      { name: "Charcoal Mask", price: 200, subtitle: "Deep pore cleansing" },
      { name: "Gold Face Mask", price: 250, subtitle: "Radiance-focused treatment" },
      { name: "Anti-Acne Mask", price: 180, subtitle: "Blemish support care" },
      { name: "Hydrating Mask", price: 220, subtitle: "Moisture boost therapy" },
      { name: "Herbal Mask", price: 200, subtitle: "Gentle natural care" },
      { name: "Whitening Mask", price: 250, subtitle: "Brightness enhancement" },
      { name: "Detan Mask", price: 300, subtitle: "Tan removal treatment" },
      { name: "Premium Glow Mask", price: 400, subtitle: "Brighter luxury finish" }
    ]
  },
  {
    type: "Hair Color",
    subtitle: "Color services from subtle root touch-ups to bold fashion shades.",
    image:
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=900&q=80",
    items: [
      { name: "Root Touch-Up", price: 300, subtitle: "Freshen the roots" },
      { name: "Global Hair Color", price: 800, subtitle: "All-over color change" },
      { name: "Highlights", price: 700, subtitle: "Light-catching strands" },
      { name: "Lowlights", price: 700, subtitle: "Soft depth and contrast" },
      { name: "Beard Color", price: 250, subtitle: "Blend beard tones" },
      { name: "Ammonia-Free Color", price: 900, subtitle: "Gentler color option" },
      { name: "Fashion Color", price: 1200, subtitle: "Creative bold shade" },
      { name: "Streak Coloring", price: 500, subtitle: "Accent color streaks" },
      { name: "Temporary Color", price: 300, subtitle: "Short-term color trial" },
      { name: "Premium Hair Color", price: 1500, subtitle: "Signature color service" }
    ]
  },
  {
    type: "Facial",
    subtitle: "Facials for skin polish, glow, and advanced care.",
    image:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80",
    items: [
      { name: "Basic Facial", price: 300, subtitle: "Simple cleansing facial" },
      { name: "Fruit Facial", price: 400, subtitle: "Fresh fruit-infused care" },
      { name: "Gold Facial", price: 600, subtitle: "Glow and premium finish" },
      { name: "Diamond Facial", price: 800, subtitle: "Brightening luxury facial" },
      { name: "Anti-Aging Facial", price: 900, subtitle: "Firming skin support" },
      { name: "Acne Treatment Facial", price: 700, subtitle: "Acne-focused treatment" },
      { name: "Whitening Facial", price: 750, subtitle: "Tone and radiance boost" },
      { name: "Herbal Facial", price: 500, subtitle: "Gentle botanical care" },
      { name: "Detan Facial", price: 650, subtitle: "Sun tan recovery facial" },
      { name: "Premium Luxury Facial", price: 1200, subtitle: "High-end spa facial" }
    ]
  }
];

const timeSlots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
  "08:00 PM"
];

function CustomerDashboard() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [owners, setOwners] = useState([]);
  const [ownerId, setOwnerId] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [selectedType, setSelectedType] = useState(serviceCatalog[0].type);
  const [selectedService, setSelectedService] = useState(serviceCatalog[0].items[0]);
  const [cartReady, setCartReady] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const user = JSON.parse(localStorage.getItem("user"));
  const cartStorageKey = `customerCart:${user?._id || "guest"}`;
  const currentCategory = serviceCatalog.find((item) => item.type === selectedType) || serviceCatalog[0];
  const displayedService = currentCategory.items.find((item) => item.name === selectedService?.name) || currentCategory.items[0];
  const currentCategoryIndex = serviceCatalog.findIndex((item) => item.type === currentCategory.type);
  const previewImage = getSalonImage(currentCategoryIndex);
  const total = cart.reduce((sum, item) => sum + Number(item.price || 0), 0);
  const minimumDate = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const loadSavedCart = async () => {
      if (!user?._id) {
        setCart([]);
        setCartReady(true);
        return;
      }

      try {
        const res = await axios.get(`${apiBaseUrl}/auth/cart/${user._id}`);
        const savedCart = Array.isArray(res.data?.savedCart) ? res.data.savedCart : [];
        setCart(savedCart);
        localStorage.setItem(cartStorageKey, JSON.stringify(savedCart));
      } catch (error) {
        console.error("Failed to load cart from server:", error);

        try {
          const storedCart = localStorage.getItem(cartStorageKey);
          setCart(storedCart ? JSON.parse(storedCart) : []);
        } catch (fallbackError) {
          console.error("Failed to load fallback cart:", fallbackError);
          setCart([]);
        }
      } finally {
        setCartReady(true);
      }
    };

    loadSavedCart();
  }, [cartStorageKey, user?._id]);

  useEffect(() => {
    const saveCart = async () => {
      if (!cartReady || !user?._id) {
        return;
      }

      try {
        await axios.put(`${apiBaseUrl}/auth/cart/${user._id}`, { savedCart: cart });
        localStorage.setItem(cartStorageKey, JSON.stringify(cart));
      } catch (error) {
        console.error("Failed to save cart to server:", error);

        try {
          localStorage.setItem(cartStorageKey, JSON.stringify(cart));
        } catch (fallbackError) {
          console.error("Failed to save fallback cart:", fallbackError);
        }
      }
    };

    saveCart();
  }, [cart, cartStorageKey, cartReady, user?._id]);

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const res = await axios.get(`${apiBaseUrl}/auth/owners`);
        setOwners(res.data);

        if (res.data.length > 0) {
          setOwnerId(res.data[0]._id);
        }
      } catch (error) {
        console.error("Failed to fetch owners:", error);
        setSnackbar({
          open: true,
          message: "Could not load salon owners right now.",
          severity: "error"
        });
      }
    };

    fetchOwners();
  }, []);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const addToCart = (item, category) => {
    setCart((prev) => [...prev, { ...item, category }]);
    showSnackbar(`${item.name} added to cart.`);
  };

  const selectCategory = (event) => {
    const nextType = event.target.value;
    setSelectedType(nextType);

    const nextCategory = serviceCatalog.find((item) => item.type === nextType) || serviceCatalog[0];
    setSelectedService(nextCategory.items[0]);
  };

  const removeItem = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const handleBooking = async () => {
    if (!ownerId) {
      showSnackbar("Please select a salon owner.", "error");
      return;
    }

    if (!date) {
      showSnackbar("Please select a booking date.", "error");
      return;
    }

    if (!time) {
      showSnackbar("Please select a time slot.", "error");
      return;
    }

    if (!cart.length) {
      showSnackbar("Please add at least one service to your cart.", "error");
      return;
    }

    try {
      await axios.post(`${apiBaseUrl}/bookings`, {
        customer: user?._id,
        customerName: user?.name,
        owner: ownerId,
        services: cart.map(({ name, price, category }) => ({ name, price, category })),
        total,
        date,
        time
      });

      setCart([]);
      setDate("");
      setTime("");
      setCartOpen(false);
      showSnackbar("Appointment booked successfully.");
    } catch (error) {
      console.error("Failed to create booking:", error);
      showSnackbar(
        error.response?.data?.message || "Could not book the appointment right now.",
        "error"
      );
    }
  };

  const handleLogout = async () => {
    try {
      if (user?._id) {
        await axios.put(`${apiBaseUrl}/auth/cart/${user._id}`, { savedCart: [] });
      }
      localStorage.removeItem(cartStorageKey);
    } catch (error) {
      console.error("Failed to clear saved cart on logout:", error);
    } finally {
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  const handleProfileMenuOpen = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  const handleProfileAction = (action) => {
    handleProfileMenuClose();

    if (action === "profile") {
      showSnackbar("Profile view is coming soon.");
      return;
    }

    if (action === "bookings") {
      showSnackbar("Your bookings view is coming soon.");
      return;
    }

    if (action === "logout") {
      handleLogout();
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(249,115,22,0.18), transparent 24%), radial-gradient(circle at bottom right, rgba(245,158,11,0.16), transparent 18%), #09090b",
        color: "#f8fafc",
        p: { xs: 2, md: 4 }
      }}
    >
      <Box sx={{ maxWidth: 1450, mx: "auto" }}>
        <Paper
          elevation={0}
          sx={{
            mb: 4,
            px: { xs: 2, md: 3 },
            py: 2,
            borderRadius: 4,
            background: "rgba(15,15,15,0.72)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(14px)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.28)"
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", md: "center" },
              flexWrap: "wrap",
              gap: 2
            }}
          >
            <Box>
              <Typography
                sx={{
                  color: "#f59e0b",
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  fontSize: 12
                }}
              >
                Customer Dashboard
              </Typography>
              <Typography sx={{ color :'white' ,fontSize: { xs: 20, md: 30 }, fontWeight: 900, lineHeight: 1.05 }}>
                Book your salon appointment
              </Typography>
              <Typography sx={{ color: "rgba(248, 250, 252, 0.7)", mt: 1 }}>
                Select services, then open the cart to choose your date and time slot.
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.2} alignItems="center" sx={{ flexWrap: "wrap" }}>
              <Button
                variant="outlined"
                onClick={() => setCartOpen(true)}
                startIcon={
                  <Badge badgeContent={cart.length} color="error">
                    <ShoppingCartRoundedIcon />
                  </Badge>
                }
                sx={{
                  borderColor: "rgba(255,255,255,0.22)",
                  color: "#f8fafc",
                  borderRadius: 999,
                  px: 2.25,
                  minHeight: 44,
                  textTransform: "none"
                }}
              >
                Cart
              </Button>

              <Button
                onClick={handleProfileMenuOpen}
                startIcon={
                  <Avatar
                    sx={{
                      width: 30,
                      height: 30,
                      bgcolor: "#f97316",
                      color: "#111827",
                      fontSize: 14,
                      fontWeight: 800
                    }}
                  >
                    {(user?.name || "C").slice(0, 1).toUpperCase()}
                  </Avatar>
                }
                endIcon={<ExpandMoreRoundedIcon />}
                sx={{
                  borderRadius: 999,
                  color: "#f8fafc",
                  textTransform: "none",
                  px: 1.5,
                  minHeight: 44,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  "&:hover": {
                    background: "rgba(255,255,255,0.07)"
                  }
                }}
              >
                {user?.name || "Customer"}
              </Button>
            </Stack>
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            borderRadius: 5,
            overflow: "hidden",
            border: "1px solid rgba(245,158,11,0.24)",
            background: "linear-gradient(180deg, rgba(13,13,16,0.98), rgba(9,9,11,0.98))",
            boxShadow: "0 28px 60px rgba(0,0,0,0.35)",
            p: { xs: 2, md: 3 }
          }}
        >
          <Box
            sx={{
              border: "4px solid #d97706",
              borderRadius: 4,
              p: { xs: 2, md: 3 }
            }}
          >
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography
                sx={{
                  fontSize: { xs: 36, md: 52 },
                  fontWeight: 900,
                  letterSpacing: 3,
                  color: "#ffffff"
                }}
              >
                HAIRSALON
              </Typography>
              <Typography sx={{ fontSize: { xs: 16, md: 22 }, letterSpacing: 4, color: "#e5e7eb" }}>
                MENS
              </Typography>
            </Box>

            <Paper
              elevation={0}
              sx={{
                mt: 1,
                p: { xs: 2, md: 2.5 },
                borderRadius: 4,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)"
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Box
                    sx={{
                      height: "100%",
                      borderRadius: 4,
                      overflow: "hidden",
                      border: "1px solid rgba(255,255,255,0.08)",
                      background:
                        "linear-gradient(180deg, rgba(249,115,22,0.16), rgba(0,0,0,0.55))"
                    }}
                  >
                    <Box
                      component="img"
                      src={previewImage}
                      alt={currentCategory.type}
                      sx={{
                        width: "100%",
                        height: { xs: 220, md: 260 },
                        objectFit: "cover",
                        display: "block"
                      }}
                    />
                    <Box sx={{ p: 2.5 }}>
                      <Typography sx={{ color: "#f59e0b", fontSize: 12, letterSpacing: 2, textTransform: "uppercase" }}>
                        Featured Service
                      </Typography>
                      <Typography sx={{ fontSize: 28, fontWeight: 900, mt: 0.5 }}>
                        {displayedService.name}
                      </Typography>
                      <Typography sx={{ color: "rgba(248,250,252,0.78)", mt: 1, lineHeight: 1.8 }}>
                        {currentCategory.subtitle}
                      </Typography>
                      <Typography sx={{ color: "#fbbf24", fontSize: 24, fontWeight: 900, mt: 2 }}>
                        Rs. {displayedService.price}
                      </Typography>
                      <Typography sx={{ color: "rgba(248,250,252,0.7)", fontSize: 13, mt: 0.5 }}>
                        {displayedService.subtitle}
                      </Typography>
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<AddShoppingCartRoundedIcon />}
                        onClick={() => addToCart(displayedService, currentCategory.type)}
                        sx={{
                          mt: 2,
                          py: 1.4,
                          borderRadius: 999,
                          textTransform: "none",
                          fontWeight: 800,
                          background: "linear-gradient(135deg, #f97316, #fbbf24)",
                          color: "#111827"
                        }}
                      >
                        Add selected service
                      </Button>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} md={8}>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <TextField
                      select
                      fullWidth
                      label="Service Type"
                      value={selectedType}
                      onChange={selectCategory}
                      InputLabelProps={{
                        sx: {
                          color: "#f8fafc",
                          "&.Mui-focused": { color: "#fbbf24" }
                        }
                      }}
                      SelectProps={{
                        MenuProps: {
                          PaperProps: {
                            sx: {
                              mt: 1,
                              background: "#111827",
                              color: "#f8fafc",
                              border: "1px solid rgba(255,255,255,0.1)",
                              "& .MuiMenuItem-root": {
                                color: "#f8fafc"
                              }
                            }
                          }
                        }
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          background: "rgba(255,255,255,0.05)",
                          color: "#f8fafc",
                          borderRadius: 2.5,
                          "& fieldset": {
                            borderColor: "rgba(59,130,246,0.9)"
                          },
                          "&:hover fieldset": {
                            borderColor: "rgba(59,130,246,1)"
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#fbbf24"
                          }
                        },
                        "& .MuiSelect-icon": {
                          color: "#f8fafc"
                        }
                      }}
                    >
                      {serviceCatalog.map((category) => (
                        <MenuItem key={category.type} value={category.type}>
                          {category.type}
                        </MenuItem>
                      ))}
                    </TextField>

                    <Typography sx={{ color: "rgba(248,250,252,0.72)" }}>
                      {currentCategory.subtitle}
                    </Typography>

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "1fr",
                          sm: "repeat(2, minmax(0, 1fr))"
                        },
                        gap: 1.5,
                        alignItems: "stretch"
                      }}
                    >
                      {currentCategory.items.map((item) => {
                        const isActive = item.name === displayedService.name;

                        return (
                          <Card
                            key={`${currentCategory.type}-${item.name}`}
                            elevation={0}
                            onClick={() => setSelectedService(item)}
                            sx={{
                              cursor: "pointer",
                              overflow: "hidden",
                              borderRadius: 3,
                              background: isActive
                                ? "linear-gradient(180deg, rgba(249,115,22,0.18), rgba(255,255,255,0.04))"
                                : "rgba(255,255,255,0.03)",
                              border: isActive
                                ? "1px solid rgba(249,115,22,0.6)"
                                : "1px solid rgba(255,255,255,0.08)",
                              color: "#f8fafc",
                              display: "flex",
                              minHeight: 112,
                              transition: "transform 180ms ease, border-color 180ms ease",
                              "&:hover": {
                                transform: "translateY(-2px)",
                                borderColor: "rgba(251,191,36,0.65)"
                              }
                            }}
                          >
                            <CardContent
                              sx={{
                                display: "grid",
                                gridTemplateColumns: "92px 1fr",
                                gap: 1.5,
                                width: "100%",
                                alignItems: "center",
                                p: 1.5,
                                "&:last-child": { pb: 1.5 }
                              }}
                            >
                              <Box
                                component="img"
                                src={getSalonImage(serviceCatalog.findIndex((entry) => entry.type === currentCategory.type) + currentCategory.items.findIndex((entry) => entry.name === item.name) + 1)}
                                alt={item.name}
                                sx={{
                                  width: 92,
                                  height: 92,
                                  borderRadius: 2,
                                  objectFit: "cover",
                                  display: "block"
                                }}
                              />

                              <Box sx={{ minWidth: 0 }}>
                                <Typography
                                  sx={{
                                    fontSize: 16,
                                    fontWeight: 800,
                                    lineHeight: 1.2,
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden"
                                  }}
                                >
                                  {item.name}
                                </Typography>
                                <Typography sx={{ color: "rgba(248,250,252,0.72)", fontSize: 13, mt: 0.5 }}>
                                  {item.subtitle}
                                </Typography>
                                <Typography sx={{ color: "#fbbf24", fontSize: 18, fontWeight: 900, mt: 1 }}>
                                  Rs. {item.price}
                                </Typography>

                                <Button
                                  variant="contained"
                                  size="small"
                                  startIcon={<AddShoppingCartRoundedIcon />}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    addToCart(item, currentCategory.type);
                                  }}
                                  sx={{
                                    mt: 1.2,
                                    borderRadius: 999,
                                    textTransform: "none",
                                    fontWeight: 700,
                                    background: "linear-gradient(135deg, #f97316, #fbbf24)",
                                    color: "#111827",
                                    "&:hover": {
                                      background: "linear-gradient(135deg, #ea580c, #f59e0b)"
                                    }
                                  }}
                                >
                                  Add
                                </Button>
                              </Box>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </Paper>
      </Box>

      <Drawer
        anchor="right"
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 440 },
            maxWidth: "100%",
            background:
              "linear-gradient(180deg, rgba(17,24,39,0.98), rgba(9,9,11,0.98))",
            color: "#f8fafc",
            borderLeft: "2px solid rgba(251,191,36,0.34)",
            boxShadow: "-20px 0 60px rgba(0,0,0,0.45)"
          }
        }}
      >
        <Box
          sx={{
            m: 1.5,
            p: 2.5,
            height: "calc(100% - 24px)",
            display: "flex",
            flexDirection: "column",
            borderRadius: 4,
            border: "1px solid rgba(251,191,36,0.18)",
            background: "rgba(255,255,255,0.02)"
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
              pb: 2,
              borderBottom: "1px solid rgba(255,255,255,0.08)"
            }}
          >
            <Box>
              <Typography sx={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 2, color: "#fbbf24" }}>
                Your Cart
              </Typography>
              <Typography sx={{ fontSize: 24, fontWeight: 900, color: "#f8fafc" }}>
                Appointment cart
              </Typography>
            </Box>
            <IconButton onClick={() => setCartOpen(false)} sx={{ color: "#f8fafc" }}>
              <CloseRoundedIcon />
            </IconButton>
          </Box>

          <Typography sx={{ color: "rgba(248,250,252,0.7)", mb: 2 }}>
            Hello {user?.name || "Customer"}, review your selected services before booking.
          </Typography>

          <TextField
            select
            fullWidth
            label="Select owner"
            value={ownerId}
            onChange={(e) => setOwnerId(e.target.value)}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                background: "rgba(255,255,255,0.05)",
                color: "#f8fafc",
                borderRadius: 2,
                "& fieldset": {
                  borderColor: "rgba(255,255,255,0.15)"
                },
                "&:hover fieldset": {
                  borderColor: "rgba(251,191,36,0.5)"
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#fbbf24"
                }
              },
              "& .MuiInputLabel-root": {
                color: "rgba(248,250,252,0.72)"
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#fbbf24"
              },
              "& .MuiSelect-icon": {
                color: "#f8fafc"
              }
            }}
            InputLabelProps={{
              sx: { color: "rgba(248,250,252,0.72)" }
            }}
          >
            {owners.map((owner) => (
              <MenuItem key={owner._id} value={owner._id}>
                {owner.name}
              </MenuItem>
            ))}
          </TextField>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Booking date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: minimumDate }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    background: "rgba(255,255,255,0.05)",
                    color: "#f8fafc",
                    borderRadius: 2,
                    "& fieldset": {
                      borderColor: "rgba(255,255,255,0.15)"
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(251,191,36,0.5)"
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#fbbf24"
                    }
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(248,250,252,0.72)"
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#fbbf24"
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Time slot"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    background: "rgba(255,255,255,0.05)",
                    color: "#f8fafc",
                    borderRadius: 2,
                    "& fieldset": {
                      borderColor: "rgba(255,255,255,0.15)"
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(251,191,36,0.5)"
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#fbbf24"
                    }
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(248,250,252,0.72)"
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#fbbf24"
                  },
                  "& .MuiSelect-icon": {
                    color: "#f8fafc"
                  }
                }}
              >
                {timeSlots.map((slot) => (
                  <MenuItem key={slot} value={slot}>
                    {slot}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <Box
            sx={{
              p: 2,
              borderRadius: 3,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(251,191,36,0.18)",
              mb: 2,
              flex: 1,
              minHeight: 0,
              display: "flex",
              flexDirection: "column"
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <StorefrontRoundedIcon sx={{ color: "#fbbf24" }} />
              <Typography sx={{ fontWeight: 800, color: "#f8fafc" }}>
                Selected services
              </Typography>
            </Box>

            <Box sx={{ flex: 1, overflowY: "auto" }}>
              <List sx={{ py: 0 }}>
                {cart.map((item, index) => (
                  <ListItem
                    key={`${item.name}-${index}`}
                    disableGutters
                    secondaryAction={
                      <IconButton edge="end" color="error" onClick={() => removeItem(index)}>
                        <DeleteOutlineRoundedIcon />
                      </IconButton>
                    }
                    sx={{ pr: 6 }}
                  >
                    <ListItemText
                      primary={item.name}
                      secondary={`${item.category} - Rs. ${item.price}`}
                      primaryTypographyProps={{ fontWeight: 700, color: "#f8fafc" }}
                      secondaryTypographyProps={{ color: "rgba(248,250,252,0.7)" }}
                    />
                  </ListItem>
                ))}

                {!cart.length && (
                  <Typography sx={{ color: "rgba(248,250,252,0.65)", py: 1 }}>
                    No service added yet. Tap "Add" from the menu.
                  </Typography>
                )}
              </List>
            </Box>
          </Box>

          <Divider sx={{ mb: 2, borderColor: "rgba(255,255,255,0.1)" }} />

          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
            <Typography sx={{ color: "rgba(248,250,252,0.72)" }}>Items in cart</Typography>
            <Chip
              label={cart.length}
              sx={{
                fontWeight: 700,
                background: "rgba(251,191,36,0.14)",
                color: "#fbbf24"
              }}
            />
          </Stack>

          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
            <Typography sx={{ fontSize: 18, fontWeight: 800, color: "#f8fafc" }}>
              Total amount
            </Typography>
            <Typography sx={{ fontSize: 24, fontWeight: 900, color: "#fbbf24" }}>
              Rs. {total}
            </Typography>
          </Stack>

          <Button
            fullWidth
            variant="contained"
            onClick={handleBooking}
            sx={{
              py: 1.5,
              borderRadius: 999,
              textTransform: "none",
              fontWeight: 800,
              fontSize: 16,
              background: "linear-gradient(135deg, #f97316, #fbbf24)",
              color: "#111827",
              boxShadow: "0 18px 32px rgba(249,115,22,0.28)",
              "&:hover": {
                background: "linear-gradient(135deg, #ea580c, #f59e0b)"
              }
            }}
          >
            Book appointment
          </Button>
        </Box>
      </Drawer>

      <Menu
        anchorEl={profileAnchorEl}
        open={Boolean(profileAnchorEl)}
        onClose={handleProfileMenuClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 250,
            borderRadius: 3,
            overflow: "hidden"
          }
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography sx={{ fontWeight: 800, color: "#334155" }}>Your Account</Typography>
          <Typography sx={{ fontSize: 13, color: "#64748b" }}>
            {user?.name || "Customer"}
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={() => handleProfileAction("profile")} sx={{ py: 1.2 }}>
          <ListItemIcon>
            <PersonOutlineRoundedIcon fontSize="small" />
          </ListItemIcon>
          My Profile
        </MenuItem>
        <MenuItem onClick={() => handleProfileAction("bookings")} sx={{ py: 1.2 }}>
          <ListItemIcon>
            <ReceiptLongRoundedIcon fontSize="small" />
          </ListItemIcon>
          My Bookings
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleProfileAction("logout")} sx={{ py: 1.2, color: "#b91c1c" }}>
          <ListItemIcon sx={{ color: "inherit" }}>
            <LogoutRoundedIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default CustomerDashboard;
