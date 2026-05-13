import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import ContentCutRoundedIcon from "@mui/icons-material/ContentCutRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import RepeatIcon from "@mui/icons-material/Repeat";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import PeopleIcon from "@mui/icons-material/People";

const sidebarWidth = 250;

const customerSeed = [
  {
    id: 1,
    name: "Atharva humane",
    email: "atharva@gmail.com",
    phone: "+91 9876543210",
    visits: 12,
    spent: 12500,
    favorite: "Premium Facial",
    status: "VIP",
    lastVisit: "12 May 2026",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 2,
    name: "Sahil Kharat",
    email: "sahil@gmail.com",
    phone: "+91 9123456789",
    visits: 5,
    spent: 4200,
    favorite: "Hair Spa",
    status: "Active",
    lastVisit: "10 May 2026",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 3,
    name: "Pankaj Khilare",
    email: "pankaj@gmail.com",
    phone: "+91 9988776655",
    visits: 2,
    spent: 1800,
    favorite: "Basic Facial",
    status: "New",
    lastVisit: "08 May 2026",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 4,
    name: "Raviraj Salunke",
    email: "ravi@gmail.com",
    phone: "+91 9011223344",
    visits: 9,
    spent: 8600,
    favorite: "Hair Cut",
    status: "Active",
    lastVisit: "11 May 2026",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80"
  },

  {
    id: 5,
    name: "Anurag Shastri",
    email: "anurag@gmail.com",
    phone: "+91 9988112233",
    visits: 15,
    spent: 15200,
    favorite: "Luxury Facial",
    status: "VIP",
    lastVisit: "09 May 2026",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80"
  },

  {
    id: 6,
    name: "Gaurav Bavdhakar",
    email: "gaurav@gmail.com",
    phone: "+91 8877665544",
    visits: 4,
    spent: 3200,
    favorite: "Beard Trim",
    status: "Active",
    lastVisit: "07 May 2026",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
  },

  {
    id: 7,
    name: "Rohit chavan",
    email: "rohit@gmail.com",
    phone: "+91 7766554433",
    visits: 7,
    spent: 6400,
    favorite: "Hair Color",
    status: "Active",
    lastVisit: "05 May 2026",
    image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=200&q=80"
  },

  {
    id: 8,
    name: "Akshay yevale",
    email: "akshay@gmail.com",
    phone: "+91 6655443322",
    visits: 3,
    spent: 2100,
    favorite: "Massage",
    status: "New",
    lastVisit: "04 May 2026",
    image: "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=200&q=80"
  },

  {
    id: 9,
    name: "Ganesh Kute",
    email: "genesh@gmail.com",
    phone: "+91 9988771122",
    visits: 11,
    spent: 9800,
    favorite: "Hair Spa",
    status: "VIP",
    lastVisit: "06 May 2026",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"
  },

  {
    id: 10,
    name: "Abhishek kulthe",
    email: "abhi@gmail.com",
    phone: "+91 8899001122",
    visits: 6,
    spent: 4700,
    favorite: "Premium Hair Cut",
    status: "Active",
    lastVisit: "03 May 2026",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80"
  },

  {
    id: 11,
    name: "Sameer walhkar",
    email: "samer@gmail.com",
    phone: "+91 7788996655",
    visits: 13,
    spent: 13200,
    favorite: "Gold Facial",
    status: "VIP",
    lastVisit: "02 May 2026",
    image: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80"
  },

  {
    id: 12,
    name: "Omkar Kamble",
    email: "omkar@gmail.com",
    phone: "+91 9900112233",
    visits: 5,
    spent: 4100,
    favorite: "Fade Cut",
    status: "Active",
    lastVisit: "01 May 2026",
    image: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=200&q=80"
  },

  {
    id: 13,
    name: "Chinmay chini",
    email: "chinmy@gmail.com",
    phone: "+91 8811223344",
    visits: 8,
    spent: 7600,
    favorite: "Face Mask",
    status: "Active",
    lastVisit: "28 Apr 2026",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80"
  },

  {
    id: 14,
    name: "Yash Kondedeshmukh",
    email: "yash@gmail.com",
    phone: "+91 7766112233",
    visits: 2,
    spent: 1500,
    favorite: "Kids Hair Cut",
    status: "New",
    lastVisit: "25 Apr 2026",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
  },

  {
    id: 15,
    name: "Mayur Khambalkar",
    email: "mayur@gmail.com",
    phone: "+91 6677889900",
    visits: 10,
    spent: 11000,
    favorite: "Diamond Facial",
    status: "VIP",
    lastVisit: "24 Apr 2026",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80"
  }
];

