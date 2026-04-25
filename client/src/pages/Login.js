import { useState } from "react";
import axios from "axios";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import FaceRetouchingNaturalIcon from "@mui/icons-material/FaceRetouchingNatural";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import SpaIcon from "@mui/icons-material/Spa";
import DiamondIcon from "@mui/icons-material/Diamond";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";
import FavoriteIcon from "@mui/icons-material/Favorite";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";

import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Snackbar,
  Tab,
  Tabs,
  TextField,
  Typography
} from "@mui/material";

const services = [
  {
    title: "Hair Cut & Styling",
    description:
      "Precision cuts and signature styling tailored to your face shape, texture, and personality.",
    icon: <ContentCutIcon sx={{ fontSize: 34 }} />
  },
  {
    title: "Facials & Skin Care",
    description:
      "Glow-focused skin rituals designed to refresh, hydrate, and restore your natural radiance.",
    icon: <FaceRetouchingNaturalIcon sx={{ fontSize: 34 }} />
  },
  {
    title: "Hair Coloring",
    description:
      "Rich color services from subtle glossing to bold transformations with salon-grade products.",
    icon: <ColorLensIcon sx={{ fontSize: 34 }} />
  },
  {
    title: "Keratin Treatments",
    description:
      "Smooth, soft, frizz-controlled finishes that keep your hair polished and manageable for weeks.",
    icon: <SpaIcon sx={{ fontSize: 34 }} />
  }
];

const reasons = [
  {
    title: "Expert Stylists",
    description:
      "A skilled team with modern techniques and a strong eye for detail, shape, and finish.",
    icon: <WorkspacePremiumIcon sx={{ fontSize: 38 }} />
  },
  {
    title: "Premium Products",
    description:
      "We use trusted professional products that protect your hair and elevate every treatment.",
    icon: <DiamondIcon sx={{ fontSize: 38 }} />
  },
  {
    title: "Relaxing Atmosphere",
    description:
      "A warm, dark-luxe salon mood designed to feel calm, elevated, and welcoming from the first step.",
    icon: <SelfImprovementIcon sx={{ fontSize: 38 }} />
  },
  {
    title: "Personalized Service",
    description:
      "Every appointment is shaped around your goals so the result feels custom, not generic.",
    icon: <FavoriteIcon sx={{ fontSize: 38 }} />
  }
];

const authFieldSx = {
  "& .MuiOutlinedInput-root": {
    background: "rgba(255,255,255,0.05)",
    color: "#f8fafc",
    borderRadius: 2,
    "& fieldset": {
      borderColor: "rgba(255,255,255,0.16)"
    },
    "&:hover fieldset": {
      borderColor: "rgba(255,255,255,0.3)"
    },
    "&.Mui-focused fieldset": {
      borderColor: "#f59e0b"
    },
    "& input:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0 100px rgba(255,255,255,0.05) inset",
      WebkitTextFillColor: "#f8fafc",
      caretColor: "#f8fafc",
      borderRadius: "inherit",
      transition: "background-color 9999s ease-in-out 0s"
    },
    "& input:-webkit-autofill:hover": {
      WebkitBoxShadow: "0 0 0 100px rgba(255,255,255,0.05) inset",
      WebkitTextFillColor: "#f8fafc"
    },
    "& input:-webkit-autofill:focus": {
      WebkitBoxShadow: "0 0 0 100px rgba(255,255,255,0.05) inset",
      WebkitTextFillColor: "#f8fafc"
    }
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255,255,255,0.72)"
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#fbbf24"
  },
  "& .MuiFormHelperText-root": {
    color: "#fca5a5"
  },
  "& .MuiSvgIcon-root": {
    color: "rgba(255,255,255,0.72)"
  }
};

const authSelectMenuProps = {
  PaperProps: {
    sx: {
      mt: 1,
      background: "#1d1d1d",
      color: "#f8fafc",
      border: "1px solid rgba(255,255,255,0.1)",
      boxShadow: "0 16px 40px rgba(0,0,0,0.45)",
      "& .MuiMenuItem-root": {
        color: "#f8fafc"
      },
      "& .MuiMenuItem-root:hover": {
        background: "rgba(255,255,255,0.08)"
      },
      "& .MuiMenuItem-root.Mui-selected": {
        background: "rgba(245,158,11,0.18)",
        color: "#fbbf24"
      },
      "& .MuiMenuItem-root.Mui-selected:hover": {
        background: "rgba(245,158,11,0.24)"
      }
    }
  }
};

