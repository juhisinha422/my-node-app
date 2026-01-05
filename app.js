const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>My App</title>
        <style>
          body {
            background-color: black;
            color: white;
            font-family: monospace;
            font-size: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
          }
        </style>
      </head>
      <body>
        Hi somasekhar reddy bontha
      </body>
    </html>
  `);
});

app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on port 3000");
});
