const express = require("express");
const app = express();
const oraret = [1, 2, 3];
// Your existing code to handle "/test" endpoint
app.get("/test", (req, res) => {
  try {
    console.log("Request received");
    // Sending a JSON response
    res.status(200).json({ oraret, message: "Success" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Rest of your server setup code...

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
