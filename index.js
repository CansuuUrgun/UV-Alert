import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import { render } from "ejs";

dotenv.config();
const app = express();
app.use(express.static("public"));

var sunriseStart, sunriseEnd;
var solarNoon;
var sunsetStart, sunsetEnd;

const port = process.env.PORT || 3000;

function getLocalTime(sunTimes){
    sunriseStart = new Date(sunTimes.sunrise).toLocaleTimeString( [], { hour: "2-digit", minute: "2-digit"});
    sunriseEnd   = new Date(sunTimes.sunriseEnd).toLocaleTimeString( [], { hour: "2-digit", minute: "2-digit"});
    solarNoon    = new Date(sunTimes.solarNoon).toLocaleTimeString( [], { hour: "2-digit", minute: "2-digit"});
    sunsetStart  = new Date(sunTimes.sunsetStart).toLocaleTimeString( [], { hour: "2-digit", minute: "2-digit"});
    sunsetEnd    = new Date(sunTimes.sunset).toLocaleTimeString( [], { hour: "2-digit", minute: "2-digit"});
}

app.get("/", async (req, res, next) => {
    try{
        const response = await axios.get("https://api.openuv.io/api/v1/uv?lat=41.0082&lng=28.9784&alt=50&dt=", {
            headers: { "x-access-token": process.env.OPENUV_KEY }});
        getLocalTime(response.data.result.sun_info.sun_times);
        res.render("index.ejs",{
            sunRiseS: sunriseStart,
            sunRiseE: sunriseEnd,
            solarNoonD: solarNoon,
            sunSetS: sunsetStart,
            sunSetE: sunsetEnd,
            uv: response.data.result.uv
        });
    } catch (error) {
        res.render("error.ejs", {
            status: error.response.status,
            message: error.message
        });
    }
});

app.listen(port,() => console.log(`Server running on port ${port}`));