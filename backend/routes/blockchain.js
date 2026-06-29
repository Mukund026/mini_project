const express = require("express");
const router = express.Router();
const contract = require("../blockchain/supplyChain");

router.get("/trace/:hash", async (req, res) => {
  try {
    const hash = req.params.hash;

    const traces = await contract.getAllTraces(hash);

    res.json({ traces });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed" });
  }
});

module.exports = router;
