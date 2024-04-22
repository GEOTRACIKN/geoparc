const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const vehicleRoute = require("./routes/vehicle");
const usersRouter = require("./routes/users");
const puceRoutes = require("./routes/puce");
const driverroute = require("./routes/driver");
const groupVehicule = require("./routes/groupVehicule");
const permissionroute  = require("./routes/permission");
const maproute  = require("./routes/map");
const ibuttonroute = require("./routes/ibutton");
const fleetroute = require("./routes/fleet");
const devicetroute = require("./routes/device");
const snapshotsroute = require("./routes/snapshot");
const groupDevice = require("./routes/groupDevice");
const reports = require("./routes/reports");
const report = require("./routes/report");
const logpositions = require("./routes/logpositions");
const connexion =  require("./routes/connxion");
const search =  require("./routes/search"); 
const role = require("./routes/role");
const profile= require("./routes/profile");
const cors = require("cors");
 
dotenv.config();

// Configuration des middlewares
app.use(bodyParser.json({ limit: '2mb' })); // Augmentez la limite de taille ici


app.use(cors({
  credentials: true,
}));

app.use(express.json());
app.use("/api", vehicleRoute);
app.use("/api", authRoutes);
app.use("/api", usersRouter);
app.use("/api", puceRoutes);
app.use("/api", driverroute);
app.use("/api", permissionroute);
app.use("/api", maproute);
app.use("/api", ibuttonroute);
app.use("/api", fleetroute);
app.use("/api", devicetroute);
app.use("/api", snapshotsroute);
app.use("/api", reports);
app.use("/api", report);
app.use("/api", logpositions);
app.use("/api", connexion);
app.use("/api", groupVehicule);
app.use("/api", groupDevice);
app.use("/api", role);
app.use("/api", profile);
app.use("/api", search); 



app.listen( 5000, () => {
  console.log("Backend server is running in 5000!");
});
