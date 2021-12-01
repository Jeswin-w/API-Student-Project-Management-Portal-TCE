const express =require('express');
const sql =require('mysql2');
const bp = require('body-parser');
var session = require('express-session');
const bcrypt = require('bcrypt');
const multer = require('multer');
const app =express();
const path = require('path');

app.use(bp.json());
app.use(bp.urlencoded({ extended: false }));
app.use(express.static('images'));
app.use(express.static('scripts'));
app.use(express.static('css'));
app.use(express.static('sub'));

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: false
}));

var storage = multer.diskStorage({
    destination: function (request, file, callback) {
        callback(null, 'sub');
    },
    filename: function (request, file, callback) {
        console.log(file);
        callback(null, file.originalname)
    }
});

var upload = multer({ storage: storage });

app.post('/upl', upload.single('filer'), function (req, res) {

    console.log(req.body) // form fields
    console.log(req.file) // form files
    res.status(204).end()
});

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
	console.log("Server listening to port 3100!!!!")

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
app.get('/team', (req, res)=>{
	res.sendFile(`${__dirname}/teamdetails.html`);
})

var arr = [];

app.get('/course.html',(req, res)=>{
	var cdept =req.query.cdept;
	var course_id=req.query.cid;
	var course_name = req.query.dept_name;
	arr = [cdept, course_id, course_name];
	console.log(arr);
	res.sendFile(`${__dirname}/course.html`)
});
app.get('/send', (req, res)=>{
	res.send(arr);
})

app.get('/enroll',(req, res)=>{
	var dept=req.query.dept;
	var course_id=req.query.course_id;
	var regno=req.session.regno;
	
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
app.get('/f',(req, res)=>{
	res.sendFile(`${__dirname}/file.html`)
})
app.get('/enroll.html',(req, res)=>{
	if(req.session.loggedin==false || req.session.regno==''){
		res.redirect("/login.html");
	}
	else{
	res.sendFile(`${__dirname}/enroll.html`)
	}
})
app.get('/ecourse',async (req, res)=>{
	
	var regno=req.session.regno;
	
	var q=`Select * from enrollment as e inner join course as c on e.course_id=c.course_id inner join course_faculty as cf on c.fid=cf.fid WHERE e.regno = '${regno}'`;
	db.query(q,(err,result)=>{
		res.send(result);
		console.log(result)
		res.end()
	})
})
app.get('/addproject.html',(req,res)=>{
	console.log(req.session)
	if(req.session.loggedin==false){
		res.redirect("/login.html");
	}
	else{res.sendFile(`${__dirname}/addproject.html`)}
	
})
app.get('/addsubmission.html',(req,res)=>{
	console.log(req.session)
	if(req.session.loggedin==false){
		res.redirect("/login.html");
	}
	else{res.sendFile(`${__dirname}/addsubmission.html`)}
	
})

app.get('/dashboard.html',(req,res)=>{
	req.session.course_id="";
	req.session.cdept="";
	if(!req.session.loggedin){
		res.redirect("/login.html");
	}
	else{res.sendFile(`${__dirname}/dashboard.html`)}
	
})
app.get('/',(req,res)=>{
    res.sendFile(`${__dirname}/index.html`)
})
app.get('/register.html',(req,res)=>{
    res.sendFile(`${__dirname}/register.html`);
})
app.get('/login.html',(req,res)=>{
    res.sendFile(`${__dirname}/login.html`);
})
app.get('/flogin.html',(req,res)=>{
    res.sendFile(`${__dirname}/flogin.html`);
})


app.post('/register',(req,res)=>{

    
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
				
				
				const passwordHash = bcrypt.hashSync(password, 10);
				
				const verified = bcrypt.compareSync(password, hash);
					
					if (verified){
						
						req.session.loggedin = true;
						req.session.email = email;
						req.session.regno= results[0].regno;
						res.redirect('/dashboard.html');
					}
					else{
						res.write(`<script>window.alert('Enter the correct password!!!!!');window.location.href = 'login.html';</script>`);
					}
				
				
			} else {
                
				res.write(`<script>window.alert('Enter the correct email!!!!!');window.location.href = 'login.html';</script>`)
			}			
			res.end();
		});
	} else {
		res.write(`<script>window.alert('Enter  password and email!!!!!!');window.location.href = 'login.html';</script>`)
		
	}
});
app.post('/flogin',(req,res)=>{

	req.session.loggedin=false;
	 var email = req.body.email;
	 
	 var password = req.body.password;
	 
	 
	 if (email && password) {
		 db.query(`SELECT * FROM faculty_advisor WHERE mail = '${email}' `, function(error, results) {
			 if (results.length > 0) {
				 var hash=results[0].password;
				 
				 
				 const passwordHash = bcrypt.hashSync(password, 10);
				 
				 const verified = bcrypt.compareSync(password, hash);
					 
					 if (verified){
						 
						 req.session.loggedin = true;
						 req.session.email = email;
						 req.session.fid= results[0].fid;
						 res.redirect('/dashboard.html');
					 }
					 else{
						 res.write(`<script>window.alert('Enter the correct password!!!!!');window.location.href = 'flogin.html';</script>`);
					 }
				 
				 
			 } else {
				 
				 res.write(`<script>window.alert('Enter the correct email!!!!!');window.location.href = 'flogin.html';</script>`)
			 }			
			 res.end();
		 });
	 } else {
		 res.write(`<script>window.alert('Enter  password and email!!!!!!');window.location.href = 'login.html';</script>`)		 
	 }
 });




