const express =require('express');
const sql =require('mysql2');
const bp = require('body-parser');
var session = require('express-session');
const bcrypt = require('bcrypt');
const saltRounds = 10;


const app =express();

app.use(bp.json());
app.use(bp.urlencoded({ extended: false }));
app.use(express.static('images'));
app.use(express.static('scripts'));
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

const db = sql.createConnection({
	host:'localhost',
	user:'root',
	password:'',
	database:'spmp',
	port:'3306'
});
db.connect((err)=>{
	if(err){
		console.log('Db connection error',err);
	}
});
app.listen(3100,()=>{
	console.log('Server listening on 3100 !!!!!!!!!!!');

})
app.get('/dashboard',(req, res)=>{
	var obj;
	var email=req.session.email;
	db.query(`SELECT * FROM student WHERE mail = '${email}'`,(err,result)=>{
		obj=result;
		res.send(obj);
		res.end();
	})
	
})
app.get('/ecourse',(req, res)=>{
	var obj;
	var ecourse;
	var email=req.session.email;
	db.query(`SELECT * FROM student WHERE mail = '${email}'`,(err,result)=>{
		obj=result;
		
	})
	var x=obj[0];
	var y=x.regno;
	db.query(`Select * from enrollments WHERE email = '${y}'`,(err,result)=>{
		ecourse=result;
	})

res.send(ecourse);
	
})

app.get('/dashboard.html',(req,res)=>{
	if(req.session.loggedin==false){
		res.redirect("/login.html");
	}
	else{res.sendFile(`${__dirname}/dashboard.html`)}
	
})
app.get('/index',(req,res)=>{
    res.sendFile(`${__dirname}/index.html`)
})
app.get('/register.html',(req,res)=>{
    res.sendFile(`${__dirname}/register.html`);
})
app.get('/login.html',(req,res)=>{
    res.sendFile(`${__dirname}/login.html`);
})

app.post('/register',(req,res)=>{

    console.log(req.body);
    var name = req.body.name;
    var email = req.body.email;
    var regno = req.body.regno;
    var password = req.body.password;
	
	
	let qr1=`SELECT regno FROM student WHERE regno=('${regno}')`;
    db.query(qr1,(err,result)=>{
		if(result.length!=0){
			res.write(`<script>window.alert('regno already exists!!!!!!');window.location.href = 'register.html';</script>`)
		}
		else{
					const passwordHash = bcrypt.hashSync(password, 10);
					
					let qr = `INSERT into student(name,mail,regno,password) values('${name}','${email}','${regno}','${passwordHash}')`;
    db.query(qr,(err,result)=>{
        if(err){
            console.log(err);
        }
		res.redirect('/dashboard.html');
				});
			
			
    
		}
	})
    
})
app.post('/login',(req,res)=>{

   req.session.loggedin=false;
    var email = req.body.email;
    
    var password = req.body.password;
    
    
    if (email && password) {
		db.query(`SELECT * FROM student WHERE mail = '${email}' `, function(error, results) {
			if (results.length > 0) {
				var hash=results[0].password;
				
				console.log(hash);
				console.log(password);
				const passwordHash = bcrypt.hashSync(password, 10);
				console.log(passwordHash);
				const verified = bcrypt.compareSync(password, hash);
					console.log(verified);
					if (verified){
						
						req.session.loggedin = true;
						req.session.email = email;
						req.session.regno= results.regno;
						res.redirect('/dashboard.html');
					}
					else{
						res.write(`<script>window.alert('wrong  password!!!!!');window.location.href = 'login.html';</script>`);
					}
				
				
			} else {
                console.log(results);
				res.write(`<script>window.alert('wrong  email!!!!!');window.location.href = 'login.html';</script>`)
			}			
			res.end();
		});
	} else {
		res.write(`<script>window.alert('Enter  password and email!!!!!!');window.location.href = 'login.html';</script>`)
		
	}
});




