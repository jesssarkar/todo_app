const { response } = require("express")
const express = require("express")
const app = express()
const PORT = 8500
const mongoose = require("mongoose")
const toDoTasks = require("./models/toDoTasks")
require("dotenv").config()
const toDoTask = require("./models/toDoTasks")

app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(express.urlencoded({extended: true}))

mongoose.connect(process.env.DB_CONNECTION,
    {useNewUrlParser: true},
    () => {console.log('Connected to Databse')})

app.get("/", async(req, res) => {
    try{
        toDoTask.find({}, (err,tasks) => {
            res.render("index.ejs", {
                toDoTasks: tasks
            })
        })
        }
    catch(err){
       response.status(500).send({message: error.message})
    }
})

app.post("/", async(req, res) => {
    const toDoTasks = new toDoTask(
        {
            title: req.body.title,
            content: req.body.content
        }
    )
    try{
        await toDoTasks.save()
        console.log(toDoTasks)
        res.redirect("/")
    }
    catch(err){
        if(err) return res.status(500).send(err)
        res.redirect('/')
    }
})

app 
    .route("/edit/:id")
    .get((req,res) => {
        const id = req.params.id
        toDoTask.find({}, (err,tasks) => {
            res.render('edit.ejs', {
                toDoTasks:tasks, idTask: id
            })
        })
    })
    .post((req,res) =>{
        const id = req.params.id
        toDoTask.findByIdAndUpdate(
            id,
            {
                title: req.body.title,
                content: req.body.content
            },
            err => {
                if (err) return res.status(500).send(err)
                res.redirect('/')
            }
        )
    })

app
    .route("/remove/:id")
    .get((req, res) => {
        const id = req.params.id
        toDoTask.findByIdAndRemove(id, err => {
            if (err) return res.status(500).send(err)
            res.redirect('/')
        })
    })

app.listen(PORT, () => console.log("Server is Running"))