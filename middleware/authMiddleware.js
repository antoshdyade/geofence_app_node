function isLoggedIn(req, res, next) {
    if (!req.session.user)
        return res.status(401).json({ error: "Not logged in" });
    next();
}

function isAdmin(req, res, next) {
    if (!req.session.user || req.session.user.role !== "admin")
        return res.status(403).json({ error: "Admin only" });
    next();
}

module.exports = { isLoggedIn, isAdmin };
