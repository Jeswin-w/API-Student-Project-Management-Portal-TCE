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
app.use(express.static('css'));

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

app.get('/course', (req, res)=>{
	var cdept =req.query.cdept;
	var course_id=req.query.cid;
	

	req.session.course_id=course_id;
	req.session.cdept=cdept;
	console.log(req.session);
	
	res.sendFile(`${__dirname}/courses.html`)
})
app.get('/enroll',(req, res)=>{
	var dept=req.query.dept;
	var course_id=req.query.course_id;
	var regno=req.session.regno;
	console.log(req.session);
	console.log(course_id);
	console.log(dept);
	let qr=`select * from enrollment where course_id = ${course_id} AND regno='${regno}'`
	db.query(qr,(err, resu)=>{
		if (resu.length>0)
		{
			res.write(`<script>window.alert('Already registered!!!');window.location.href = 'enroll.html';</script>`);
		}
		else{
			let q=`insert into enrollment (regno,course_id,dept) values('${regno}',${course_id},${dept})`;
			db.query(q,(err,result)=>{
		if (err) {
			throw err;
		}
		console.log("inserted");
		res.redirect('/enroll.html');
	})
		}

	})
	


})
app.get('/enroll.html',(req, res)=>{
	if(req.session.loggedin==false || req.session.regno==''){
		res.redirect("/login.html");
	}
	else{
	res.sendFile(`${__dirname}/enroll.html`)
	}
})
app.get('/ecourse',(req, res)=>{
	
	var ecourse;
	var regno=req.session.regno;
	
	db.query(`Select * from enrollments WHERE regno = '${regno}'`,(err,result)=>{
		ecourse=result;
	})

res.send(ecourse);
	
})

app.get('/dashboard.html',(req,res)=>{
	console.log(req.session)
	if(req.session.loggedin==false || req.session.regno==''){
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
	var dept=req.body.dept;
	
	
	let qr1=`SELECT regno FROM student WHERE regno=('${regno}')`;
    db.query(qr1,(err,result)=>{
		if(result.length!=0){
			res.write(`<script>window.alert('regno already exists!!!!!!');window.location.href = 'register.html';</script>`)
		}
		else{
					const passwordHash = bcrypt.hashSync(password, 10);
					
					let qr = `INSERT into student(name,mail,regno,password,dept) values('${name}','${email}','${regno}','${passwordHash}','${dept}')`;
    db.query(qr,(err,result)=>{
        if(err){
            console.log(err);
        }
		req.session.loggedin = true;
		req.session.email = email;
		req.session.regno= results.regno;
		res.redirect('/dashboard.html');
				});
			
			
    
		}
	})
    
})
app.get('/logout', (req, res)=>{
	req.session.loggedin=false;
	req.session.email="";
	req.session.regno="";
	res.redirect('/login.html');
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
						req.session.regno= results[0].regno;
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




