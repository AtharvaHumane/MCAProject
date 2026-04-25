import { Box, Paper, Typography } from "@mui/material";

function Customers() {
  return (
    <Box sx={{ p: 3, background: "#f5f7fb", minHeight: "100vh" }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Customers
        </Typography>
        <Typography color="text.secondary">
          Customer details view is not implemented yet.
        </Typography>
      </Paper>
    </Box>
  );
}

export default Customers;
