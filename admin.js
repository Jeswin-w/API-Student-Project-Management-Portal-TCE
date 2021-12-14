const express =require('express');
const sql =require('mysql2');
const bp = require('body-parser');
var session = require('express-session');
const bcrypt = require('bcrypt');
const multer = require('multer');
const app =express();
const path = require('path');
const { Console } = require('console');

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
app.listen(3200,()=>{
	console.log("Server listening to port 3200!!!!")

})
app.get('/editcourses.html',(req,res)=>{
    res.sendFile(`${__dirname}/editcourses.html`);
})
app.post('/editcourses.html',(req, res)=>{
    var coursename = req.body.coursename;
    var courseid = req.body.courseid;
    var facultyid = req.body.fid;
    var cdept = req.body.coursedepartment;
    
    let qr = `INSERT into course(course_id,fid,course_name,cdept) values('${courseid}','${facultyid}','${coursename}','${cdept}')`;
    db.query(qr,(err,result)=>{
        if(err){
            console.log(err);
        }
        res.redirect('/editcourses.html')
    })
	

})
app.get('/editfaculty.html',(req,res)=>{
    res.sendFile(`${__dirname}/editfaculty.html`);
})
app.get('/admin.html',(req,res)=>{
    res.sendFile(`${__dirname}/admin.html`)
})
app.post('/editfaculty.html',(req, res)=>{
    var fname = req.body.fname;
    var password = req.body.password;
    var fid = req.body.fid;
    var dept = req.body.coursedepartment;
	var mail = req.body.mail;
    
    let qr = `INSERT into faculty_advisor(fname,mail,fid,dept,password) values('${fname}','${mail}','${fid}','${dept}','${password}')`;
    db.query(qr,(err,result)=>{
        if(err){
            console.log(err);
        }
        res.redirect('/editfaculty.html')
    })
	

})
app.get('/coursedetail',async (req, res)=>{
	
	
	
	var q=`SELECT * from course`;
	db.query(q,(err,result)=>{
		console.log(result);
		res.send(result);
		
		res.end()
	})
})
app.get('/facultydetail',async (req, res)=>{
	
	
	
	var q=`SELECT * from faculty_advisor`;
	db.query(q,(err,result)=>{
		console.log(result);
		res.send(result);
		
		res.end()
	})
})
app.get('/editprojects.html',(req,res)=>{
    res.sendFile(`${__dirname}/editprojects.html`);
})
app.post('/editprojects.html',(req, res)=>{
    var project_id = req.body.project_id;
    var project_name = req.body.project_name;
    var team_id = req.body.team_id;
    var project_desc = req.body.project_desc;
	var domain = req.body.domain;
	
    
    let qr = `INSERT into project(project_id,project_name,team_id,project_desc,domain) values('${project_id}','${project_name}','${team_id}','${project_desc}','${domain}'')`;
    
    db.query(qr,(err,result)=>{
        if(err){
            console.log(err);
        }
        res.redirect('/editprojects.html')
    })
	

})
app.get('/projectdetail',async (req, res)=>{
	
	
	
	var q=`SELECT * from project`;
	db.query(q,(err,result)=>{
		console.log(result);
		res.send(result);
		
		res.end()
	})
})
