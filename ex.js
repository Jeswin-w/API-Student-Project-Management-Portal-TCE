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

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
	  cb(null, 'sub')
	},
	filename: function (req, file, cb) {
	  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
	  console.log(file.originalname);
		var file= uniqueSuffix+'.'+path.extname(file.originalname)
		console.log(file)
	  cb(null,file )
	}
  })
  
 
var upload = multer({ storage: storage });

app.get('/upl', upload.single('filer'), function (req, res) {
	var sid=req.query.sid;
	const file = req.file
	if (!file) {
	  res.write(`<script>window.alert('Upload file');window.location.href = 'course.html';</script>`);
	}
	let q=`Insert into ssub (team_id,sid,)`
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
	var regno=req.session.regno;
	
	req.session.course_id=course_id;
	req.session.cdept=cdept;
	console.log(req.session)
	arr = [cdept, course_id, course_name];
	
	let q=`Select * from team where  course_id='${course_id}' and cdept='${cdept}' and team_members LIKE '%${regno}%' `
	db.query(q, (err,result)=>{
		
		if(err){
			throw err;
		}
		if(result.length>0){
			var tid=result[0].team_id;
		var team=result[0].team_members.split(',');
		
		arr=[...arr,team,tid]
		
		let qr1=`Select * from project where team_id='${result[0].team_id}'`;
		db.query(qr1, (err,result1)=>{
			if(result.length>0){
				
				arr=[...arr,result1[0].project_name,result1[0].project_desc]
				
				res.sendFile(`${__dirname}/course.html`)}
			
			else{

				res.sendFile(`${__dirname}/addproject.html?team=${result[0].team_id}`)
			}
		})
	}

		
		else{
			res.send('No team registered');
		}
	})
	
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
app.get('/cfcourse.html',(req, res)=>{
	var course_id=req.query.cid;
	var cdept=req.query.cdept;
	if(req.session.loggedin==false || req.session.fid==''){
		res.redirect("/flogin.html");
	}
	else{
		req.session.course_id=course_id;
		req.session.cdept=cdept;
		
	res.sendFile(`${__dirname}/cfcourse.html`)
	}

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
	
	var q=`Select * from enrollment as e inner join course as c on e.course_id=c.course_id inner join faculty_advisor as cf on c.fid=cf.fid WHERE e.regno = '${regno}'`;
	db.query(q,(err,result)=>{
		
		res.send(result);
		
		res.end()
	})
})
app.get('/addproject.html',(req,res)=>{
	
	if(req.session.loggedin==false){
		res.redirect("/login.html");
	}
	else{res.sendFile(`${__dirname}/addproject.html`)}
	
})
app.get('/addsubmission.html',(req,res)=>{
	
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
app.get('/submissions',(req,res)=>{
	
	
		var course_id = req.session.course_id;
		var cdept=req.session.cdept;
		let q=`Select * from add_submission where course_id='${course_id}' and cdept='${cdept}'`;
		db.query(q,function(err,result){
			for(let i=0;i<result.length;i++){
				if(result[i]!=undefined){ 

					var datetime=result[i].due_date.toISOString().slice(0, 19).replace('T', ' ');
					var dt=datetime.split(' ');
					result[i].date=dt[0];
					
					let date_ob = new Date();
					if(date_ob>result[i].due_date){
						result[i].sub_status='Overdue';
					}
					else{
						var diffDays = parseInt((result[i].due_date-date_ob) / (1000 * 60 * 60 * 24)); 
						console.log(diffDays)
						if(diffDays==1){
						result[i].sub_status=`${diffDays} day more`;	}	
						else{
							result[i].sub_status=`${diffDays} day more`;	}
						}	
			}
		}
		console.log(result)
			res.send(result);
	})
	
})
app.post('/addsubmission',(req,res)=>{
	
	var course_id=req.session.course_id;
	var cdept =req.session.cdept;
	
	var ptitle=req.body.project_title;
	var pdesc=req.body.project_desc;
	var pdue=req.body.project_due;
	let q=`Insert into add_submission (sub_title,sub_desc,due_date,course_id,cdept) values('${ptitle}','${pdesc}','${pdue}','${course_id}','${cdept}')`;
	db.query(q,(err,result)=>{
		if (err){
			
			throw(err)
		}
		console.log("inserted");
		res.redirect('/fdashboard.html')
	})

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
		req.session.regno= regno;
		res.redirect('/dashboard.html');
				});
			
			
    
		}
	})
    
})
app.get('/logout', (req, res)=>{
	req.session.loggedin=false;
	req.session.email="";
	req.session.regno="";
	res.redirect('/');
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
				//  var hash=results[0].password;
				 
				 
				//  const passwordHash = bcrypt.hashSync(password, 10);
				 
				//  const verified = bcrypt.compareSync(password, hash);
				 var verified=true;
					 
					 if (verified){
						 
						 req.session.loggedin = true;
						 req.session.email = email;
						 req.session.fid= results[0].fid;
						 res.redirect('/fdashboard.html');
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
 app.get('/flogout', (req, res)=>{
	req.session.loggedin=false;
	req.session.email="";
	req.session.regno="";
	res.redirect('/');
})
 app.get('/fcourses',(req, res)=>{
	var fid=req.session.fid;
	if(fid!=null){
	var q1=`select * from course where fid='${fid}'`;
	db.query(q1,(err,result)=>{
		
		res.send(result);
	})
	}

})
app.get('/fcourses1',(req, res)=>{
	var fid=req.session.fid;
	if(fid!=null){
	var q1=`select dept from faculty_advisor where fid='${fid}'`;
	db.query(q1,(err,result)=>{
		var dept=result[0].dept;
		var q2=`select * from course where cdept='${dept}'`;
		db.query(q2,(err,result1)=>{
			
			res.send(result1);
		})
	})}


})

app.get('/fdashboard',(req, res)=>{
	var obj;
	var email=req.session.email;
	db.query(`SELECT * FROM  faculty_advisor WHERE mail = '${email}'`,(err,result)=>{
		obj=result;
		res.send(obj);
		res.end();
	})
	
})

app.get('/fdashboard.html',(req, res)=>
{
	if(req.session.loggedin==true){
		req.session.course_id='';
		req.session.cdept='';
		
	res.sendFile(`${__dirname}/fdashboard.html`)
	}
	else{
		res.redirect('/flogin.html');
	}
})
