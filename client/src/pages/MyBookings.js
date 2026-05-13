import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import LocalAtmRoundedIcon from "@mui/icons-material/LocalAtmRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

const apiBaseUrl = "http://localhost:5000/api";

const statusMeta = {
  pending: {
    label: "Pending",
    color: "#fbbf24",
    background: "rgba(251,191,36,0.14)",
    icon: <ScheduleRoundedIcon fontSize="small" />
  },
  accepted: {
    label: "Accepted",
    color: "#22c55e",
    background: "rgba(34,197,94,0.14)",
    icon: <CheckCircleRoundedIcon fontSize="small" />
  },
  rejected: {
    label: "Rejected",
    color: "#ef4444",
    background: "rgba(239,68,68,0.14)",
    icon: <CancelRoundedIcon fontSize="small" />
  }
};

const formatDate = (value) => {
  if (!value) return "--";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date);
};

const formatDateTime = (value) => {
  if (!value) return "--";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
};

function MyBookings() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    const loadBookings = async () => {
      if (!user?._id) {
        navigate("/");
        return;
      }

      try {
        setLoading(true);
        const res = await axios.get(`${apiBaseUrl}/bookings`);
        setBookings(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to load bookings:", err);
        setError(err.response?.data?.message || "Could not load your bookings right now.");
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [navigate, user?._id]);

  const sortedBookings = useMemo(() => {
    return [...bookings].sort((a, b) => {
      const aTime = new Date(a.createdAt || a.updatedAt || `${a.date || ""} ${a.time || ""}`).getTime();
      const bTime = new Date(b.createdAt || b.updatedAt || `${b.date || ""} ${b.time || ""}`).getTime();

      return (Number.isNaN(bTime) ? 0 : bTime) - (Number.isNaN(aTime) ? 0 : aTime);
    });
  }, [bookings]);

  const userBookings = useMemo(
    () => sortedBookings.filter((booking) => booking.customer === user?._id),
    [sortedBookings, user?._id]
  );

  const latestBooking = useMemo(() => userBookings[0] || null, [userBookings]);

  useEffect(() => {
    if (latestBooking) {
      setSelectedBooking(latestBooking);
    }
  }, [latestBooking]);

  const totalSpent = useMemo(
    () => userBookings.reduce((sum, booking) => sum + Number(booking.total || 0), 0),
    [userBookings]
  );

  const bookingCount = userBookings.length;
  const highlightedBookingCount = userBookings.length;

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
            mb: 3,
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
              alignItems: { xs: "flex-start", md: "center" },
              justifyContent: "space-between",
              gap: 2,
              flexDirection: { xs: "column", md: "row" }
            }}
          >
            <Box>
              <Typography
                sx={{
                  color: "#fbbf24",
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  fontSize: 12,
                  mb: 0.5
                }}
              >
                Booking history
              </Typography>
              <Typography sx={{ fontSize: { xs: 28, md: 38 }, fontWeight: 900, lineHeight: 1.1, color: "#ffffff" }}>
                Your latest salon appointments
              </Typography>
              <Typography sx={{ color: "rgba(248,250,252,0.82)", mt: 1 }}>
                Review your most recent booking first, then scroll through your full appointment trail.
              </Typography>
            </Box>

            <Button
              variant="outlined"
              startIcon={<ArrowBackRoundedIcon />}
              onClick={() => navigate("/dashboard")}
              sx={{
                borderRadius: 999,
                textTransform: "none",
                px: 2.5,
                py: 1.1,
                color: "#f8fafc",
                borderColor: "rgba(255,255,255,0.16)",
                "&:hover": {
                  borderColor: "#fbbf24",
                  background: "rgba(251,191,36,0.08)"
                }
              }}
            >
              Back to dashboard
            </Button>
          </Box>
        </Paper>

        <Grid container spacing={2.5} alignItems="stretch">
          <Grid item xs={12} lg={8}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.2, md: 2.6 },
                borderRadius: 4,
                background: "rgba(15,15,15,0.72)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 20px 50px rgba(0,0,0,0.22)",
                minHeight: 320
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  flexWrap: "wrap",
                  mb: 2.5
                }}
              >
                <Box>
                  <Typography sx={{ color: "#fbbf24", fontSize: 12, letterSpacing: 2, textTransform: "uppercase" }}>
                    Booking history
                  </Typography>
                  <Typography sx={{ fontSize: 24, fontWeight: 900, color: "#ffffff" }}>
                    {selectedBooking ? "Selected booking details" : "Choose a booking"}
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                  <Chip
                    icon={<PersonRoundedIcon sx={{ fontSize: 18 }} />}
                    label={user?.name || "Customer"}
                    sx={{
                      background: "rgba(255,255,255,0.05)",
                      color: "#f8fafc",
                      fontWeight: 700
                    }}
                  />
                  <Chip
                    label={`${bookingCount} booking${bookingCount === 1 ? "" : "s"}`}
                    sx={{
                      background: "rgba(251,191,36,0.14)",
                      color: "#fbbf24",
                      fontWeight: 700
                    }}
                  />
                  <Chip
                    label={`${highlightedBookingCount} yours`}
                    sx={{
                      background: "rgba(255,255,255,0.05)",
                      color: "#f8fafc",
                      fontWeight: 700
                    }}
                  />
                </Stack>
              </Box>

              <Divider sx={{ mb: 3, borderColor: "rgba(255,255,255,0.08)" }} />

              {loading ? (
                <Typography sx={{ color: "rgba(248,250,252,0.7)" }}>Loading your bookings...</Typography>
              ) : error ? (
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    background: "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.18)"
                  }}
                >
                  <Typography sx={{ fontWeight: 800, color: "#fecaca", mb: 1 }}>Unable to load bookings</Typography>
                  <Typography sx={{ color: "rgba(248,250,252,0.8)" }}>{error}</Typography>
                </Box>
              ) : (selectedBooking || latestBooking) ? (
                <Card
                  elevation={0}
                  sx={{
                    background: "linear-gradient(180deg, rgba(249,115,22,0.12), rgba(255,255,255,0.03))",
                    border: "1px solid rgba(251,191,36,0.2)",
                    borderRadius: 4,
                    color: "#f8fafc"
                  }}
                >
                  <CardContent sx={{ p: { xs: 2, md: 2.4 }, "&:last-child": { pb: { xs: 2, md: 2.4 } } }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 2,
                        flexWrap: "wrap",
                        mb: 2
                      }}
                    >
                      <Box>
                        <Typography sx={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#fbbf24" }}>
                          Booking #{(selectedBooking || latestBooking)?._id?.slice(-6) || "--"}
                        </Typography>
                        <Typography sx={{ fontSize: { xs: 24, md: 30 }, fontWeight: 900, lineHeight: 1.15 }}>
                          {(selectedBooking || latestBooking)?.customerName || user?.name || "Customer"}
                        </Typography>
                        <Typography sx={{ color: "rgba(248,250,252,0.72)", mt: 0.8 }}>
                          Booked on {formatDateTime((selectedBooking || latestBooking)?.createdAt || (selectedBooking || latestBooking)?.updatedAt)}
                        </Typography>
                      </Box>

                      {(() => {
                        const meta = statusMeta[(selectedBooking || latestBooking)?.status] || statusMeta.pending;
                        return (
                          <Chip
                            icon={meta.icon}
                            label={meta.label}
                            sx={{
                              background: meta.background,
                              color: meta.color,
                              fontWeight: 800,
                              px: 1
                            }}
                          />
                        );
                      })()}
                    </Box>

                    <Grid container spacing={2.2} alignItems="flex-start">
                      <Grid item xs={12} md={6}>
                        <Box
                          sx={{
                            p: 1.8,
                            borderRadius: 3,
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)"
                          }}
                        >
                          <Typography sx={{ fontWeight: 800, mb: 1.4 }}>Services</Typography>
                          <Stack spacing={1.1}>
                            {((selectedBooking || latestBooking)?.services || []).map((service, index) => (
                              <Box
                                key={`${service.name}-${index}`}
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  gap: 2
                                }}
                              >
                                <Typography sx={{ color: "rgba(248,250,252,0.88)" }}>
                                  {service.name}
                                </Typography>
                                <Typography sx={{ color: "#fbbf24", fontWeight: 800 }}>
                                  Rs. {service.price || 0}
                                </Typography>
                              </Box>
                            ))}
                          </Stack>
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={6} sx={{ alignSelf: "flex-start" }}>
                        <Box
                          sx={{
                            p: 1.8,
                            borderRadius: 3,
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            height: "auto"
                          }}
                        >
                          <Typography sx={{ fontWeight: 800, mb: 1.4 }}>Appointment details</Typography>
                          <Stack spacing={1.6}>
                            <DetailRow icon={<CalendarMonthRoundedIcon />} label="Date" value={formatDate((selectedBooking || latestBooking).date)} />
                            <DetailRow icon={<AccessTimeRoundedIcon />} label="Time" value={(selectedBooking || latestBooking).time || "--"} />
                            <DetailRow icon={<PersonRoundedIcon />} label="Owner" value={(selectedBooking || latestBooking).owner || "--"} />
                            <DetailRow icon={<LocalAtmRoundedIcon />} label="Total" value={`Rs. ${(selectedBooking || latestBooking).total || 0}`} emphasis />
                          </Stack>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ) : (
                <Box
                  sx={{
                    textAlign: "center",
                    py: 8,
                    px: 3,
                    borderRadius: 4,
                    background: "rgba(255,255,255,0.03)",
                    border: "1px dashed rgba(255,255,255,0.12)"
                  }}
                >
                  <Typography sx={{ fontSize: 24, fontWeight: 900, mb: 1 }}>No bookings yet</Typography>
                  <Typography sx={{ color: "rgba(248,250,252,0.72)", mb: 3 }}>
                    Once you make your first appointment, it will appear here with the latest booking on top.
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => navigate("/dashboard")}
                    sx={{
                      borderRadius: 999,
                      textTransform: "none",
                      fontWeight: 800,
                      background: "linear-gradient(135deg, #f97316, #fbbf24)",
                      color: "#111827"
                    }}
                  >
                    Book an appointment
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.2, md: 2.6 },
                borderRadius: 4,
                background: "rgba(15,15,15,0.72)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 20px 50px rgba(0,0,0,0.22)",
                height: { xs: "auto", lg: "calc(100vh - 152px)" },
                display: "flex",
                flexDirection: "column",
                position: { lg: "sticky" },
                top: { lg: 24 }
              }}
            >
              <Typography sx={{ fontSize: 22, fontWeight: 900, mb: 0.5, color: "#ffffff" }}>
                Booking history
              </Typography>
              <Typography sx={{ color: "rgba(248,250,252,0.82)", mb: 2.5 }}>
                All appointments from newest to oldest
              </Typography>

              <Stack spacing={1.2} sx={{ flex: 1, overflowY: "auto", pr: 0.5 }}>
                {userBookings.map((booking, index) => {
                  const meta = statusMeta[booking.status] || statusMeta.pending;

                  return (
                    <Card
                      key={booking._id || `${booking.date}-${index}`}
                      onClick={() => setSelectedBooking(booking)}
                      elevation={0}
                      sx={{
                        borderRadius: 3,
                        background:
                          index === 0
                            ? "linear-gradient(180deg, rgba(249,115,22,0.12), rgba(255,255,255,0.03))"
                            : "rgba(255,255,255,0.03)",
                        border:
                          index === 0
                            ? "1px solid rgba(251,191,36,0.2)"
                            : "1px solid rgba(255,255,255,0.08)",
                        color: "#f8fafc",
                        flexShrink: 0,
                        cursor: "pointer",
                        outline:
                          selectedBooking?._id === booking._id ? "1px solid rgba(251,191,36,0.55)" : "none"
                      }}
                    >
                      <CardContent sx={{ p: 1.9, "&:last-child": { pb: 1.9 } }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, mb: 1.5 }}>
                          <Box>
                            <Typography sx={{ fontWeight: 800 }}>
                              {booking.date ? formatDate(booking.date) : "Unknown date"}
                            </Typography>
                            <Typography sx={{ color: "rgba(248,250,252,0.68)", fontSize: 13 }}>
                              {booking.time || "--"} | {booking.customerName || "Customer"}
                            </Typography>
                          </Box>
                          <Chip
                            label={meta.label}
                            size="small"
                            sx={{
                              background: meta.background,
                              color: meta.color,
                              fontWeight: 800
                            }}
                          />
                        </Box>

                        <Typography sx={{ color: "rgba(248,250,252,0.9)", mb: 0.8 }}>
                          {(booking.services || []).map((service) => service.name).join(", ") || "No services listed"}
                        </Typography>

                        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                          <Typography sx={{ color: "rgba(248,250,252,0.65)", fontSize: 13 }}>
                            Booked {formatDateTime(booking.createdAt || booking.updatedAt)}
                          </Typography>
                          <Typography sx={{ color: "#fbbf24", fontWeight: 900 }}>
                            Rs. {booking.total || 0}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  );
                })}

                {!loading && !error && !bookings.length && (
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      background: "rgba(255,255,255,0.03)",
                      border: "1px dashed rgba(255,255,255,0.12)"
                    }}
                  >
                    <Typography sx={{ fontWeight: 800, mb: 1 }}>No booking history yet</Typography>
                    <Typography sx={{ color: "rgba(248,250,252,0.7)" }}>
                      Your appointment history will show here after your first booking.
                    </Typography>
                  </Box>
                )}
              </Stack>

              <Divider sx={{ my: 2.5, borderColor: "rgba(255,255,255,0.08)" }} />

              <Box
                sx={{
                  p: 1.9,
                  borderRadius: 3,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(251,191,36,0.16)"
                }}
              >
                <Typography sx={{ color: "#fbbf24", textTransform: "uppercase", letterSpacing: 2, fontSize: 12 }}>
                  Summary
                </Typography>
                <Typography sx={{ fontSize: 22, fontWeight: 900, mt: 0.5, color: "#ffffff" }}>
                  Rs. {totalSpent}
                </Typography>
                <Typography sx={{ color: "rgba(248,250,252,0.72)", mt: 0.7 }}>
                  Total spent across {bookingCount} booking{bookingCount === 1 ? "" : "s"}.
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

function DetailRow({ icon, label, value, emphasis = false }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2
      }}
    >
      <Stack direction="row" spacing={1.1} alignItems="center">
        <Box sx={{ color: "#fbbf24", display: "flex", alignItems: "center" }}>{icon}</Box>
        <Typography sx={{ color: "rgba(248,250,252,0.7)" }}>{label}</Typography>
      </Stack>
      <Typography sx={{ fontWeight: emphasis ? 900 : 700, color: emphasis ? "#fbbf24" : "#f8fafc" }}>
        {value}
      </Typography>
    </Box>
  );
}

export default MyBookings;
