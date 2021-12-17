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
const bodyparser = require('body-parser')
const fs = require('fs');
const readXlsxFile = require('read-excel-file/node');
const mysql = require('mysql')



app.use(bp.json());
app.use(bp.urlencoded({ extended: false }));
app.use(express.static('images'));
app.use(express.static('scripts'));
app.use(express.static('css'));
app.use(express.static('sub'));

app.use(express.static("./public"))

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({
extended: true
}))
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

app.get('/', (req, res)=>{
    res.sendFile(`${__dirname}/adminlogin.html`)
})

app.post('/adminlogin', (req, res) => {
    req.session.loggedin = false;
    var email = req.body.email;
    var password = req.body.password;

    console.log(email)
    console.log(password)

    if (email && password) {
        db.query(`SELECT * FROM admin WHERE mail = '${email}' `, function(error, results) {
            if (results.length > 0) {
                var hash=results[0].password;
                const passwordHash = bcrypt.hashSync(password, 10);
                const verified = bcrypt.compareSync(password, hash);
             

                if (verified) {

                    req.session.loggedin = true;
                    req.session.email = email;
                    req.session.id = results[0].id;
                    res.redirect('/admin.html');
                } else {
                    res.write(`<script>window.alert('Enter the correct password!!!!!');window.location.href = '/';</script>`);
                }

            } else {

                res.write(`<script>window.alert('Enter the correct email!!!!!');window.location.href = '/';</script>`)
            }
            res.end();
        });
    } else {
        res.write(`<script>window.alert('Enter  password and email!!!!!!');window.location.href = '/';</script>`)
    }
});

app.get('/admin.html', (req, res) => {
    if (req.session.loggedin == true) {  
        res.sendFile(`${__dirname}/admin.html`)
    } else {
        res.redirect('/');
    }
})

app.get('/logout', (req, res) => {
    req.session.loggedin = false;
    req.session.email = "";
    res.redirect('/');
})

app.get('/admindashboard', (req, res) => {
    var obj;
    var email = req.session.email;
    db.query(`SELECT * FROM  admin WHERE mail = '${email}'`, (err, result) => {
        obj = result;
        console.log(obj)
        res.send(obj);
        res.end();
    })
})

app.get('/enroll.html', (req, res) =>{
    res.sendFile(`${__dirname}/enrollment.html`);
})


app.post('/enroll.html',(req, res)=>{
    var regno = req.body.regno;
    var course_id= req.body.course_id;
    var dept = req.body.coursedepartment;
    

	
    
    let qr = `INSERT into enrollment(regno,course_id,dept) values('${regno}','${course_id}','${dept}')`;
    
    db.query(qr,(err,result)=>{
        if(err){
            console.log(err);
        }
        res.write(`<script>window.alert('Inserted!'); window.location.href = 'enroll.html';</script>`)

        
    })
	

})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
    cb(null, __dirname + '/importFiles/')
    },
    filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
    }
    });

const upload = multer({storage: storage});
app.post('/uploadfile', upload.single("uploadfile"), (req, res) =>{
    importExcelData2MySQL(__dirname  + '/importFiles/' + req.file.filename);
    
    console.log(res);
    res.write(`<script>window.alert('Inserted!'); window.location.href = 'enroll.html';</script>`)
});

function importExcelData2MySQL(filePath){
    // File path.
    readXlsxFile(filePath).then((rows) => {
    // `rows` is an array of rows
    // each row being an array of cells.     
    console.log(rows);
    /**
    [ [ 'Id', 'Name', 'Address', 'Age' ],
    [ 1, 'john Smith', 'London', 25 ],
    [ 2, 'Ahman Johnson', 'New York', 26 ]
    */
    // Remove Header ROW
    rows.shift();
    // Open the MySQL connection
    db.connect((error) => {
    if (error) {
    console.error(error);
    } else {
    let query = 'INSERT INTO enrollment(regno, course_id, dept) VALUES ?';
    db.query(query, [rows], (error, response) => {
    if(error) throw error;
    
    console.log(error || response);
    /**
    OkPacket {
    fieldCount: 0,
    affectedRows: 5,
    insertId: 0,
    serverStatus: 2,
    warningCount: 0,
    message: '&Records: 5  Duplicates: 0  Warnings: 0',
    protocol41: true,
    changedRows: 0 } 
    */
    });
    }
    });
    })
    }
