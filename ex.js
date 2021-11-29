const express =require('express');
const sql =require('mysql2');
const bp = require('body-parser');
var session = require('express-session');

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
	res.sendFile(`${__dirname}/dashboard.html`)
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
    let qr = `INSERT into student(name,mail,regno,password) values('${name}','${email}','${regno}','${password}')`;
    db.query(qr,(err,result)=>{
        if(err){
            console.log(err);
        }
    })
    res.redirect('/dashboard.html');
})
app.post('/login',(req,res)=>{

   
    var email = req.body.email;
    console.log(email);
    var password = req.body.password;
    console.log(password);
    
    if (email && password) {
		db.query(`SELECT * FROM student WHERE mail = '${email}' AND password = '${password}'`, function(error, results) {
			if (results.length > 0) {
                console.log(results);
				req.session.loggedin = true;
				req.session.email = email;
				req.session.regno= regno;
				res.redirect('/dashboard.html');
			} else {
                console.log(results);
				res.redirect('/login.html')
			}			
			res.end();
		});
	} else {
		res.redirect('/login.html')
		
	}
});




