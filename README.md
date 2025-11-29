# 🛰️ Geofence App – Node.js + MySQL  
A complete **Geofencing, User Management, Authentication & Location Tracking System** built using **Node.js, Express.js, Leaflet.js, MySQL, and REST APIs**.

This project allows administrators to:
- Draw geofences on a map  
- Add/manage users  
- Track GPS coordinates  
- Restrict user access based on roles  
- Maintain admin/user login authentication  

Normal users can:
- View geofences  
- Send location updates  
- Access dashboard without admin privileges  

---

## 🚀 Features

### 👨‍💼 Admin Features
- Create & manage users  
- Add geofences  
- Delete geofences  
- Manage restricted zones  
- View user activities  
- Exclusive access to Add User panel

### 👤 User Features
- Log in securely  
- View geofences on map  
- Restricted from creating users  
- Restricted from modifying zones

### 🗺️ Geofencing Module
- Draw Polygon / Rectangle zones  
- Based on **Leaflet + Leaflet-Draw**  
- Stored as GeoJSON in MySQL  
- Add/Delete geofences dynamically  

### 📡 GPS Location API
- Mobile/IoT device sends:
  ```json
  { "user_id": 1, "lat": 18.5204, "lng": 73.8567 }
  
###  System Architecture
+-------------+        +-----------------+        +------------------+
|  Frontend   | <----> |   Node.js API   | <----> |   MySQL Database |
| (Leaflet UI)|        | (Express Server)|        | (GeoJSON, Users) |
+-------------+        +-----------------+        +------------------+

User Roles:
 - Admin → Full Access
 - User  → View Only

###  📁 Folder Structure
geofence_app_node/
│── server.js
│── db.js
│── package.json
│── /routes
│     ├── auth.js
│     ├── users.js
│     ├── geofence.js
│     └── location.js
│── /middleware
│     └── authMiddleware.js
│── /public
      ├── login.html
      ├── dashboard.html
      ├── manage_users.html

###  Database
CREATE DATABASE geo_fencing;

USE geo_fencing;

CREATE TABLE admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100),
  password VARCHAR(255),
  role ENUM('admin','user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE geofences (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  fence_type VARCHAR(50),
  polygon_geojson JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE locations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  latitude DOUBLE,
  longitude DOUBLE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
### Install Dependencies 
cd geofence_app_node
npm install

###  Start the Server
node server.js

### Open App in Browser
http://localhost:5000/login.html

🔑 Default Admin Login
Username: admin
Password: admin123
(Ensure admin row exists with role = "admin")

###  📡 API Documentation
🔐 Login
POST /auth/login

Get Logged-In User
GET /auth/me

Logout
GET /auth/logout

###  👨‍💼 User Management API (Admin Only)
Add User
POST /users/add

List Users
GET /users/list

Delete User
DELETE /users/delete/:id

###  🗺️ Geofence API
Add Geofence (Admin Only)
POST /geofence/add

List Geofences
GET /geofence/list

Delete Geofence
DELETE /geofence/delete/:id

###  📡 Location Tracking API
Send GPS Location
POST /location/gps


####  Sample JSON:

{
  "user_id": 1,
  "lat": 18.5204,
  "lng": 73.8567
}

###  🧪 cURL Commands
Login
curl -X POST http://localhost:5000/auth/login \
-H "Content-Type: application/json" \
-d "{\"username\":\"admin\", \"password\":\"admin123\"}" \
-c cookie.txt

####  Check Logged-In User
curl http://localhost:5000/auth/me -b cookie.txt

Add Geofence
curl -X POST http://localhost:5000/geofence/add \
-H "Content-Type: application/json" \
-b cookie.txt \
-d "{\"name\":\"Zone1\", \"polygon\":{\"type\":\"Polygon\",\"coordinates\":[...]}}"

#### Add User
curl -X POST http://localhost:5000/users/add \
-H "Content-Type: application/json" \
-b cookie.txt \
-d "{\"username\":\"test1\", \"password\":\"12345\"}"

###  📱 Mobile App Integration (GPS Sender)
Android Example
val json = JSONObject()
json.put("user_id", 1)
json.put("lat", 18.5204)
json.put("lng", 73.8567)

val body = RequestBody.create(
    MediaType.parse("application/json"), json.toString()
)

val request = Request.Builder()
    .url("http://your-server/location/gps")
    .post(body)
    .build()