function Customers() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const customers = useMemo(() => customerSeed, []);

  const filteredCustomers = useMemo(
    () =>
      customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(search.toLowerCase()) ||
          customer.email.toLowerCase().includes(search.toLowerCase()) ||
          customer.phone.toLowerCase().includes(search.toLowerCase())
      ),
    [customers, search]
  );

  const metrics = useMemo(() => {
    const totalCustomers = customers.length;
    const newThisMonth = customers.filter((customer) => customer.status === "New").length;
    const returningRate = totalCustomers
      ? Math.round((customers.filter((customer) => customer.visits > 1).length / totalCustomers) * 100)
      : 0;
    const premiumMembers = customers.filter((customer) => customer.status === "VIP").length;

    return { totalCustomers, newThisMonth, returningRate, premiumMembers };
  }, [customers]);

  const getStatusColor = (status) => {
    switch (status) {
      case "VIP":
        return "warning";
      case "Active":
        return "success";
      case "New":
        return "info";
      default:
        return "default";
    }
  };

  const sidebarItems = [
    { label: "Dashboard", icon: <DashboardRoundedIcon />, onClick: () => navigate("/dashboard") },
    { label: "Appointments", icon: <EventAvailableRoundedIcon />, onClick: () => navigate("/appointments") },
    { label: "Customers", icon: <PeopleAltRoundedIcon />, active: true, onClick: () => navigate("/customers") },
    { label: "Services", icon: <ContentCutRoundedIcon />, onClick: () => navigate("/services") }
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
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
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, px: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0, flex: 1 }}>
                <Avatar sx={{ bgcolor: "#f59e0b", color: "#111827", fontWeight: 800 }}>
                  {(user?.name || "O").slice(0, 1).toUpperCase()}
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 700, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
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
        <Typography sx={{ fontSize: 16, color: "#64748b", mb: 0.5 }}>
          Today: {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
        </Typography>
        <Typography sx={{ fontSize: { xs: 28, md: 36 }, fontWeight: 800, color: "#334155", mb: 3 }}>
          Customers
        </Typography>

        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, borderRadius: 4, boxShadow: 3, background: "#fff" }}>
              <PeopleIcon sx={{ fontSize: 40, color: "#2563eb" }} />
              <Typography variant="h5" fontWeight="bold">
                {metrics.totalCustomers.toLocaleString()}
              </Typography>
              <Typography color="gray">Total Customers</Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, borderRadius: 4, boxShadow: 3, background: "#fff" }}>
              <PersonAddIcon sx={{ fontSize: 40, color: "#16a34a" }} />
              <Typography variant="h5" fontWeight="bold">
                +{metrics.newThisMonth}
              </Typography>
              <Typography color="gray">New This Month</Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, borderRadius: 4, boxShadow: 3, background: "#fff" }}>
              <RepeatIcon sx={{ fontSize: 40, color: "#f97316" }} />
              <Typography variant="h5" fontWeight="bold">
                {metrics.returningRate}%
              </Typography>
              <Typography color="gray">Returning Clients</Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, borderRadius: 4, boxShadow: 3, background: "#fff" }}>
              <WorkspacePremiumIcon sx={{ fontSize: 40, color: "#eab308" }} />
              <Typography variant="h5" fontWeight="bold">
                {metrics.premiumMembers}
              </Typography>
              <Typography color="gray">VIP Members</Typography>
            </Paper>
          </Grid>
        </Grid>

        <Paper sx={{ p: 2, borderRadius: 4, mb: 3, background: "#fff" }}>
          <TextField
            fullWidth
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />
        </Paper>

        <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: 3, background: "#fff" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Customer</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Visits</TableCell>
                <TableCell>Favorite Service</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Details</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id} hover>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar src={customer.image} />
                      <Typography fontWeight="bold">{customer.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.visits}</TableCell>
                  <TableCell>{customer.favorite}</TableCell>
                  <TableCell>
                    <Chip label={customer.status} color={getStatusColor(customer.status)} />
                  </TableCell>
                  <TableCell>
                    <Button variant="contained" onClick={() => setSelectedCustomer(customer)}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Drawer anchor="right" open={!!selectedCustomer} onClose={() => setSelectedCustomer(null)}>
          {selectedCustomer && (
            <Box sx={{ width: 350, p: 3 }}>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Avatar src={selectedCustomer.image} sx={{ width: 100, height: 100, mb: 2 }} />
                <Typography variant="h5" fontWeight="bold">
                  {selectedCustomer.name}
                </Typography>
                <Typography color="gray">{selectedCustomer.email}</Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography mb={1}>Phone: {selectedCustomer.phone}</Typography>
              <Typography mb={1}>Visits: {selectedCustomer.visits}</Typography>
              <Typography mb={1}>Favorite: {selectedCustomer.favorite}</Typography>
              <Typography mb={1}>Total Spent: ₹{selectedCustomer.spent}</Typography>
              <Typography mb={1}>Last Visit: {selectedCustomer.lastVisit}</Typography>

              <Chip
                label={selectedCustomer.status}
                color={getStatusColor(selectedCustomer.status)}
                sx={{ mt: 2 }}
              />
            </Box>
          )}
        </Drawer>
      </Box>
    </Box>
  );
}

export default Customers;
