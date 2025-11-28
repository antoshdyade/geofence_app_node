const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs");
const { isAdmin } = require("../middleware/authMiddleware");

router.post("/add", isAdmin, (req, res) => {
    const { username, password } = req.body;

    db.query("SELECT * FROM admin_users WHERE username=?", [username], (err, data) => {
        if (data.length > 0) return res.json({ error: "Username exists" });

        bcrypt.hash(password, 10, (err, hash) => {
            db.query(
                "INSERT INTO admin_users (username, password, role) VALUES (?, ?, 'user')",
                [username, hash],
                () => res.json({ message: "User created" })
            );
        });
    });
});

router.get("/list", isAdmin, (req, res) => {
    db.query("SELECT * FROM admin_users", (err, data) => res.json(data));
});

router.delete("/delete/:id", isAdmin, (req, res) => {
    db.query("DELETE FROM admin_users WHERE id=?", [req.params.id], () =>
        res.json({ message: "User deleted" })
    );
});

module.exports = router;
