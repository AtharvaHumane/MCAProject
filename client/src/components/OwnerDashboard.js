import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Snackbar,
  TextField,
  Typography
} from "@mui/material";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import ContentCutRoundedIcon from "@mui/icons-material/ContentCutRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";

const sidebarWidth = 250;

function OwnerDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [open, setOpen] = useState(false);
  const [service, setService] = useState({ name: "", price: "" });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const user = JSON.parse(localStorage.getItem("user"));
  const apiBaseUrl = "http://localhost:5000/api";

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchBookings = useCallback(async () => {
    if (!user?._id) {
      setBookings([]);
      return;
    }

    try {
      const res = await axios.get(`${apiBaseUrl}/bookings/owner/${user._id}`);
      setBookings(res.data);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      setBookings([]);
      showSnackbar(
        error.response?.data?.message || "Could not load bookings right now.",
        "error"
      );
    }
  }, [user?._id]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleAddService = async () => {
    try {
      await axios.post(`${apiBaseUrl}/services`, {
        ...service,
        owner: user._id
      });

      setOpen(false);
      setService({ name: "", price: "" });
      showSnackbar("Service added");
    } catch (error) {
      console.error("Failed to add service:", error);
      showSnackbar(
        error.response?.data?.message || "Could not add service right now.",
        "error"
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const todayBookings = bookings.filter((booking) => booking.date === new Date().toISOString().slice(0, 10));
  const acceptedBookings = bookings.filter((booking) => booking.status === "accepted");
  const pendingBookings = bookings.filter((booking) => booking.status === "pending");
  const rejectedBookings = bookings.filter((booking) => booking.status === "rejected");

  const getBookingRevenue = (booking) => {
    if (typeof booking.total === "number") {
      return booking.total;
    }

    return (booking.services || []).reduce(
      (sum, item) => sum + Number(item.price || 0),
      0
    );
  };

  const totalRevenue = acceptedBookings.reduce(
    (sum, booking) => sum + getBookingRevenue(booking),
    0
  );

  const todayRevenue = todayBookings.reduce(
    (sum, booking) => sum + getBookingRevenue(booking),
    0
  );

  const completionRate = bookings.length
    ? Math.round((acceptedBookings.length / bookings.length) * 100)
    : 0;
  const averageRevenue = acceptedBookings.length
    ? Math.round(totalRevenue / acceptedBookings.length)
    : 0;

  const earningsTrend = useMemo(() => {
    const trend = [];
    const today = new Date();

    for (let offset = 6; offset >= 0; offset -= 1) {
      const date = new Date(today);
      date.setDate(today.getDate() - offset);

      const dateKey = date.toISOString().slice(0, 10);
      const value = bookings
        .filter((booking) => booking.date === dateKey && booking.status === "accepted")
        .reduce((sum, booking) => sum + getBookingRevenue(booking), 0);

      trend.push({
        label: date.toLocaleDateString("en-IN", { weekday: "short" }),
        value
      });
    }

    return trend;
  }, [bookings]);

  const peakTrendValue = Math.max(...earningsTrend.map((item) => item.value), 1);

  const statCards = [
    {
      title: "Booked",
      value: `₹${todayRevenue}`,
      subtitle: `${todayBookings.length} today`,
      accent: "#f97316",
      icon: <CurrencyRupeeRoundedIcon sx={{ fontSize: 18 }} />
    },
    {
      title: "New bookings",
      value: todayBookings.length,
      subtitle: `${pendingBookings.length} pending`,
      accent: "#fb923c",
      icon: <EventAvailableRoundedIcon sx={{ fontSize: 18 }} />
    },
    {
      title: "Sales",
      value: `₹${totalRevenue}`,
      subtitle: `${completionRate}% completion`,
      accent: "#f59e0b",
      icon: <TrendingUpRoundedIcon sx={{ fontSize: 18 }} />
    },
    {
      title: "Clients",
      value: bookings.length,
      subtitle: `${acceptedBookings.length} accepted`,
      accent: "#60a5fa",
      icon: <GroupsRoundedIcon sx={{ fontSize: 18 }} />
    }
  ];

  const sidebarItems = [
    { label: "Dashboard", icon: <DashboardRoundedIcon />, active: true, onClick: () => navigate("/dashboard") },
    { label: "Appointments", icon: <EventAvailableRoundedIcon />, onClick: () => navigate("/appointments") },
    { label: "Customers", icon: <PeopleAltRoundedIcon />, onClick: () => navigate("/customers") },
    { label: "Services", icon: <ContentCutRoundedIcon />, onClick: () => navigate("/services") }
  ];

  const formatDateLabel = () => {
    const date = new Date();
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: "#f4f6fb" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: sidebarWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: sidebarWidth,
            background: "#111827",
            color: "#f8fafc",
            borderRight: "none",
            px: 2,
            py: 3,
            pb: 4,
            display: "flex",
            boxSizing: "border-box",
            overflowY: "auto"
          }
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100%", pb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 1.5, mb: 4 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 1.5,
                border: "2px solid #d6b98c",
                backgroundColor: "#111827",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                flexShrink: 0
              }}
            >
              <Box component="img" src="/hairsalon-icon-192.png" alt="HairSalon logo" sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </Box>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#d1d5db" }}>
              HairSalon
            </Typography>
          </Box>

          <List sx={{ gap: 0.5, display: "grid" }}>
            {sidebarItems.map((item) => (
              <ListItemButton
                key={item.label}
                onClick={item.onClick}
                sx={{
                  borderRadius: 2,
                  px: 1.5,
                  py: 1.1,
                  background: item.active ? "rgba(99,102,241,0.18)" : "transparent",
                  color: item.active ? "#fff" : "#d1d5db",
                  "&:hover": {
                    background: item.active ? "rgba(99,102,241,0.24)" : "rgba(255,255,255,0.05)"
                  }
                }}
              >
                <ListItemIcon sx={{ color: "inherit", minWidth: 38 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>

          <Box sx={{ mt: "auto", pt: 4, pb: 2 }}>
            <Divider sx={{ borderColor: "rgba(255,255,255,0.12)", mb: 2 }} />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
                px: 1,
                minWidth: 0
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0, flex: 1 }}>
                <Avatar sx={{ bgcolor: "#f59e0b", color: "#111827", fontWeight: 800 }}>
                  {(user?.name || "O").slice(0, 1).toUpperCase()}
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: "#fff",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}
                  >
                    {user?.name || "Owner"}
                  </Typography>
                  <Typography sx={{ fontSize: 13, color: "#94a3b8" }}>
                    Salon Owner
                  </Typography>
                </Box>
              </Box>

              <IconButton onClick={handleLogout} sx={{ color: "#d1d5db", flexShrink: 0 }}>
                <LogoutRoundedIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Drawer>

      <Box sx={{ flex: 1, p: { xs: 2, md: 4 } }}>
        <Grid container spacing={2.25}>
          <Grid item xs={12} lg={7}>
            <Typography sx={{ fontSize: 16, color: "#64748b", mb: 0.5 }}>
              {formatDateLabel()}
            </Typography>
            <Typography sx={{ fontSize: { xs: 28, md: 36 }, fontWeight: 800, color: "#334155", mb: 3 }}>
              New for today
            </Typography>

            <Grid container spacing={2.2} sx={{ mb: 3 }}>
              {statCards.map((card) => (
                <Grid item xs={12} sm={6} lg={3} key={card.title}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.4,
                      borderRadius: 3,
                      background: "#fff",
                      border: "1px solid #edf2f7",
                      boxShadow: "0 12px 30px rgba(148,163,184,0.12)"
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                      <Chip
                        label={`+${todayBookings.length || 0} today`}
                        size="small"
                        sx={{
                          background: `${card.accent}18`,
                          color: card.accent,
                          fontWeight: 700
                        }}
                      />
                      <MoreHorizRoundedIcon sx={{ color: "#cbd5e1" }} />
                    </Box>
                    <Typography sx={{ fontSize: 20, color: "#334155", fontWeight: 800, mb: 0.5 }}>
                      {card.value}
                    </Typography>
                    <Typography sx={{ color: "#64748b", mb: 1 }}>
                      {card.title}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, color: "#94a3b8", fontSize: 13 }}>
                      {card.icon}
                      <Typography sx={{ fontSize: 13 }}>{card.subtitle}</Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            <Typography sx={{ fontSize: 16, fontWeight: 800, color: "#475569", mb: 1.5 }}>
              Progress by the numbers
            </Typography>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                border: "1px solid #edf2f7",
                boxShadow: "0 12px 30px rgba(148,163,184,0.08)",
                mb: 3
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
                  background: "#f8fafc",
                  px: 2,
                  py: 1.5,
                  gap: 1,
                  color: "#64748b",
                  fontSize: 13,
                  fontWeight: 700
                }}
              >
                <Box>Booked total / day</Box>
                <Box>Completed total / day</Box>
                <Box>Cancelled total / day</Box>
                <Box>Total revenue</Box>
                <Box>Average revenue / appt</Box>
              </Box>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
                  px: 2,
                  py: 2.2,
                  gap: 1,
                  textAlign: "center"
                }}
              >
                {[
                  { main: bookings.length, sub: todayBookings.length },
                  { main: acceptedBookings.length, sub: todayBookings.filter((b) => b.status === "accepted").length },
                  { main: rejectedBookings.length, sub: todayBookings.filter((b) => b.status === "rejected").length },
                  { main: `₹${totalRevenue}`, sub: `₹${todayRevenue}` },
                  { main: `₹${averageRevenue}`, sub: `${completionRate}%` }
                ].map((item, index) => (
                  <Box key={index}>
                    <Typography sx={{ fontSize: 18, fontWeight: 800, color: "#475569" }}>
                      {item.main}
                    </Typography>
                    <Typography sx={{ color: "#94a3b8", fontSize: 13 }}>
                      {item.sub}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>

          </Grid>

          <Grid item xs={12} lg={5}>
            <Typography sx={{ fontSize: 16, fontWeight: 800, color: "#475569", mb: 1.5 }}>
              Earnings overview
            </Typography>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
                border: "1px solid #edf2f7",
                boxShadow: "0 12px 30px rgba(148,163,184,0.08)",
                mb: 3
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                <Box>
                  <Typography sx={{ fontSize: 13, color: "#64748b", mb: 0.4 }}>
                    Total earnings
                  </Typography>
                  <Typography sx={{ fontSize: 30, fontWeight: 900, color: "#0f172a", lineHeight: 1.1 }}>
                    ₹{totalRevenue}
                  </Typography>
                </Box>
                <Chip
                  label={`${completionRate}% completion`}
                  size="small"
                  sx={{
                    background: "rgba(16,185,129,0.12)",
                    color: "#047857",
                    fontWeight: 700
                  }}
                />
              </Box>

              <Grid container spacing={1.2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2.5,
                      background: "rgba(249,115,22,0.08)",
                      border: "1px solid rgba(249,115,22,0.12)"
                    }}
                  >
                    <Typography sx={{ fontSize: 12, color: "#9a3412" }}>Today</Typography>
                    <Typography sx={{ fontSize: 18, fontWeight: 900, color: "#7c2d12" }}>
                      ₹{todayRevenue}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2.5,
                      background: "rgba(59,130,246,0.08)",
                      border: "1px solid rgba(59,130,246,0.12)"
                    }}
                  >
                    <Typography sx={{ fontSize: 12, color: "#1d4ed8" }}>Average</Typography>
                    <Typography sx={{ fontSize: 18, fontWeight: 900, color: "#1e3a8a" }}>
                      ₹{averageRevenue}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2.5,
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0"
                }}
              >
                <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1, height: 170 }}>
                  {earningsTrend.map((item) => {
                    const barHeight = `${Math.max((item.value / peakTrendValue) * 100, item.value ? 16 : 8)}%`;

                    return (
                      <Box key={item.label} sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 0.8 }}>
                        <Box
                          sx={{
                            width: "100%",
                            maxWidth: 34,
                            height: "100%",
                            display: "flex",
                            alignItems: "flex-end",
                            justifyContent: "center"
                          }}
                        >
                          <Box
                            sx={{
                              width: "68%",
                              minHeight: item.value ? 18 : 8,
                              height: barHeight,
                              borderRadius: 999,
                              background: item.value
                                ? "linear-gradient(180deg, #f97316 0%, #fb923c 100%)"
                                : "#dbe4f0",
                              boxShadow: item.value ? "0 10px 20px rgba(249,115,22,0.22)" : "none"
                            }}
                          />
                        </Box>
                        <Typography sx={{ fontSize: 11, color: "#64748b", fontWeight: 700 }}>
                          {item.label}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              </Box>

              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 1.2, mt: 2 }}>
                <Box sx={{ p: 1.5, borderRadius: 2.5, background: "#fff7ed", border: "1px solid #fed7aa" }}>
                  <Typography sx={{ fontSize: 12, color: "#9a3412" }}>Bookings</Typography>
                  <Typography sx={{ fontSize: 18, fontWeight: 900, color: "#7c2d12" }}>
                    {bookings.length}
                  </Typography>
                </Box>
                <Box sx={{ p: 1.5, borderRadius: 2.5, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
                  <Typography sx={{ fontSize: 12, color: "#1d4ed8" }}>Accepted</Typography>
                  <Typography sx={{ fontSize: 18, fontWeight: 900, color: "#1e3a8a" }}>
                    {acceptedBookings.length}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
          <DialogTitle>Add Service</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Service name"
              margin="normal"
              value={service.name}
              onChange={(e) => setService({ ...service, name: e.target.value })}
            />
            <TextField
              fullWidth
              label="Price"
              margin="normal"
              value={service.price}
              onChange={(e) => setService({ ...service, price: e.target.value })}
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleAddService}>
              Add
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          <Alert
            severity={snackbar.severity}
            onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}

export default OwnerDashboard;