function AuthPage() {
  const [tab, setTab] = useState(0);
  const [loginWith, setLoginWith] = useState("email");
  const [registerWith, setRegisterWith] = useState("email");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info"
  });

  const [data, setData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    role: "customer"
  });

  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const showToast = (message, severity = "info") => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const closeToast = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false
    }));
  };

  const validatePassword = (value) => {
    if (value.length < 5) {
      return "Password must be at least 5 characters";
    }

    if (!/[a-z]/.test(value)) {
      return "Password must include one lowercase letter";
    }

    if (!/[A-Z]/.test(value)) {
      return "Password must include one uppercase letter";
    }

    if (!/[0-9]/.test(value)) {
      return "Password must include one number";
    }

    if (!/[^A-Za-z0-9]/.test(value)) {
      return "Password must include one special character";
    }

    return "";
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;

    setData({ ...data, email: value });

    if (!value.endsWith("@gmail.com")) {
      setEmailError("Email must be Gmail");
    } else {
      setEmailError("");
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);

    setData({ ...data, phone: value });

    if (value.length < 10) {
      setPhoneError("Phone number must be at least 10 digits");
    } else {
      setPhoneError("");
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;

    setData({ ...data, password: value });

    if (tab === 1) {
      setPasswordError(validatePassword(value));
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    try {
      if (
        tab === 0 &&
        (!data.password ||
          (loginWith === "email" && !data.email) ||
          (loginWith === "phone" && !data.phone))
      ) {
        showToast(
          `${loginWith === "email" ? "Email" : "Phone number"} and Password required`
        );
        return;
      }

      if (tab === 0 && loginWith === "email" && !data.email.endsWith("@gmail.com")) {
        showToast("Email must be Gmail", "error");
        return;
      }

      if (tab === 0 && loginWith === "phone" && data.phone.length < 10) {
        showToast("Phone number must be at least 10 digits", "error");
        return;
      }

      if (tab === 0) {
        const res = await axios.post("http://localhost:5000/api/auth/login", {
          loginWith,
          email: data.email,
          phone: data.phone,
          password: data.password
        });

        localStorage.setItem("user", JSON.stringify(res.data));
        window.location = "/dashboard";
        return;
      }

      if (!data.name) {
        showToast("Full Name is required", "error");
        return;
      }

      if (registerWith === "email" && !data.email) {
        showToast("Email is required", "error");
        return;
      }

      if (registerWith === "email" && !data.email.endsWith("@gmail.com")) {
        setEmailError("Email must be Gmail");
        showToast("Email must be Gmail", "error");
        return;
      }

      if (registerWith === "phone" && !data.phone) {
        showToast("Phone number is required", "error");
        return;
      }

      if (registerWith === "phone" && data.phone.length < 10) {
        setPhoneError("Phone number must be at least 10 digits");
        showToast("Phone number must be at least 10 digits", "error");
        return;
      }

      const passwordValidationError = validatePassword(data.password);

      if (passwordValidationError) {
        setPasswordError(passwordValidationError);
        showToast(passwordValidationError, "error");
        return;
      }

      await axios.post("http://localhost:5000/api/auth/register", data);

      showToast("Registered successfully", "success");
      setTab(0);
      setPasswordError("");
    } catch (err) {
      const responseData = err.response?.data;
      const message =
        typeof responseData === "string"
          ? responseData
          : responseData?.message || "Error occurred";
      const field = responseData?.field;

      if (tab === 1) {
        if (field === "phone") {
          setPhoneError(message);
        }

        if (field === "password") {
          setPasswordError(message);
        }

        if (field === "email") {
          setEmailError(message);
        }
      } else {
        setEmailError("");
        setPhoneError("");
        setPasswordError("");
      }

      showToast(message, "error");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(245,158,11,0.18), transparent 26%), radial-gradient(circle at bottom right, rgba(163,230,53,0.12), transparent 22%), #242424",
        color: "#f8fafc"
      }}
    >
      <Box
        sx={{
          maxWidth: 1400,
          mx: "auto",
          px: { xs: 2, md: 4 },
          py: { xs: 3, md: 5 }
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", xl: "1.15fr 0.85fr" },
            gap: { xs: 3, lg: 5 },
            alignItems: "start"
          }}
        >
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                mb: 3
              }}
            >
              <Box
                component="img"
                src="/hairsalon-icon-192.png"
                alt="HAIRSALON"
                sx={{ width: 52, height: 52 }}
              />
              <Box>
                <Typography
                  sx={{
                    fontSize: 13,
                    textTransform: "uppercase",
                    letterSpacing: 3,
                    color: "#f59e0b"
                  }}
                >
                  Luxury Beauty Destination
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: 26, md: 34 },
                    fontWeight: 800,
                    letterSpacing: 1
                  }}
                >
                  HAIRSALON
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", lg: "1.02fr 1fr" },
                gap: 3,
                mb: 5
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  minHeight: { xs: 340, md: 520 },
                  borderRadius: 6,
                  overflow: "hidden",
                  boxShadow: "0 26px 80px rgba(0,0,0,0.45)",
                  border: "1px solid rgba(255,255,255,0.08)"
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage:
                      "linear-gradient(180deg, rgba(15,23,42,0.1), rgba(15,23,42,0.55)), url('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80')",
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    left: 18,
                    bottom: 18,
                    background: "#f97316",
                    color: "white",
                    px: 2.5,
                    py: 1.5,
                    borderRadius: "0 24px 24px 24px",
                    boxShadow: "0 10px 30px rgba(249,115,22,0.4)"
                  }}
                >
                  <Typography sx={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase" }}>
                    Signature Experience
                  </Typography>
                  <Typography sx={{ fontSize: 26, fontWeight: 800, lineHeight: 1.1 }}>
                    HAIRSALON
                  </Typography>
                  <Typography sx={{ fontSize: 15 }}>
                    Premium salon services tailored for your style.
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 2
                }}
              >
                {services.map((service) => (
                  <Paper
                    key={service.title}
                    elevation={0}
                    sx={{
                      minHeight: 230,
                      p: 3,
                      borderRadius: 4,
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: "#f8fafc",
                      boxShadow: "0 0 22px rgba(255,255,255,0.15)",
                      transition: "transform 220ms ease, box-shadow 220ms ease",
                      "&:hover": {
                        transform: "translateY(-6px)",
                        boxShadow: "0 0 30px rgba(255,255,255,0.22)"
                      }
                    }}
                  >
                    <Box sx={{ color: "#f8fafc", mb: 2 }}>{service.icon}</Box>
                    <Typography sx={{ fontSize: 28, fontWeight: 800, lineHeight: 1.1, mb: 1.5 }}>
                      {service.title}
                    </Typography>
                    <Typography sx={{ color: "rgba(248,250,252,0.82)", lineHeight: 1.9, fontSize: 16 }}>
                      {service.description}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </Box>

            <Box sx={{ maxWidth: 980, mx: "auto", textAlign: "center", mb: 3 }}>
              <Typography
                sx={{
                  fontSize: { xs: 36, md: 56 },
                  fontWeight: 800,
                  lineHeight: 1.05,
                  mb: 2
                }}
              >
                Why Choose <Box component="span" sx={{ color: "#f59e0b" }}>HAIRSALON</Box>
              </Typography>
              <Typography
                sx={{
                  color: "rgba(248,250,252,0.82)",
                  lineHeight: 1.9,
                  fontSize: { xs: 15, md: 18 }
                }}
              >
                We blend skilled artistry, premium care, and a luxurious atmosphere to create a salon
                experience that feels elevated from the moment you arrive.
              </Typography>
              <Box
                sx={{
                  width: 70,
                  height: 3,
                  borderRadius: 999,
                  background: "#f97316",
                  mx: "auto",
                  mt: 3
                }}
              />
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "repeat(4, 1fr)" },
                gap: 2.5
              }}
            >
              {reasons.map((reason) => (
                <Paper
                  key={reason.title}
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    background: "rgba(255,255,255,0.03)",
                    color: "#f8fafc",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 0 20px rgba(255,255,255,0.14)"
                  }}
                >
                  <Box sx={{ color: "#fff", mb: 2 }}>{reason.icon}</Box>
                  <Typography sx={{ fontSize: 26, fontWeight: 800, lineHeight: 1.1, mb: 1.5 }}>
                    {reason.title}
                  </Typography>
                  <Typography sx={{ color: "rgba(248,250,252,0.82)", lineHeight: 1.9 }}>
                    {reason.description}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Box>

          <Paper
            elevation={0}
            sx={{
              position: { xl: "sticky" },
              top: { xl: 24 },
              p: { xs: 2.5, md: 3.5 },
              borderRadius: 5,
              background: "rgba(10,10,10,0.72)",
              color: "#f8fafc",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
              backdropFilter: "blur(18px)"
            }}
          >
            <Typography sx={{ color: "#f59e0b", letterSpacing: 3, textTransform: "uppercase", fontSize: 12 }}>
              Welcome Back
            </Typography>
            <Typography sx={{ fontSize: { xs: 30, md: 40 }, fontWeight: 800, mb: 1 }}>
              Book Your Luxe Moment
            </Typography>
            <Typography sx={{ color: "rgba(248,250,252,0.72)", mb: 3, lineHeight: 1.8 }}>
              Log in or create your account to manage appointments, discover services, and experience
              HAIRSALON with a personalized touch.
            </Typography>

            <Tabs
              value={tab}
              onChange={(e, newValue) => {
                setTab(newValue);
                setEmailError("");
                setPhoneError("");
                setPasswordError("");
              }}
              variant="fullWidth"
              sx={{
                mb: 3,
                background: "rgba(255,255,255,0.04)",
                borderRadius: 3,
                minHeight: 56,
                "& .MuiTabs-indicator": {
                  display: "none"
                },
                "& .MuiTab-root": {
                  minHeight: 56,
                  color: "rgba(248,250,252,0.68)",
                  borderRadius: 3,
                  fontWeight: 700
                },
                "& .Mui-selected": {
                  color: "#111827 !important",
                  background: "#fbbf24"
                }
              }}
            >
              <Tab label="Login" />
              <Tab label="Register" />
            </Tabs>

            <Box component="form" onSubmit={handleSubmit} autoComplete="off">
              {tab === 0 && (
                <TextField
                  select
                  fullWidth
                  label="Login With"
                  margin="normal"
                  value={loginWith}
                  onChange={(e) => {
                    setLoginWith(e.target.value);
                    setEmailError("");
                    setPhoneError("");
                  }}
                  sx={authFieldSx}
                  inputProps={{ autoComplete: "off" }}
                  SelectProps={{ MenuProps: authSelectMenuProps }}
                >
                  <MenuItem value="email">Email</MenuItem>
                  <MenuItem value="phone">Phone Number</MenuItem>
                </TextField>
              )}

              {tab === 1 && (
                <>
                  <TextField
                    fullWidth
                    label="Full Name"
                    margin="normal"
                    value={data.name}
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                    sx={authFieldSx}
                    autoComplete="off"
                  />

                  <TextField
                    select
                    fullWidth
                    label="Register With"
                    margin="normal"
                    value={registerWith}
                    onChange={(e) => {
                      setRegisterWith(e.target.value);
                      setEmailError("");
                      setPhoneError("");
                    }}
                    sx={authFieldSx}
                    inputProps={{ autoComplete: "off" }}
                    SelectProps={{ MenuProps: authSelectMenuProps }}
                  >
                    <MenuItem value="email">Email</MenuItem>
                    <MenuItem value="phone">Phone Number</MenuItem>
                  </TextField>

                  {registerWith === "phone" && (
                    <TextField
                      fullWidth
                      label="Phone Number"
                      margin="normal"
                      value={data.phone}
                      onChange={handlePhoneChange}
                      error={!!phoneError}
                      helperText={phoneError}
                      sx={authFieldSx}
                      autoComplete="off"
                      inputProps={{ maxLength: 10 }}
                    />
                  )}

                  <TextField
                    select
                    fullWidth
                    label="Role"
                    margin="normal"
                    value={data.role}
                    onChange={(e) => setData({ ...data, role: e.target.value })}
                    sx={authFieldSx}
                    inputProps={{ autoComplete: "off" }}
                    SelectProps={{ MenuProps: authSelectMenuProps }}
                  >
                    <MenuItem value="customer">Customer</MenuItem>
                    <MenuItem value="owner">Salon Owner</MenuItem>
                  </TextField>
                </>
              )}

              {((tab === 0 && loginWith === "email") ||
                (tab === 1 && registerWith === "email")) && (
                <TextField
                  fullWidth
                  type="email"
                  label="Email"
                  margin="normal"
                  value={data.email}
                  onChange={handleEmailChange}
                  error={!!emailError}
                  helperText={emailError}
                  sx={authFieldSx}
                  autoComplete="off"
                />
              )}

              {tab === 0 && loginWith === "phone" && (
                <TextField
                  fullWidth
                  label="Phone Number"
                  margin="normal"
                  value={data.phone}
                  onChange={handlePhoneChange}
                  error={!!phoneError}
                  helperText={phoneError}
                  sx={authFieldSx}
                  autoComplete="off"
                  inputProps={{ maxLength: 10 }}
                />
              )}

              <TextField
                fullWidth
                type={showPassword ? "text" : "password"}
                label="Password"
                margin="normal"
                value={data.password}
                onChange={handlePasswordChange}
                error={tab === 1 && !!passwordError}
                helperText={tab === 1 ? passwordError : ""}
                sx={authFieldSx}
                autoComplete="new-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={() => setShowPassword((prev) => !prev)}
                        sx={{ color: "#cbd5e1" }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <Button
                fullWidth
                variant="contained"
                type="submit"
                sx={{
                  mt: 3,
                  py: 1.7,
                  borderRadius: 999,
                  fontSize: 16,
                  fontWeight: 800,
                  letterSpacing: 0.4,
                  background: "linear-gradient(135deg, #f97316, #fbbf24)",
                  color: "#111827",
                  boxShadow: "0 14px 30px rgba(249,115,22,0.35)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #ea580c, #f59e0b)"
                  }
                }}
                disabled={
                  !data.password ||
                  (tab === 0 &&
                    ((loginWith === "email" && (!data.email || !!emailError)) ||
                      (loginWith === "phone" && (!data.phone || !!phoneError)))) ||
                  (tab === 1 &&
                    (!!passwordError ||
                      !data.name ||
                      (registerWith === "email" && (!data.email || !!emailError)) ||
                      (registerWith === "phone" && (!data.phone || !!phoneError))))
                }
              >
                {tab === 0 ? "Enter HAIRSALON" : "Create Your Account"}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>

      <Box
        sx={{
          mt: 4,
          background: "rgba(28, 38, 11, 0.82)",
          borderTop: "1px solid rgba(255,255,255,0.08)"
        }}
      >
        <Box
          sx={{
            maxWidth: 1400,
            mx: "auto",
            px: { xs: 2, md: 4 },
            py: { xs: 5, md: 7 },
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.05fr 1fr 1fr 1fr" },
            gap: 4
          }}
        >
          <Box>
            <Box
              sx={{
                width: 110,
                height: 110,
                border: "1px solid rgba(255,255,255,0.35)",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255,255,255,0.03)",
                mb: 2.5
              }}
            >
              <Box
                component="img"
                src="/hairsalon-icon-192.png"
                alt="HAIRSALON logo"
                sx={{ width: 76, height: 76 }}
              />
            </Box>
            <Typography sx={{ fontSize: 17, lineHeight: 2, color: "rgba(248,250,252,0.9)" }}>
              HAIRSALON offers premium hair and beauty care with signature styling, luxe ambiance,
              and personalized service designed to make every visit feel special.
            </Typography>
          </Box>

          <Box>
            <Typography sx={{ fontSize: 22, fontWeight: 800, mb: 2.5 }}>
              Contact Info
            </Typography>
            <Typography sx={{ fontSize: 18, fontWeight: 700, mb: 1.5 }}>
              HAIRSALON Beauty Lounge
            </Typography>
            <Typography sx={{ fontSize: 17, lineHeight: 2, color: "rgba(248,250,252,0.9)" }}>
              Shop No 2, Nahre Main Road
              <br />
              Near Zeal Colleage
              <br />
              Pune City - 411041
            </Typography>
            <Typography sx={{ fontSize: 17, mt: 2.5, color: "rgba(248,250,252,0.9)" }}>
              Ph: +91 91585 76814
            </Typography>
          </Box>

          <Box>
            <Typography sx={{ fontSize: 22, fontWeight: 800, mb: 2.5 }}>
              Services
            </Typography>
            {[
              "Keratin Treatment",
              "Hair Cut & Styling",
              "D-Tan",
              "Skin Care",
              "Scrub",
              "Trimming",
              "Bridal Makeup"
            ].map((item) => (
              <Typography
                key={item}
                sx={{ fontSize: 17, mb: 1.3, color: "rgba(248,250,252,0.9)" }}
              >
                {item}
              </Typography>
            ))}
          </Box>

          <Box>
            <Typography sx={{ fontSize: 22, fontWeight: 800, mb: 2.5 }}>
              Get In Touch
            </Typography>
            <Typography sx={{ fontSize: 17, lineHeight: 2, color: "rgba(248,250,252,0.9)", mb: 2.5 }}>
              Booking your next salon session is just a click away. Reach out and let HAIRSALON
              create your next signature look.
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1,
                  background: "#f97316",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <FacebookIcon sx={{ color: "white", fontSize: 20 }} />
              </Box>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1,
                  background: "#f97316",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <InstagramIcon sx={{ color: "white", fontSize: 20 }} />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={closeToast}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={closeToast}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: "100%",
            alignItems: "center",
            boxShadow: 6
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default AuthPage;
