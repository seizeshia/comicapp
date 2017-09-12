var mongoose = require('mongoose');
var bodyParser =require('body-parser');
var Users = mongoose.model('Users');

var bcrypt= require('bcryptjs');

var salt = bcrypt.genSaltSync(10);

 module.exports = {
   index:(request,response)=>{
     console.log("index");
   },
  
   login: (request,response)=>{

     if(request.body.token == ""){
     console.log("right huuuuuuuuuuuuuuur",request.body);
    //  Users.findOne(username: request.body.username)
    //  .then(user) => {
    //    if(user.password == request.body.password){
    //      console.log(user, "_______________________");
    //      response.json(user);
    //    }
    //    else {
    //      response.json({error:"password and username do not match"})
    //    }
    //  }
    //  .catch(err) => {
    //    response.json({error: err})
    //  }
     Users.findOne({username: request.body.username}, function(err, user){
       if(err){
         response.json({message: "Error",error:err})
       }
       if(user == null){
         console.log("there was an error!!!!!!!!!!!!!!!!!!!!!")
         response.json({message: "No user found"});
       }
       else if(bcrypt.compareSync(request.body.password, user.password))
       {
         console.log(user, "_______________________");
         response.json({message: "User found", user: user});
       }
       else{
         response.json({message:"password and username do not match"});
       }
     })
    }else{
      response.json({message:"wrong token"})

    }
   },
   register: (request, response)=>{
     if(request.body.token == ""){
     console.log("here I am Mister!!!!!!!!!!!!")
     console.log(request.body.password.length)
     if(request.body.username.length < 5){
       response.json({message: "username is less than 5 characters"})
     }
     else if(request.body.email.length < 3){

       response.json({message: "email is less that 3 characters"})
     }
     else if(request.body.password.length < 4){
       console.log("email")
       response.json({message:"password is less than 4 characters"})
     }
     else if(request.body.password != request.body.passconf){
       response.json({message:"passwords do not match"})
     }
     else{
       Users.findOne({email:request.body.email}, function(err,email){
         if(email != null){
           response.json({message:"Email has been used! please log in"})
         }
         else{
          Users.findOne({username: request.body.username},function(err,user){
            if(err){
              response.json({message: "Error", error:err})
            }
            if(user == null){
              console.log("register request body", request.body)
              var hash = bcrypt.hashSync(request.body.password,salt);
              var newuser = new Users();
              newuser.username = request.body.username;
              newuser.password =  hash;
              newuser.email = request.body.email;
              newuser.location = request.body.location;
              newuser.save(function(err,saveduser){
                if(err){
                  response.sendStatus(500);
                }else{
                  request.session.user = saveduser
                  response.json(newuser)
                }
              })
            }else{
              response.json({message:"Username has been used! please try another or sign in"})
            }
          })
         }
       })
      
     }
    }else{
      response.json({message:"wrong token"})
    }
   },
   checker:(request, response)=>{
    if(request.body.token == ""){
     console.log(request.body.token)
    
    //  console.log("pooooooooooooooooop", request.body)
     Users.find({}, function(err,user){
       response.json(user)
     })
    }else{
      response.json({message:"token isn't right!"})
    }
  
   
  },
   }
