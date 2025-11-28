const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/gps", (req, res) => {
    const { user_id, lat, lng } = req.body;

    db.query("INSERT INTO locations (user_id, latitude, longitude) VALUES (?, ?, ?)",
        [user_id, lat, lng]
    );

    res.json({ message: "Location saved" });
});

module.exports = router;
