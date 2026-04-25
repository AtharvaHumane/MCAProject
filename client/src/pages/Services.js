import { Box, Paper, Typography } from "@mui/material";

function Services() {
  return (
    <Box sx={{ p: 3, background: "#f5f7fb", minHeight: "100vh" }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Services
        </Typography>
        <Typography color="text.secondary">
          Service management view is not implemented yet.
        </Typography>
      </Paper>
    </Box>
  );
}

export default Services;
