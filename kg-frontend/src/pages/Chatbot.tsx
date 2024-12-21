import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Stack,
} from "@mui/material";

const Chatbot: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<{ user: boolean; text: string }[]>(
    []
  );

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { user: true, text: input }]);
      setInput("");
      // Mock response from backend
      setMessages((prev) => [
        ...prev,
        { user: false, text: "This is a response from the Knowledge Graph." },
      ]);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "#1e1e1e", // Dark background
        color: "#e0e0e0", // Light text color
      }}
    >
      {/* Header */}
      <Box
        sx={{
          backgroundColor: "#3f51b5", // Darker blue for the header
          color: "white",
          padding: "10px 20px",
          textAlign: "center",
        }}
      >
        <Typography variant="h5">Chat with the Knowledge Graph</Typography>
      </Box>

      {/* Chat Area */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {messages.map((msg, idx) => (
          <Box
            key={idx}
            sx={{
              display: "flex",
              justifyContent: msg.user ? "flex-end" : "flex-start",
            }}
          >
            <Paper
              elevation={3}
              sx={{
                padding: "10px 15px",
                maxWidth: "60%",
                backgroundColor: msg.user ? "#4caf50" : "#616161", // Green for user, gray for bot
                color: "white",
                borderRadius: "10px",
              }}
            >
              <Typography variant="body1">{msg.text}</Typography>
            </Paper>
          </Box>
        ))}
      </Box>

      {/* Input Area */}
      <Box
        sx={{
          padding: "10px 20px",
          borderTop: "1px solid #333", // Subtle border for separation
          backgroundColor: "#2e2e2e", // Darker background for the input
        }}
      >
        <Stack direction="row" spacing={2}>
          <TextField
            fullWidth
            placeholder="Type your message..."
            variant="outlined"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            InputProps={{
              style: {
                backgroundColor: "#3e3e3e", // Dark input field
                color: "#e0e0e0",
              },
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSend}
            sx={{
              minWidth: "100px",
              backgroundColor: "#4caf50",
              "&:hover": { backgroundColor: "#388e3c" }, // Dark green on hover
            }}
          >
            Send
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default Chatbot;
