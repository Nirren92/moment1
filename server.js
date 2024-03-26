const { render } = require("ejs");
const {Client} = require("pg");
require("dotenv").config();

const cors = require('cors');
const express = require("express");
const app = express();
app.use(cors());
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

//startsida på server
app.get("/",cors(), async(req,res) =>{
    
    const messages = [
        { name: 'Message 1' },
        { name: 'Message 2' },
        { name: 'Message 3' }
    ];

    res.render('index', { messages });
});

//kurser som finns inlagda i systemet. Testar att skapa api
app.get("/api/courses",cors(),async(req,res) =>{
    
    client.query("SELECT * FROM courses", (err, result) =>{
        if(err)
        {
            console.log("nåt gick fel")
        }
        else
        {
            console.log("Hämtat data")
            if(result.rows.length < 1)
            {
                console.log("inga rader fanns.sätta nåt default värde?")
                res.json(result.rows);
            }
            else
            {
                res.json(result.rows);
            }

        }

    });
});

//studenter som finns inlagda i systemet
app.get("/api/student",cors(), async(req,res) =>{
     
    client.query("SELECT * FROM student", (err, result) =>{
        if(err)
        {
            console.log("nåtgick fel")
        }
        else
        {
            console.log("Hämtat data")
            if(result.rows.length < 1)
            {
                console.log("inga rader fanns.sätta nåt default värde?")
                res.json(result.rows);
            }
            else
            {
                res.json(result.rows);
            }

        }

    });
});

app.post("/",cors() ,async(req,res) => {
    console.log("lägger till data.")
    
    const { code, name, syllabus, progression } = req.body;

    const result = await client.query("INSERT INTO courses(code, name, syllabus, Progression) VALUES ($1,$2,$3,$4)",[code, name, syllabus, Progression])

});

//Starta server
app.listen(process.env.PORT, () =>{
    console.log("server startad");   
});