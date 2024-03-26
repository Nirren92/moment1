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


//skapar tabell
client.query(`
DROP TABLE IF EXISTS read_course;
DROP TABLE IF EXISTS student;
DROP TABLE IF EXISTS courses;

CREATE TABLE courses(
    code TEXT Primary KEY,
    name Text NOT NULL,
    syllabus Text NOT NULL,
    Progression Text NOT NULL
);

CREATE TABLE student(
    id SERIAL Primary KEY,
    name TEXT
);

CREATE TABLE read_course(
    code TEXT,
    id INT NOT NULL,
    PRIMARY KEY (id, code),

    FOREIGN KEY (id) 
        REFERENCES student(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    FOREIGN KEY (code) 
        REFERENCES courses (code)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


INSERT INTO courses (code, name, syllabus, progression) VALUES 
('DT001','kurs ett','länk','A'),
('DT002','kurs ett','länk','A'),
('DT003','kurs ett','länk','A');

INSERT INTO student (name) VALUES 
('niklas'),
('niklas2'),
('niklas3');



`);


