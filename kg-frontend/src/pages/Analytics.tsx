import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Divider } from "@mui/material";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const Analytics: React.FC = () => {
  // Mock Data (replace with actual API/backend data)
  const [analytics, setAnalytics] = useState({
    totalNodes: 200,
    totalRelationships: 350,
    graphDensity: 0.03, // Mock density
    avgDegree: 3.5, // Mock degree
    largestComponentSize: 150,
  });

  // Data for Pie Chart
  const pieData = {
    labels: ["Nodes", "Relationships"],
    datasets: [
      {
        data: [analytics.totalNodes, analytics.totalRelationships],
        backgroundColor: ["#4caf50", "#f44336"], // Green and Red
        borderColor: ["#2e7d32", "#b71c1c"],
        borderWidth: 1,
      },
    ],
  };

  useEffect(() => {
    // Fetch analytics data from backend or Neo4j API
    // Fetch analytics data from the backend
    const fetchAnalytics = async () => {
      try {
        const response = await fetch("http://localhost:8000/analytics");
        const data = await response.json();
        console.log(data);
        setAnalytics({
          totalNodes: data.totalNodes,
          totalRelationships: data.totalRelationships,
          graphDensity: data.graphDensity,
          avgDegree: data.avgDegree,
          largestComponentSize: data.largestComponentSize,
        });
      } catch (error) {
        console.error("Error fetching analytics:", error);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <Box
      sx={{
        padding: "20px",
        maxWidth: "900px",
        height: "calc(100vh - 100px)",
        margin: "10px auto",
        backgroundColor: "#1e1e1e", // Dark background
        color: "#e0e0e0", // Light text color
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        justifyContent: "center",
        alignSelf: "center",
      }}
    >
      <Typography
        variant="h4"
        textAlign="center"
        gutterBottom
        sx={{ color: "#4caf50" }} // Green title
      >
        Knowledge Graph Analytics
      </Typography>

      {/* Metrics */}
      <Paper
        elevation={3}
        sx={{
          padding: "20px",
          marginBottom: "20px",
          backgroundColor: "#2e2e2e", // Slightly lighter dark gray
          color: "#e0e0e0",
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ color: "#4caf50" }}>
          Key Metrics
        </Typography>
        <Divider sx={{ marginBottom: "10px", backgroundColor: "#4caf50" }} />
        <Typography variant="body1">
          - Total Nodes: <b>{analytics.totalNodes}</b>
        </Typography>
        <Typography variant="body1">
          - Total Relationships: <b>{analytics.totalRelationships}</b>
        </Typography>
        <Typography variant="body1">
          - Graph Density: <b>{analytics.graphDensity.toFixed(2)}</b>
        </Typography>
        <Typography variant="body1">
          - Average Node Degree: <b>{analytics.avgDegree.toFixed(2)}</b>
        </Typography>
        <Typography variant="body1">
          - Largest Connected Component Size:{" "}
          <b>{analytics.largestComponentSize}</b>
        </Typography>
      </Paper>

      {/* Pie Chart */}
      <Paper
        elevation={3}
        sx={{
          padding: "20px",
          marginBottom: "20px",
          backgroundColor: "#2e2e2e", // Slightly lighter dark gray
          color: "#e0e0e0",
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ color: "#4caf50" }}>
          Graph Composition
        </Typography>
        <Divider sx={{ marginBottom: "10px", backgroundColor: "#4caf50" }} />
        <Box sx={{ width: "100%", maxWidth: "400px", margin: "0 auto" }}>
          <Pie data={pieData} />
        </Box>
      </Paper>

      {/* Additional Insights */}
      <Paper
        elevation={3}
        sx={{
          padding: "20px",
          backgroundColor: "#2e2e2e", // Slightly lighter dark gray
          color: "#e0e0e0",
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ color: "#4caf50" }}>
          Additional Insights
        </Typography>
        <Divider sx={{ marginBottom: "10px", backgroundColor: "#4caf50" }} />
        <Typography variant="body1">
          Graph density indicates the proportion of possible edges that are
          present. A higher density means a more interconnected graph.
        </Typography>
        <Typography variant="body1">
          The largest connected component is crucial for analyzing the most
          significant subgraph in the Knowledge Graph.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Analytics;
