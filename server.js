const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const geofenceRoutes = require("./routes/geofence");
const usersRoutes = require("./routes/users");
const locationRoutes = require("./routes/location");

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(session({
    name: "geofence.sid",
    secret: "super_secret_key_123",
    saveUninitialized: false,
    resave: false,
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24
    }
}));

app.use(express.static("public"));

app.use("/auth", authRoutes);
app.use("/geofence", geofenceRoutes);
app.use("/users", usersRoutes);
app.use("/location", locationRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
