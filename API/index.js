const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const dotenv = require("dotenv");
const vehicleRoute = require("./routes/vehicle");
const VehiclecheckRoute = require("./routes/vehiclecheck");
const RoleRoute = require("./routes/Role");
const cors = require("cors");
 
dotenv.config();

// Configuration des middlewares
app.use(bodyParser.json({ limit: '2mb' })); // Augmentez la limite de taille ici


app.use(cors({
  credentials: true,
}));

app.use(express.json());
app.use("/api", vehicleRoute);
app.use("/api", VehiclecheckRoute);
app.use("/api", RoleRoute);




app.listen(5000, () => {
  console.log("Backend server is running in 5000!");
});
