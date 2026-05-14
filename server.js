import express from "express";

const app = express();

app.get("/", async (req, res) => {

  return res.json({
    status: "success",
    message: "server working"
  });

});

const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
