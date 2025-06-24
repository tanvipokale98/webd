import express from "express";
import bodyParser from "body-parser";
import path from "path";
import engine from "ejs-mate";
import session from "express-session";
import { fileURLToPath } from "url"; 
import env from "dotenv";
import cors from 'cors';
import mysql from "mysql2";
import { error } from "console";
const __filename= fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);
const app=express();
env.config();
app.engine("ejs",engine);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());

const db= mysql.createConnection({
host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log("database connected");
    }
})

app.get("/",(req,res)=>{
   let task=[];
    db.query("select details,id from task",(error,results)=>{
        console.log(results);
        if(error){
            console.log(error);
            return;
        }
       const task= results.map(item=>({

            id:item.id,
            details:item.details
        }));
        console.log(task);
        const now = new Date();
        const date = now.toLocaleDateString();
    res.render("index",{task:task,date:date});
    });
   
});
app.post("/add",(req,res)=>{
const task=req.body.task;
        if(task!=""){
            const query="INSERT INTO task(details,taskstatus) VALUES(?,false);";
         db.query(query,[task],(error,results)=>{
           if(error){
            console.log(error);
           }
           else{
            console.log("added successfully");
           }
         });
         res.redirect("/");
        }
         
});

app.post("/check",(req,res)=>{
    const id=req.body.taskid;
    const query="update task set taskstatus=? where id=?";
    db.query(query,[true,id],(error,results)=>{
          if(error){
            console.log(error);
          }
          res.redirect("/");
    });
})


app.post("/delete",(req,res)=>{
    const id=req.body.submit;
    const query="Delete from task where id=?";
    db.query(query,[id],(error,results)=>{
           if(error){
            console.log(error);
           }
           res.redirect("/");
 } );

});

app.post("/update",(req,res)=>{
    const task=req.body.taskinput;
    const id=req.body.submit2;
    const query="update task set details=? where id=?"
    db.query(query,[task,id],(error,results)=>{

        if(error){
            console.log(error);
            return;
        }
        res.redirect("/");
    })
});

app.post("/show",(req,res)=>{
const stat=req.body.filter;
let query;
if(stat==="all"){
    res.redirect("/");
}
else if(stat==="active"){
     query="select details,id from task where taskstatus=false";
    
}
else if(stat==="completed"){
    query="select details,id from task where taskstatus=true"
}
db.query(query,(error,results)=>{
        if(error){
            console.log(error);
        }
        const task= results.map(item=>({

            id:item.id,
            details:item.details
        }));
       const now = new Date();
        const date = now.toLocaleDateString();
    res.render("index",{task:task,date:date});
    })
});

app.listen(3005,()=>{
    console.log("port is running");
});