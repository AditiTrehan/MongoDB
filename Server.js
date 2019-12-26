var express = require("express");
var app = express();
var bodyparser = require("body-parser");
var router = express.Router();
var mongoOp = require('./model/mongo')

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}))

router.get("/",function(req,res){
    res.json({
        "error":false,
        "message":"Hello World"
    });
})

router.route("/users")
    .get(function(req,res){
        var response = {};
        mongoOp.find({},function(err,data){
            if(err){
                response = {"error" : true,"message":"Error fetching data"};
            }
            else{
                response={"error":false,"message":data}
            }
            res.json(response);
        })
    })
    .post((req,res)=>{
        var db = new mongoOp();
        var response = {};

        db.userEmail = req.body.email;

        db.userPassword = require('crypto')
                          .createHash('sha1')
                          .update(req.body.password)
                          .digest('base64');
        
        db.save((err)=>{
            if(err){
                response = {"error":true,"message":"Error adding data"};
            }
            else{
                response = {"error":false, "message":"Data Added"}
            }
            res.json(response);
        })
    })

router.route("/users/:id")
    .get((req,res)=>{
        var response = {};
        mongoOp.findById(req.params.id,(err,data)=>{
            if(err){
                response = {"error":true,"message":"Error fetching data"};
            }
            else{
                response = {"error":false,"message":data}
            }
            res.json(response)
        })
    })
    .put((req,res)=>{
        var response = {};
        mongoOp.findById(req.params.id,function(err,data){
            if(err){
                response={"error":true,"message":"Error fetching data"};
            }
            else{
                if(req.body.userEmail != undefined){
                    data.userEmail = req.body.userEmail;
                }
                if(req.body.userPassword != undefined){
                    data.userPassword = req.body.userPassword;
                }
                data.save((err)=>{
                    if(err){
                        response = {"error":true,message:"Error updating data"}
                    }
                    else{
                        response = {"error":false,"message":"Data updated successfully for "+ req.params.id}
                    }
                    res.json(response);
                })
            }
        })
    })
    .delete((req,res)=>{
        var response = {};
        let id = req.params.id;
        mongoOp.findById(id,(err,data)=>{
            if(err){
                response = {"error":true,"message":"Error fetching data"}
            }
            else{
                mongoOp.remove({_id:id}, (err)=>{
                    if(err){
                        response = {"error":true, "message":"Error deleting data"}
                    }
                    else{
                        response = {"error":false,"message":"Data associated with " + req.params.id + " is deleted"}
                    }
                    res.json(response)
                })
            }
        })
    })
app.use('/',router);
app.listen(3000);
console.log("Listening to PORT 3000");