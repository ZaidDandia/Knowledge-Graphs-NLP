import React, { useState, useEffect, useRef } from "react";
import { Box, TextField, IconButton, Paper, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // Enable GitHub-Flavored Markdown (optional)

type StructuredResponse = Record<string, string>;

const Chatbot: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<
    { user: boolean; text: string; structured?: StructuredResponse }[]
  >([]);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const handleSend = async () => {
    if (input.trim()) {
      setMessages((prev) => [...prev, { user: true, text: input }]);

      const userMessage = input;
      setInput("");

      try {
        const response = await fetch("http://localhost:8000/chatbot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: userMessage }),
        });

        if (response.ok) {
          const data = await response.json();
          const botResponse = parseStructuredResponse(data.response);

          setMessages((prev) => [
            ...prev,
            {
              user: false,
              text: botResponse.text,
              structured: botResponse.structured,
            },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            { user: false, text: "Sorry, something went wrong." },
          ]);
        }
      } catch (error) {
        console.error("Error sending message:", error);
        setMessages((prev) => [
          ...prev,
          { user: false, text: "Unable to connect to the server." },
        ]);
      }
    }
  };

  const parseStructuredResponse = (
    response: string
  ): {
    text: string;
    structured?: StructuredResponse;
  } => {
    const structured: StructuredResponse = {};
    const lines = response.split("\n").map((line) => line.trim());

    lines.forEach((line) => {
      const match = line.match(/^\*\*(.+?):\*\*\s*(.+)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        structured[key] = value;
      }
    });

    if (Object.keys(structured).length > 0) {
      return { text: "", structured };
    }

    return { text: response };
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 80px)",
        backgroundColor: "#343541",
        color: "#e8e8e8",
      }}
    >
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
                maxWidth: "75%",
                backgroundColor: msg.user ? "#40414f" : "#202123",
                color: "#e8e8e8",
                borderRadius: "10px",
                paddingLeft: "40px",
              }}
            >
              {msg.structured ? (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    <strong>Related Topics:</strong>
                  </Typography>
                  {Object.entries(msg.structured).map(([key, value]) => (
                    <Box
                      key={key}
                      sx={{ marginLeft: "10px", marginBottom: "5px" }}
                    >
                      <Typography variant="body1">
                        <strong>{key}:</strong> {value}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    ul: ({ ...props }) => (
                      <Box
                        component="ul"
                        sx={{
                          paddingLeft: "20px",
                          margin: "10px 0",
                          listStyleType: "disc",
                        }}
                        {...props}
                      />
                    ),
                    li: ({ ...props }) => (
                      <Box
                        component="li"
                        sx={{
                          marginBottom: "5px",
                          display: "list-item",
                        }}
                        {...props}
                      />
                    ),
                    p: ({ ...props }) => (
                      <Typography
                        sx={{
                          marginBottom: "10px",
                        }}
                        {...props}
                      />
                    ),
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              )}
            </Paper>
          </Box>
        ))}
        <div ref={chatEndRef} />
      </Box>

      <Box
        sx={{
          padding: "10px",
          backgroundColor: "#40414f",
          borderTop: "1px solid #303030",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "10px",
          paddingRight: "20px",
        }}
      >
        <TextField
          fullWidth
          placeholder="Type your message..."
          variant="outlined"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          InputProps={{
            style: {
              backgroundColor: "#111",
              color: "#e8e8e8",
              borderRadius: "5px",
            },
          }}
        />
        <IconButton
          color="primary"
          onClick={handleSend}
          sx={{
            backgroundColor: "#fff",
            "&:hover": { backgroundColor: "#f5f5f5" },
          }}
        >
          <SendIcon sx={{ color: "black" }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Chatbot;
