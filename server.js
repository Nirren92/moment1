const { render } = require("ejs");
const {Client} = require("pg");
require("dotenv").config();



const express = require("express");
const app = express();
app.use(express.json());





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
app.get("/", async(req,res) =>{
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
            }
            else
            {
                
                res.render('index', { messages:result.rows });
            }
        }
    });
});


//adddera kurs på server
app.get("/addcourse", async(req,res) =>{
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
            }
            else
            {
                
                res.render('addcourse', { messages:result.rows });
            }
        }
    });
});


//about sida

//startsida på server
app.get("/about", async(req,res) =>{
 
                res.render('about');
         
    
});


//kurser som finns inlagda i systemet. Testar att skapa api
app.get("/api/courses",async(req,res) =>{
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
app.get("/api/student", async(req,res) =>{
    client.query("SELECT * FROM student", (err, result) =>{
        if(err)
        {
            console.log("nåtgick fel")
        }
        else
        {
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

//lägger till kurs
app.post('/addcourse',  async (req, res) => {
   
    try
    {
    const { code, kursnamn, syllabus, progression } = req.body;
    const result = await client.query("INSERT INTO courses(code, name, syllabus, progression) VALUES ($1,$2,$3,$4)",[code, kursnamn, syllabus, progression])
    }
    catch (err)
    {
        console.error("Nåt gick fel:"+err)
    }
    res.redirect('/');

});
//tar bort kurs
app.post('/removecourse', async (req, res) => {
    try
    {
       const { code } = req.body;
       const result = await client.query("DELETE FROM courses WHERE code=$1",[code])  
       
    }
    catch (err)
    {
        console.error("Nåt gick fel:"+err)
    }
    res.redirect('/');
});

//Starta server
app.listen(process.env.PORT, () =>{
    console.log("server startad");   
});

