const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const dotenv = require("dotenv");
const vehicleRoute = require("./routes/vehicle");
const VehiclecheckRoute = require("./routes/vehiclecheck");
const VehiclesinitreRoute = require("./routes/vehiclesinistre");
const AuthRoute = require("./routes/auth");
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
app.use("/api", VehiclesinitreRoute);
app.use("/api", RoleRoute); 
app.use("/api", AuthRoute);




app.listen(5001, () => {
  console.log(`Backend server is running in 5001!`);
});
