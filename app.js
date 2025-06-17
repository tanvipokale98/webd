import express from "express";
import bodyParser from "body-parser";
import path from "path";
import engine from "ejs-mate";
import { fileURLToPath } from "url"; 

const __filename= fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);
const app=express();

app.engine("ejs",engine);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get("/",(req,res)=>{
     res.render("index");
});

app.listen(3006,()=>{
  console.log("port running");
});