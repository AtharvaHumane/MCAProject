import { useCallback, useEffect, useState } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import ContentCutRoundedIcon from "@mui/icons-material/ContentCutRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const sidebarWidth = 250;
const chartColors = ["#14b8a6", "#ff7a6b", "#4f7cf7", "#fbbf24", "#a78bfa"];

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

  const accept = async (id) => {
    try {
      await axios.put(`${apiBaseUrl}/bookings/accept/${id}`);
      showSnackbar("Booking accepted");
      fetchBookings();
    } catch (error) {
      console.error("Failed to accept booking:", error);
      showSnackbar(
        error.response?.data?.message || "Could not accept booking right now.",
        "error"
      );
    }
  };

  const reject = async (id) => {
    try {
      await axios.put(`${apiBaseUrl}/bookings/reject/${id}`);
      showSnackbar("Booking rejected");
      fetchBookings();
    } catch (error) {
      console.error("Failed to reject booking:", error);
      showSnackbar(
        error.response?.data?.message || "Could not reject booking right now.",
        "error"
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const todayDate = new Date().toISOString().slice(0, 10);
  const todayBookings = bookings.filter((booking) => booking.date === todayDate);
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

  const serviceStatsMap = bookings.reduce((acc, booking) => {
    (booking.services || []).forEach((item) => {
      const existing = acc[item.name] || { name: item.name, value: 0, revenue: 0 };
      existing.value += 1;
      existing.revenue += Number(item.price || 0);
      acc[item.name] = existing;
    });

    return acc;
  }, {});

  const serviceChartData = Object.values(serviceStatsMap);
  const completionRate = bookings.length
    ? Math.round((acceptedBookings.length / bookings.length) * 100)
    : 0;
  const averageRevenue = acceptedBookings.length
    ? Math.round(totalRevenue / acceptedBookings.length)
    : 0;

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
    { label: "Appointments", icon: <EventAvailableRoundedIcon />, onClick: () => navigate("/dashboard") },
    { label: "Customers", icon: <PeopleAltRoundedIcon />, onClick: () => navigate("/customers") },
    { label: "Services", icon: <ContentCutRoundedIcon />, onClick: () => navigate("/services") }
  ];

  const secondaryItems = [
    { label: "Help", icon: <HelpOutlineRoundedIcon /> },
    { label: "Settings", icon: <SettingsRoundedIcon /> }
  ];

  const formatDateLabel = () => {
    const date = new Date();
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const renderStatusChip = (status) => {
    const styles = {
      pending: { bg: "rgba(251,191,36,0.16)", color: "#a16207", label: "Pending" },
      accepted: { bg: "rgba(16,185,129,0.16)", color: "#047857", label: "Accepted" },
      rejected: { bg: "rgba(248,113,113,0.16)", color: "#b91c1c", label: "Rejected" }
    };

    const selected = styles[status] || styles.pending;

    return (
      <Chip
        label={selected.label}
        size="small"
        sx={{
          background: selected.bg,
          color: selected.color,
          fontWeight: 700
        }}
      />
    );
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
            display: "flex"
          }
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 1.5, mb: 4 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 1.5,
                border: "2px solid #d6b98c",
                color: "#d6b98c",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800
              }}
            >
              H
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

          <Box sx={{ mt: 5 }}>
            <List sx={{ gap: 0.5, display: "grid" }}>
              {secondaryItems.map((item) => (
                <ListItemButton
                  key={item.label}
                  sx={{
                    borderRadius: 2,
                    px: 1.5,
                    py: 1.1,
                    color: "#d1d5db",
                    "&:hover": {
                      background: "rgba(255,255,255,0.05)"
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
          </Box>

          <Box sx={{ mt: "auto", pt: 4 }}>
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
        <Grid container spacing={3}>
          <Grid item xs={12} xl={8}>
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

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
              <Typography sx={{ fontSize: 16, fontWeight: 800, color: "#475569" }}>
                Pending and scheduled bookings
              </Typography>
              <Button
                startIcon={<AddRoundedIcon />}
                variant="contained"
                onClick={() => setOpen(true)}
                sx={{
                  borderRadius: 999,
                  textTransform: "none",
                  fontWeight: 700,
                  background: "#d6b98c",
                  color: "#111827",
                  "&:hover": {
                    background: "#c9ab7a"
                  }
                }}
              >
                Add service
              </Button>
            </Box>

            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                border: "1px solid #edf2f7",
                boxShadow: "0 12px 30px rgba(148,163,184,0.08)"
              }}
            >
              <Table>
                <TableHead sx={{ background: "#f8fafc" }}>
                  <TableRow>
                    <TableCell>Time</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Service name</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(todayBookings.length ? todayBookings : bookings).map((booking) => (
                    <TableRow key={booking._id} hover>
                      <TableCell sx={{ color: "#64748b", fontWeight: 700 }}>
                        {booking.time || "--"}
                      </TableCell>
                      <TableCell sx={{ color: "#475569" }}>
                        {booking.customerName || booking.customer}
                      </TableCell>
                      <TableCell sx={{ color: "#64748b" }}>
                        {(booking.services || []).map((item) => item.name).join(", ") || "--"}
                      </TableCell>
                      <TableCell sx={{ color: "#64748b" }}>
                        {booking.date || "--"}
                      </TableCell>
                      <TableCell>{renderStatusChip(booking.status)}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: "#475569" }}>
                        ₹{getBookingRevenue(booking)}
                      </TableCell>
                      <TableCell align="right">
                        {booking.status === "pending" ? (
                          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                            <Button
                              size="small"
                              onClick={() => accept(booking._id)}
                              sx={{
                                borderRadius: 999,
                                minWidth: 80,
                                textTransform: "none",
                                color: "#059669",
                                background: "rgba(16,185,129,0.12)"
                              }}
                            >
                              Accept
                            </Button>
                            <Button
                              size="small"
                              onClick={() => reject(booking._id)}
                              sx={{
                                borderRadius: 999,
                                minWidth: 80,
                                textTransform: "none",
                                color: "#dc2626",
                                background: "rgba(248,113,113,0.14)"
                              }}
                            >
                              Reject
                            </Button>
                          </Box>
                        ) : (
                          <Typography sx={{ color: "#94a3b8", fontSize: 13 }}>
                            No action
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}

                  {!bookings.length && (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 5, color: "#94a3b8" }}>
                        No bookings available yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Paper>
          </Grid>

          <Grid item xs={12} xl={4}>
            <Typography sx={{ fontSize: 16, fontWeight: 800, color: "#475569", mb: 1.5 }}>
              Appts and Revenue
            </Typography>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                background: "#fff",
                border: "1px solid #edf2f7",
                boxShadow: "0 12px 30px rgba(148,163,184,0.08)",
                mb: 3
              }}
            >
              <Box sx={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={serviceChartData.length ? serviceChartData : [{ name: "No data", value: 1, revenue: 0 }]}
                      dataKey="value"
                      innerRadius={62}
                      outerRadius={98}
                      stroke="none"
                    >
                      {(serviceChartData.length ? serviceChartData : [{ name: "No data", value: 1 }]).map((entry, index) => (
                        <Cell
                          key={entry.name || index}
                          fill={chartColors[index % chartColors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>

              <Box sx={{ mt: -16, textAlign: "center", pointerEvents: "none" }}>
                <Typography sx={{ fontSize: 28, fontWeight: 800, color: "#334155" }}>
                  ₹{totalRevenue}
                </Typography>
                <Typography sx={{ color: "#64748b" }}>Total</Typography>
              </Box>

              <Box sx={{ mt: 8 }}>
                {(serviceChartData.length ? serviceChartData : []).map((item, index) => (
                  <Box
                    key={item.name}
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "24px 1fr auto",
                      gap: 1.5,
                      alignItems: "center",
                      py: 0.8
                    }}
                  >
                    <Box
                      sx={{
                        width: 18,
                        height: 8,
                        borderRadius: 999,
                        background: chartColors[index % chartColors.length]
                      }}
                    />
                    <Typography sx={{ color: "#64748b" }}>{item.name}</Typography>
                    <Typography sx={{ color: "#475569", fontWeight: 700 }}>
                      ₹{item.revenue}
                    </Typography>
                  </Box>
                ))}

                {!serviceChartData.length && (
                  <Typography sx={{ color: "#94a3b8", textAlign: "center", py: 2 }}>
                    Service chart will appear after bookings are added.
                  </Typography>
                )}
              </Box>
            </Paper>

            <Typography sx={{ fontSize: 16, fontWeight: 800, color: "#475569", mb: 1.5 }}>
              Week overview
            </Typography>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                background: "#fff",
                border: "1px solid #edf2f7",
                boxShadow: "0 12px 30px rgba(148,163,184,0.08)"
              }}
            >
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => {
                const sampleCount = bookings.length
                  ? bookings.filter((booking) => new Date(booking.date || todayDate).getDay() === ((index + 1) % 7)).length
                  : 0;

                return (
                  <Box
                    key={day}
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "56px 1fr auto",
                      alignItems: "center",
                      gap: 1.5,
                      py: 1.15
                    }}
                  >
                    <Typography sx={{ color: "#64748b", fontWeight: 700 }}>
                      {day}
                    </Typography>
                    <Box
                      sx={{
                        height: 10,
                        borderRadius: 999,
                        background: "#eef2ff",
                        overflow: "hidden"
                      }}
                    >
                      <Box
                        sx={{
                          width: `${Math.min(sampleCount * 22, 100)}%`,
                          height: "100%",
                          borderRadius: 999,
                          background:
                            index % 3 === 0 ? "#8b5cf6" : index % 3 === 1 ? "#f97316" : "#3b82f6"
                        }}
                      />
                    </Box>
                    <Typography sx={{ color: "#94a3b8", fontSize: 13 }}>
                      {sampleCount}
                    </Typography>
                  </Box>
                );
              })}
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
