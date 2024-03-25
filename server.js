const { render } = require("ejs");
const {Client} = require("pg");
require("dotenv").config();

const express = require("express");
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));



//Ansluter
const client = new Client({
    host:process.env.DB_HOST,
    port:process.env.DB_PORT,
    user:process.env.DB_USERNAME,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_DATABASE,
    ssl:{
        rejectUnauthorized: false,
    },
}); 


client.connect((err) => {
    if(err)
    {
        console.error("gick inte att ansluta.", err);
    }
    else
    {
        console.log("Ansluten till datbas. ");
    }
});


//Routing
app.get('/api/data',async(req,res) =>{
    
    client.query("SELECT * FROM student", (err, result) =>{
        if(err)
        {
            console.log("nåtgick fel")
        }
        else
        {
            console.log("Hämtat data")
            res.json(result.rows);
        }

    });
    
    
    



});

app.post("/",async(req,res) => {
    console.log("lägger till data.")
});

//Starta server
app.listen(process.env.PORT, () =>{
    console.log("server startad");   
});