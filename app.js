const express = require("express");
const https = require("https");
const bodyparser = require("body-parser");

const app = express();

app.use(bodyparser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html")
});

app.post("/",function(req,res){
    
    const city = req.body.cityName;
    const apikey = "78f8e2a487b1e50aec40ae39005bb489";
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&units="+unit+"&appid="+apikey;

    https.get( url,function(response){
        console.log(response.statusCode);

        response.on("data",function(data){
            const weatherData=JSON.parse(data);
            const temp = weatherData.main.temp;
            const desc = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const URL = "http://openweathermap.org/img/wn/"+icon+"@2x.png";
            res.write("<h1>The Temperature in "+city+" is "+temp+" degree Celcius    </h1>");
            res.write("<h3>The weather is Currently "+desc+"</h3>");
            res.write("<img src = "+URL+">"); 
            res.send();
        })  
    });

});


app.listen(3020,function(){
    console.log("Server is Running");
});