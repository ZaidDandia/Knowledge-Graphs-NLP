import React, { useState } from "react";
import { Box, Typography, TextField, Button, Paper, Grid } from "@mui/material";

const prefilledQueries = [
  "MATCH (n) RETURN n LIMIT 10",
  "MATCH (n)-[r]->(m) RETURN n, r, m LIMIT 10",
  "MATCH (n {name: 'Alice'}) RETURN n",
];

const CypherQueryPage: React.FC = () => {
  const [queries, setQueries] = useState<string[]>(prefilledQueries);
  const [results, setResults] = useState<Record<number, any>>({});
  const [errors, setErrors] = useState<Record<number, string>>({});
  const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>(
    {}
  );

  const handleRunQuery = async (index: number) => {
    const query = queries[index];

    // Set loading state for the specific query
    setLoadingStates((prev) => ({ ...prev, [index]: true }));
    setErrors((prev) => ({ ...prev, [index]: "" })); // Clear previous error
    setResults((prev) => ({ ...prev, [index]: null })); // Clear previous result

    try {
      const response = await fetch("http://localhost:8000/run-query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();

      if (data.success) {
        setResults((prev) => ({ ...prev, [index]: data.result }));
      } else {
        setErrors((prev) => ({
          ...prev,
          [index]: data.error || "Failed to run query.",
        }));
      }
    } catch (err) {
      console.error("Error:", err);
      setErrors((prev) => ({
        ...prev,
        [index]: "An error occurred while running the query.",
      }));
    } finally {
      setLoadingStates((prev) => ({ ...prev, [index]: false }));
    }
  };

  const handleAddQueryField = () => {
    setQueries((prevQueries) => [...prevQueries, ""]);
  };

  const handleQueryChange = (index: number, value: string) => {
    const updatedQueries = [...queries];
    updatedQueries[index] = value;
    setQueries(updatedQueries);
  };

  return (
    <Box
      sx={{
        padding: "20px",
        maxWidth: "1000px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <Typography variant="h4" textAlign="center" gutterBottom>
        Run Cypher Queries
      </Typography>
      <Grid
        container
        spacing={2}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          flexDirection: "column",
          width: "100%",
        }}
      >
        {queries.map((query, index) => (
          <Grid
            item
            key={index}
            sx={{
              width: "100%",
            }}
          >
            <Paper
              elevation={3}
              sx={{
                padding: "10px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <TextField
                multiline
                rows={4}
                fullWidth
                variant="outlined"
                value={query}
                onChange={(e) => handleQueryChange(index, e.target.value)}
                placeholder={`Enter Cypher query ${index + 1}`}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleRunQuery(index)}
                disabled={loadingStates[index]}
              >
                {loadingStates[index] ? "Running..." : "Run Query"}
              </Button>
              {results[index] && (
                <Box
                  sx={{
                    marginTop: "10px",
                    backgroundColor: "#f5f5f5",
                    padding: "10px",
                    borderRadius: "5px",
                    height: "200px",
                    overflowY: "scroll",
                  }}
                >
                  <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                    {JSON.stringify(results[index], null, 2)}
                  </Typography>
                </Box>
              )}
              {errors[index] && (
                <Typography color="error" sx={{ marginTop: "10px" }}>
                  {errors[index]}
                </Typography>
              )}
            </Paper>
          </Grid>
        ))}
        <Grid item xs={12}>
          <Button variant="outlined" onClick={handleAddQueryField}>
            Add Query Field
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CypherQueryPage;
