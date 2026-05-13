import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Chip,
  Drawer,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Snackbar,
  Typography
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import ContentCutRoundedIcon from "@mui/icons-material/ContentCutRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";

const sidebarWidth = 250;
const apiBaseUrl = "http://localhost:5000/api";

const statusMeta = {
  pending: {
    label: "Pending",
    color: "#a16207",
    background: "rgba(251,191,36,0.16)",
    icon: <ScheduleRoundedIcon fontSize="small" />
  },
  accepted: {
    label: "Accepted",
    color: "#047857",
    background: "rgba(16,185,129,0.16)",
    icon: <CheckCircleRoundedIcon fontSize="small" />
  },
  rejected: {
    label: "Rejected",
    color: "#b91c1c",
    background: "rgba(248,113,113,0.16)",
    icon: <CancelRoundedIcon fontSize="small" />
  }
};

const formatDate = (value) => {
  if (!value) return "--";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date);
};

function Appointments() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchBookings = useCallback(async () => {
    if (!user?._id) {
      navigate("/");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(`${apiBaseUrl}/bookings/owner/${user._id}`);
      setBookings(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      setBookings([]);
      showSnackbar(error.response?.data?.message || "Could not load appointments right now.", "error");
    } finally {
      setLoading(false);
    }
  }, [navigate, user?._id]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const accept = async (id) => {
    try {
      await axios.put(`${apiBaseUrl}/bookings/accept/${id}`);
      showSnackbar("Booking accepted");
      fetchBookings();
    } catch (error) {
      console.error("Failed to accept booking:", error);
      showSnackbar(error.response?.data?.message || "Could not accept booking right now.", "error");
    }
  };

  const reject = async (id) => {
    try {
      await axios.put(`${apiBaseUrl}/bookings/reject/${id}`);
      showSnackbar("Booking rejected");
      fetchBookings();
    } catch (error) {
      console.error("Failed to reject booking:", error);
      showSnackbar(error.response?.data?.message || "Could not reject booking right now.", "error");
    }
  };

  const todayCount = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return bookings.filter((booking) => booking.date === today).length;
  }, [bookings]);

  const bookingColumns = [
    {
      field: "time",
      headerName: "Time",
      minWidth: 100,
      flex: 0.7,
      renderCell: (params) => (
        <Typography sx={{ color: "#64748b", fontWeight: 700 }}>{params.value || "--"}</Typography>
      )
    },
    {
      field: "customerName",
      headerName: "Customer",
      minWidth: 180,
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ color: "#475569", fontWeight: 600 }}>
          {params.row.customerName || params.row.customer || "--"}
        </Typography>
      )
    },
    {
      field: "services",
      headerName: "Service name",
      minWidth: 260,
      flex: 2,
      renderCell: (params) => (
        <Typography sx={{ color: "#64748b" }}>
          {(params.row.services || []).map((item) => item.name).join(", ") || "--"}
        </Typography>
      )
    },
    {
      field: "date",
      headerName: "Date",
      minWidth: 130,
      flex: 0.9,
      renderCell: (params) => <Typography sx={{ color: "#64748b" }}>{formatDate(params.value)}</Typography>
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.8,
      renderCell: (params) => {
        const meta = statusMeta[params.value] || statusMeta.pending;
        return (
          <Chip
            icon={meta.icon}
            label={meta.label}
            size="small"
            sx={{
              background: meta.background,
              color: meta.color,
              fontWeight: 800
            }}
          />
        );
      }
    },
    {
      field: "price",
      headerName: "Price",
      minWidth: 110,
      flex: 0.8,
      align: "right",
      headerAlign: "right",
      renderCell: (params) => (
        <Typography sx={{ fontWeight: 700, color: "#475569", width: "100%", textAlign: "right" }}>
          ₹{Number(params.row.total || 0)}
        </Typography>
      )
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 200,
      flex: 1.2,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const booking = params.row;

        if (booking.status !== "pending") {
          return (
            <Typography sx={{ color: "#94a3b8", fontSize: 13, fontWeight: 600 }}>
              No action
            </Typography>
          );
        }

        return (
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
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
        );
      }
    }
  ];

  const sidebarItems = [
    { label: "Dashboard", icon: <DashboardRoundedIcon />, onClick: () => navigate("/dashboard") },
    { label: "Appointments", icon: <EventAvailableRoundedIcon />, active: true, onClick: () => navigate("/appointments") },
    { label: "Customers", icon: <PeopleAltRoundedIcon />, onClick: () => navigate("/customers") },
    { label: "Services", icon: <ContentCutRoundedIcon />, onClick: () => navigate("/services") }
  ];

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
        </Box>
      </Drawer>

      <Box sx={{ flex: 1, p: { xs: 2, md: 4 } }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography sx={{ fontSize: 16, color: "#64748b", mb: 0.5 }}>
              Today: {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
            </Typography>
            <Typography sx={{ fontSize: { xs: 28, md: 36 }, fontWeight: 800, color: "#334155", mb: 3 }}>
              Appointments
            </Typography>

            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                border: "1px solid #edf2f7",
                boxShadow: "0 12px 30px rgba(148,163,184,0.08)"
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  px: 2,
                  py: 1.8,
                  borderBottom: "1px solid #edf2f7"
                }}
              >
                <Box>
                  <Typography sx={{ fontSize: 16, fontWeight: 800, color: "#475569" }}>
                    Pending and scheduled bookings
                  </Typography>
                  <Typography sx={{ color: "#64748b", fontSize: 13 }}>
                    {todayCount} booking{todayCount === 1 ? "" : "s"} today
                  </Typography>
                </Box>
                <Chip
                  icon={<ScheduleRoundedIcon sx={{ fontSize: 18 }} />}
                  label={`${bookings.length} total`}
                  sx={{ background: "rgba(99,102,241,0.12)", color: "#4338ca", fontWeight: 700 }}
                />
              </Box>

              <DataGrid
                rows={bookings.map((booking) => ({ ...booking, id: booking._id }))}
                columns={bookingColumns}
                disableRowSelectionOnClick
                hideFooter
                loading={loading}
                rowHeight={92}
                columnHeaderHeight={52}
                sx={{
                  border: 0,
                  "& .MuiDataGrid-columnHeaders": {
                    background: "#f8fafc",
                    color: "#0f172a",
                    fontWeight: 800,
                    borderBottom: "1px solid #e2e8f0"
                  },
                  "& .MuiDataGrid-columnHeaderTitle": {
                    fontWeight: 800
                  },
                  "& .MuiDataGrid-cell": {
                    borderBottom: "1px solid #edf2f7",
                    alignItems: "flex-start",
                    py: 1.3
                  },
                  "& .MuiDataGrid-row:hover": {
                    background: "#f8fafc"
                  },
                  "& .MuiDataGrid-virtualScroller": {
                    background: "#fff"
                  },
                  "& .MuiDataGrid-columnSeparator": {
                    color: "rgba(148,163,184,0.25)"
                  }
                }}
              />
            </Paper>
          </Grid>
        </Grid>

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

export default Appointments;
