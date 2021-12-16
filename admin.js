const express =require('express');
const sql =require('mysql2');
const bp = require('body-parser');
var session = require('express-session');
const bcrypt = require('bcrypt');
const multer = require('multer');
const app =express();
const path = require('path');
const { Console } = require('console');
const nodemailer = require("nodemailer");
const { getMaxListeners } = require('process');
const { findSeries } = require('async');

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
    
    var msg = `<p>Respected Sir/Madam,<br>This is the notification about registration on TCE Project Management Portal. You are requested to change your password after successful login. <br><br> MAIL: ${mail} <br> PASSWORD: ${password} <br><br>Thank you<br><br>Regards,<br>TCE PROJECTS ADMIN.`
    
    let q = `SELECT fid FROM faculty_advisor WHERE fid=('${fid}')`
    db.query(q, (err, result)=>{
        if(err) throw err;
        if(result.length != 0)
        {
            res.write(`<script>window.alert('Faculty already exists!!'); window.location.href = 'admin.html';</script>`)
        }
        else{
            const passwordHash = bcrypt.hashSync(password, 10);
            let qr = `INSERT into faculty_advisor(fname,mail,fid,dept,password) values('${fname}','${mail}','${fid}','${dept}','${passwordHash}')`;
            db.query(qr,(err,result)=>{
                if(err){
                    console.log(err);
                }
                let transporter = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 465,
                    secure: true,
                    auth:{
                        user: "tceprojectportal@gmail.com",
                        pass: "tceit123"
                    },
                    tls:{
                        rejectUnauthorized: false
                    }
                });
                let mailoptions = {
                    from: '"ADMIN" <tceprojectportal@gmail.com>',
                    to: `${mail}`,
                    subject: "TCE PROJECTS PORTAL - Registration",
                    html: msg,
                }
                transporter.sendMail(mailoptions, (err, info)=>{
                    if(err)
                        throw err;
                    console.log("Message sent");
                    res.redirect('/editfaculty.html')
                })
            })
        }
    })
    //connection.release();
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
    var batch = req.body.batch;
    var project_name = req.body.project_name;
    var team_id = req.body.team_id;
    var project_desc = req.body.project_desc;
	var domain = req.body.domain;

	
    
    let qr = `INSERT into project(project_name,team_id,project_desc,domain,batch) values('${project_name}','${team_id}','${project_desc}','${domain}','${batch}')`;
    
    db.query(qr,(err,result)=>{
        if(err){
            console.log(err);
        }
        res.redirect('/editprojects.html')
    })
	

})
app.get('/projectdetail',async (req, res)=>{
	var q=`SELECT p.*,t.team_members from project p inner join team t on p.team_id=t.team_id`;
	db.query(q,(err,result)=>{
		console.log(result);
		res.send(result);
		
		res.end()
	})
})

// app.get('/', (req, res)={
//     res.sendFile(`${__dirname}/adminlogin.html`)
// })