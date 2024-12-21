import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#111",
        color: "white",
        padding: "0 10px",
        height: "80px",
        display: "flex",
        justifyContent: "center",
        // alignItems: "center",
        boxShadow: "0 3px 5px rgba(0, 0, 0, 0.16)",
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Knowledge Graph
        </Typography>
        <Box>
          <Button component={Link} to="/" color="inherit">
            Home
          </Button>
          <Button component={Link} to="/cypher" color="inherit">
            Cypher Queries
          </Button>
          <Button component={Link} to="/analytics" color="inherit">
            Analytics
          </Button>
          <Button component={Link} to="/kg-display" color="inherit">
            Graph Display
          </Button>
          <Button component={Link} to="/dataset" color="inherit">
            Dataset
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
