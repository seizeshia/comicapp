var controller = require('./../controllers/controller')
function authenticate(req,res,next){
	if(req.session.userId){
		next();
	}else{
		res.sendStatus(401);
	}
}
module.exports = (app) =>{
  app.get('/', controller.index)
  app.post('/login', controller.login)
  app.post('/register', controller.register)
  app.get('/checker', controller.checker)
}
