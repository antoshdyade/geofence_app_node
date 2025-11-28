const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs");

// LOGIN
router.post("/login", (req, res) => {
    const { username, password } = req.body;

    db.query("SELECT * FROM admin_users WHERE username=?", [username], (err, data) => {
        if (err) return res.json({ error: err });
        if (data.length === 0) return res.json({ error: "Invalid username" });

        const user = data[0];

        bcrypt.compare(password, user.password, (err, match) => {
            if (!match) return res.json({ error: "Incorrect password" });

            req.session.user = {
                id: user.id,
                username: user.username,
                role: user.role
            };

            res.json({ message: "Login success", user: req.session.user });
        });
    });
});

// AUTH ME
router.get("/me", (req, res) => {
    if (!req.session.user) return res.json({ error: "Not logged in" });
    res.json(req.session.user);
});

// LOGOUT
router.get("/logout", (req, res) => {
    req.session.destroy();
    res.json({ message: "Logged out" });
});

module.exports = router;
