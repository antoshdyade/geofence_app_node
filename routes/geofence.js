// routes/geofence.js
const express = require("express");
const router = express.Router();
const db = require("../db");
const { isAdmin, isLoggedIn } = require("../middleware/authMiddleware");
const inside = require("point-in-polygon");

// --------------------------------------------------
// GET ALL GEOFENCES (LOGIN REQUIRED)
// --------------------------------------------------
router.get("/list", isLoggedIn, (req, res) => {
    db.query("SELECT * FROM geofences", (err, data) => res.json(data));
});

// --------------------------------------------------
// ADD NEW GEOFENCE (ADMIN ONLY)
// --------------------------------------------------
router.post("/add", isAdmin, (req, res) => {
    const { name, polygon } = req.body;

    db.query(
        "INSERT INTO geofences (name, fence_type, polygon_geojson) VALUES (?, 'restricted', ?)",
        [name, JSON.stringify(polygon)],
        (err, result) => res.json({ id: result.insertId })
    );
});

// --------------------------------------------------
// DELETE GEOFENCE (ADMIN ONLY)
// --------------------------------------------------
router.delete("/delete/:id", isAdmin, (req, res) => {
    db.query("DELETE FROM geofences WHERE id=?", [req.params.id], () =>
        res.json({ message: "Geofence deleted" })
    );
});

// --------------------------------------------------
// CHECK POINT INSIDE GEOFENCE
//  PUBLIC — DOES NOT REQUIRE LOGIN
// --------------------------------------------------
router.post("/check", (req, res) => {
    const { lat, lng } = req.body;

    if (!lat || !lng) {
        return res.json({ error: "Latitude and Longitude required" });
    }

    db.query("SELECT * FROM geofences", (err, fences) => {
        if (err) return res.json({ error: err });

        const point = [parseFloat(lng), parseFloat(lat)];

        for (let fence of fences) {
            if (!fence.polygon_geojson) continue;

            let geojson;
            try {
                geojson = JSON.parse(fence.polygon_geojson);
            } catch (e) {
                console.log("Invalid GeoJSON for fence:", fence.id);
                continue;
            }

            // ---------- NEW CORRECT FORMAT CHECK ----------
            let polygon;

            // Case 1: Leaflet Polygon Feature
            if (
                geojson.type === "Feature" &&
                geojson.geometry &&
                geojson.geometry.type === "Polygon"
            ) {
                polygon = geojson.geometry.coordinates[0];
            }
            // Case 2: Direct polygon object
            else if (
                geojson.type === "Polygon" &&
                geojson.coordinates
            ) {
                polygon = geojson.coordinates[0];
            }
            else {
                console.log("Invalid polygon structure for fence:", fence.id);
                continue;
            }

            // Point-in-polygon test
            if (inside(point, polygon)) {
                return res.json({
                    inside: true,
                    geofence_id: fence.id,
                    geofence_name: fence.name
                });
            }
        }

        res.json({ inside: false });
    });
});


module.exports = router;
