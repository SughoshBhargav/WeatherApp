const express = require("express");
const https = require("https");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const app = express();
require("dotenv").config();

app.set('view engine', 'ejs');

app.use(bodyparser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html")
});

app.post("/",function(req,res){
    
    const city = req.body.cityName;
    const apikey = process.env.API_KEY;
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&units="+unit+"&appid="+apikey;

    https.get( url,function(response){
        console.log(response.statusCode);

        response.on("data",function(data){
            const weatherData=JSON.parse(data);

            if(weatherData.cod != "200"){
                console.log(weatherData.statusCode);
                res.sendFile(__dirname+"/failure.html");
            }
            else{
                const temp = weatherData.main.temp;
                const desc = weatherData.weather[0].description;
                const icon = weatherData.weather[0].icon;
                const URL = "http://openweathermap.org/img/wn/"+icon+"@2x.png";
                res.render("data",{city_name : city ,temperature : temp,description: desc,icon_url : icon });
            }
            // res.write("<h1>The Temperature in "+city+" is "+temp+" degree Celcius    </h1>");
            // res.write("<h3>The weather is Currently "+desc+"</h3>");
            // res.write("<img src = "+URL+">"); 
            // res.send();
        })  
    });

});

app.post("/failure",function(req,res){
    res.redirect("/");
})


app.listen(3000,function(){
    console.log("Server is Running");
});