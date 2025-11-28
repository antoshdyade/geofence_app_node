const express = require("express");
const router = express.Router();
const db = require("../db");
const { isAdmin, isLoggedIn } = require("../middleware/authMiddleware");

router.get("/list", isLoggedIn, (req, res) => {
    db.query("SELECT * FROM geofences", (err, data) => res.json(data));
});

router.post("/add", isAdmin, (req, res) => {
    const { name, polygon } = req.body;

    db.query(
        "INSERT INTO geofences (name, fence_type, polygon_geojson) VALUES (?, 'restricted', ?)",
        [name, JSON.stringify(polygon)],
        (err, result) => res.json({ id: result.insertId })
    );
});

router.delete("/delete/:id", isAdmin, (req, res) => {
    db.query("DELETE FROM geofences WHERE id=?", [req.params.id], () =>
        res.json({ message: "Geofence deleted" })
    );
});

module.exports = router;
