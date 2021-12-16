const express = require('express');
const sql = require('mysql2');
const bp = require('body-parser');
var session = require('express-session');
const bcrypt = require('bcrypt');
const multer = require('multer');
const app = express();
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
    destination: function(req, file, cb) {
        cb(null, 'sub')
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)

        var file = uniqueSuffix + '.' + path.extname(file.originalname)

        cb(null, file)
    }
})
app.post('/cfstatus', (req, res)=>{
    var id= req.body.subid;
    var status=req.body.cfstatus;
    
    let q=`Update ssub set cf_status='${status}' where subid='${id}'`;
    db.query(q, (err,result)=>{
        if (err) throw err;

        res.redirect(`/viewsubmissions.html`)
    })
})
app.post('/gstatus', (req, res)=>{
    var id= req.body.subid;
    var status=req.body.guidestatus;
    
    let q=`Update ssub set guide_status='${status}' where subid='${id}'`;
    db.query(q, (err,result)=>{
        if (err) throw err;

        res.redirect(`/viewteamsub.html`)
    })
})

var upload = multer({ storage: storage });

app.post('/upl', upload.single('filer'), function(req, res) {
    //console.log(req.session)

    const file = req.file
    if (!file) {
        res.write(`<script>window.alert('Upload file');window.location.href = 'filesub.html';</script>`);
    }

    let q = `Insert into ssub (team_id,sid,originalfile,file) values('${req.session.team_id}','${req.session.sid}','${file.originalname}','${file.filename}')`
    db.query(q, (err, result) => {
        if (err)
            throw (err)
        console.log('Insert')
        res.redirect(`/course.html?cid=${req.session.course_id}&cdept=${req.session.cdept}&cou_name=${req.session.course_name}`)
    })
});


const db = sql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'spmp',
    port: '3306'
});
db.connect((err) => {
    if (err) {
        console.log('Db connection error', err);
    }
});
app.listen(3100, () => {
    console.log("Server listening to port 3100!!!!")

})

app.get('/dashboard', (req, res) => {
    var obj;
    var email = req.session.email;
    db.query(`SELECT * FROM student WHERE mail = '${email}'`, (err, result) => {
        obj = result;
        res.send(obj);
        res.end();
    })

})
app.get('/teamdetails.html', (req, res) => {

    res.sendFile(`${__dirname}/teamdetails.html`);
})
app.post('/teamdetails', (req, res) => {
    var teamname = req.body.team_name;
    var guide = req.body.guide.substring(7);
    var tm1 = req.body.t1.substring(7);
    var tm2 = req.body.t2.substring(7);
    var tm3 = req.body.t3.substring(7);
    var tm4 = req.body.t4.substring(7);
    if (tm1 != tm2 & tm2 != tm3 & tm3 != tm4 & tm1 != tm3 & tm2 != tm4) {
        var tm = `${tm1},${tm2},${tm3},${tm4}`;
        tma = tm.split(',')
        let q = `insert into team (team_members,course_id,team_name,fid,cdept) values('${tm}','${req.session.course_id}','${teamname}','${guide}','${req.session.cdept}')`;
        db.query(q, (err, result) => {
            if (err) throw err;
            for (let i = 0; i < tma.length; i++) {
                let q1 = `Update enrollment SET team_status=1 where regno='${tma[i]}' and dept='${req.session.cdept}' and course_id='${req.session.course_id}'`

                db.query(q1, (err, result) => {
                    if (err) throw err;
                })
            }
        })
    } else { res.write(`<script>window.alert('Invalid input');window.location.href = 'teamdetails.html';</script>`); }
    res.redirect('/teamdetails.html')
})
app.get('/teamrem', (req, res) => {
    var course_id = req.session.course_id;
    var cdept = req.session.cdept;
    var rem;
    if ((course_id != undefined && cdept != undefined) || (course_id != '' && cdept != '')) {
        let q = `Select count(*) from enrollment where course_id='${course_id}' and dept='${cdept}' and team_status='0'`;
        db.query(q, (err, result) => {
            if (err) throw err;

            rem = result[0]['count(*)'];

            res.send(result);
        })
    }
})
app.get('/guidelist', (req, res) => {
    let q = `select fid,fname from faculty_advisor`;
    db.query(q, (err, result) => {
        if (err) throw err;
        res.send(result);
    })
})
app.get('/guideteams',(req, res)=>{
    let q=`select * from team inner join project on team.team_id=project.team_id where team.fid = '${req.session.fid}' and team.course_id='${req.session.course_id}' and team.cdept='${req.session.cdept}'`;
    db.query(q, (err, result) => {
        if (err) throw err;
        res.send(result);
        
    })
})
app.get('/fcourse.html', (req, res)=>{
    req.session.course_id=req.query.cid;
    req.session.cdept=req.query.cdept;
    // console.log(req.session)
    res.sendFile(`${__dirname}/fcourse.html`)
})
app.get('/reglist', (req, res) => {
    let q = `SELECT s.regno, s.name FROM student as s inner join enrollment as e on s.regno = e.regno where e.team_status=0 and e.course_id='${req.session.course_id}' and e.dept='${req.session.cdept}'`;
    db.query(q, (err, result) => {
        if (err) throw err;
        // console.log(result);
        if (err) throw err;
        res.send(result);
    });
});


var arr = [];


app.get('/course.html', (req, res) => {
    if(req.query.cid == null)
    {
        var cdept = req.query.cdept;
        var course_id = req.query.course_id;
        var course_name = req.query.course_name;

        req.session.course_id = course_id;
        req.session.cdept = cdept;
        req.session.course_name = course_name;

    }
    else
    {
        var course_name = req.session.course_name;
        var cdept = req.session.cdept;
        var course_id = req.session.course_id;
    }
   
    var regno = req.session.regno;
    req.session.sid = undefined;

   

    arr = [cdept, course_id, course_name];
    // console.log(arr)
    let q = `Select * from team where  course_id='${course_id}' and cdept='${cdept}' and team_members LIKE '%${regno}%' `
    db.query(q, (err, result) => {

        if (err) {
            throw err;
        }
        if (result.length > 0) {
            var tid = result[0].team_id;
            var team = result[0].team_members.split(',');
            req.session.team_id = tid;
            arr = [...arr, team, tid]

            let qr1 = `Select * from project where team_id='${result[0].team_id}'`;
            db.query(qr1, (err, result1) => {
                if (result1.length > 0) {
                    // console.log(result1);
                    arr = [...arr, result1[0].project_name, result1[0].project_desc]

                    res.sendFile(`${__dirname}/course.html`)
                } else {

                    res.sendFile(`${__dirname}/addproject.html`)
                }
            })
        } 
        else {
            res.redirect("/alert");
        } 
    })
});

app.get('/alert', (req, res) =>{
    res.sendFile(`${__dirname}/alert.html`);
})
app.get('/chartbatch',(req, res)=>{
    let q=`select batch,count(*) from project group by batch`;
    db.query(q,(err, result)=>{
        let q1=`select t.cdept,count(*) from project p inner join team t on p.team_id=t.team_id group by t.cdept`;
        db.query(q1,(err,result1)=>{
            var re=[]
            for( var i=0;i<result.length;i++){
                var t={c:[{v: result[i]['batch']},{v:result[i]['count(*)']},]};
                re.push(t)
            }
            
            var re1=[];
            for( var i=0;i<result1.length;i++){
                var t1={c:[{v: result1[i]['cdept']},{v:result1[i]['count(*)']},]};
                re1.push(t1)
            }

            arr3=[re,re1]
            res.send(arr3)
        })

    })
})
app.get('/changepass.html', (req, res) =>{
    res.sendFile(`${__dirname}/changepassword.html`);
})
app.post('/changepass', (req, res)=>{
    var oldpass = req.body.oldpassword;
    var newpass = req.body.newpassword1;
    var newpass1 = req.body.newpassword2;
    var email = req.session.email;
    console.log(email)
    console.log(newpass)
    console.log(newpass1)
    console.log(oldpass)
    if(newpass1 == newpass)
    {
        let qr = `SELECT password from faculty_advisor WHERE mail='${email}'`
        db.query(qr, (err, result)=>{
            if(err) throw err;
            
            var hash = result[0]['password'];
            console.log(hash)
            if(bcrypt.compareSync(oldpass, hash))
            {
                let q = `UPDATE faculty_advisor SET password='${bcrypt.hashSync(newpass,10)}' WHERE mail='${email}'`
                db.query(q, (err, result)=>{
                    if(err) throw err;
                    res.write(`<script>window.alert('Password Changed!'); window.location.href = '/fdashboard.html'</script>`);
                })
            }
            else
            {
                res.write(`<script>window.alert('Incorrect Password!'); window.location.href = '/changepass.html'</script>`);
            }
        })
    }
    else{
        res.redirect('/password.html');
    }
    
});
app.get('/password.html', (req, res)=>{
    res.sendFile(`${__dirname}/password.html`)
})
app.get('/filesubdet',(req, res) => {
    let q = `select * from add_submission where sid='${req.session.sid}'`
    db.query(q,(err, results) => {
        if(err) throw err;
        res.send(results)
    })
})
app.get('/filesub.html', (req, res) => {
    if(req.query.sid!=null){
    var sid = req.query.sid;
    //console.log(sid);
    req.session.sid = sid;}
    //console.log(req.session)
    res.sendFile(`${__dirname}/filesub.html`)

})
app.get('/teamsub',(req, res)=>{
    var team_id=req.session.team_id;
    // console.log(req.session);
    let q=`select ss.*,asub.sub_title,asub.sub_desc,asub.due_date from ssub ss inner join add_submission asub on ss.sid=asub.sid where ss.team_id='${team_id}' and asub.course_id='${req.session.course_id}' and asub.cdept='${req.session.cdept}'`;
    db.query(q, (err, result)=>{
        if(err) throw err;
        res.send(result);
    })
})
app.get('/viewteamsub.html',(req, res)=>{
    if(req.query.tid!=null){
        
        req.session.team_id=req.query.tid;}
        res.sendFile(`${__dirname}/viewteamsub.html`);

})
app.get('/send', (req, res) => {
    res.send(arr);
})

app.get('/enroll', (req, res) => {
    var dept = req.query.dept;
    var course_id = req.query.course_id;
    var regno = req.session.regno;
    var course_name = req.query.course_name;

    req.session.course_id = course_id;
    req.session.cdept = dept;
    req.session.course_name = course_name;

    let qr = `select * from enrollment where course_id = ${course_id} AND regno='${regno}'`
    db.query(qr, (err, resu) => {
        if (resu.length > 0) {
            res.write(`<script>window.alert('Already registered!!!');window.location.href = 'enroll.html';</script>`);
        } else {
            let q = `insert into enrollment (regno,course_id,dept) values('${regno}',${course_id},${dept})`;
            db.query(q, (err, result) => {
                if (err) {
                    throw err;
                }
                console.log("inserted");
                res.redirect('/course.html');
            })
        }

    })
})
app.get('/cfcourse.html', (req, res) => {
    var course_id = req.query.cid;
    var cdept = req.query.cdept;
    req.session.sid='';
    if (req.session.loggedin == false || req.session.fid == '') {
        res.redirect("/flogin.html");
    } else {
        req.session.course_id = course_id;
        req.session.cdept = cdept;

        res.sendFile(`${__dirname}/cfcourse.html`)
    }

})
app.get('/f', (req, res) => {
    res.sendFile(`${__dirname}/file.html`)
})
app.get('/enroll.html', (req, res) => {
    if (req.session.loggedin == false || req.session.regno == '') {
        res.redirect("/login.html");
    } else {
        res.sendFile(`${__dirname}/enroll.html`)
    }
})
app.get('/ecourse', async(req, res) => {

    var regno = req.session.regno;

    var q = `Select distinct * from enrollment as e inner join course as c on e.course_id=c.course_id inner join faculty_advisor as cf on c.fid=cf.fid WHERE e.regno = '${regno}'`;
    db.query(q, (err, result) => {

        res.send(result);

        res.end()
    })
})
app.get('/addproject.html', (req, res) => {

    if (req.session.loggedin == false) {
        res.redirect("/login.html");
    } else { res.sendFile(`${__dirname}/addproject.html`) }

})
app.post('/addproject', (req, res) => {
    if (req.session.loggedin == false) {
        res.redirect("/login.html");
    }
    var title = req.body.project_name;
    var dom = req.body.project_domain;
    var pro_desc = req.body.project_desc;
    var tid = req.session.team_id;
    var regno= req.session.regno;
    var year=parseInt('20'+regno.substring(0,2));
    var endyear=year+4;
    var batch=year+"-"+endyear;

    let q = `Insert into project (project_name,team_id,project_desc,domain,batch) values ('${title}','${tid}','${pro_desc}','${dom}','${batch}')`
    db.query(q, (err, results) => {
        if (err) throw err;
    })
    res.redirect('/dashboard.html')

})
app.get('/addsubmission.html', (req, res) => {

    if (req.session.loggedin == false) {
        res.redirect("/login.html");
    } else { res.sendFile(`${__dirname}/addsubmission.html`) }

})

app.get('/dashboard.html', (req, res) => {
    req.session.course_id = "";
    req.session.cdept = "";
    if (!req.session.loggedin) {
        res.redirect("/login.html");
    } else { res.sendFile(`${__dirname}/dashboard.html`) }

})
app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/index.html`)
})
app.get('/register.html', (req, res) => {
    res.sendFile(`${__dirname}/register.html`);
})
app.get('/login.html', (req, res) => {
    res.sendFile(`${__dirname}/login.html`);
})
app.get('/flogin.html', (req, res) => {
    res.sendFile(`${__dirname}/flogin.html`);
})
var sub = [];
var ssub = [];
app.get('/submissions', (req, res) => {
    var course_id = req.session.course_id;
    var cdept = req.session.cdept;
    var tid = req.session.team_id;
    let q = `Select * from add_submission where course_id='${course_id}' and cdept='${cdept}'`;
    db.query(q, async function(err, result) {
        sub = result
       
        let q1 = `select * from ssub where team_id='${tid}'`
        db.query(q1, async(err, result1) => {
            if (err) { throw (err) }
            ssub = result1
            for (let i = 0; i < result.length; i++) {
                var datetime=result[i].due_date.toISOString().slice(0, 10).replace('T', ' ');
                
                result[i].due_date = datetime;
                result[i]['sub_status'] = ''
                for (let j = 0; j < result1.length; j++) {
                    if (result[i].sid == result1[j].sid) {
                        result[i]['sub_status'] = 'submitted'

                    }
                }
            }
            res.send(result)


        })
    })
})

app.get('/viewsubmissions.html',(req, res)=>{
    if(req.query.sid!=null){
    req.session.sid=req.query.sid;}
    res.sendFile(`${__dirname}/viewsubmissions.html`);
})
app.post('/addsubmission', (req, res) => {

    var course_id = req.session.course_id;
    var cdept = req.session.cdept;

    var ptitle = req.body.project_title;
    var pdesc = req.body.project_desc;
    var pdue = req.body.project_due;
    let q = `Insert into add_submission (sub_title,sub_desc,due_date,course_id,cdept) values('${ptitle}','${pdesc}','${pdue}','${course_id}','${cdept}')`;
    db.query(q, (err, result) => {
        if (err) {

            throw (err)
        }
        console.log("inserted");
        res.redirect('/fdashboard.html')
    })

})

app.post('/register', (req, res) => {


    var name = req.body.name;
    var email = req.body.email;
    var regno = req.body.regno;
    var password = req.body.password;
    var dept = req.body.dept;

    
    let qr1 = `SELECT regno FROM student WHERE regno=('${regno}')`;
    db.query(qr1, (err, result) => {
        if (result.length != 0) {
            res.write(`<script>window.alert('regno already exists!!!!!!');window.location.href = 'register.html';</script>`)
        } else {
            const passwordHash = bcrypt.hashSync(password, 10);

            let qr = `INSERT into student(name,mail,regno,password,dept) values('${name}','${email}','${regno}','${passwordHash}','${dept}')`;
            db.query(qr, (err, result) => {
                if (err) {
                    console.log(err);
                }

                req.session.loggedin = true;
                req.session.email = email;
                req.session.regno = regno;
                res.redirect('/dashboard.html');
            });



        }
    })

}) 
app.get('/logout', (req, res) => {
    req.session.loggedin = false;
    req.session.email = "";
    req.session.regno = "";
    res.redirect('/');
})
 app.post('/login', (req, res) => {

    req.session.loggedin = false;
    var email = req.body.email;

    var password = req.body.password;


    if (email && password) {
        db.query(`SELECT * FROM student WHERE mail = '${email}' `, function(error, results) {
            if (results.length > 0) {
                var hash = results[0].password;


                const passwordHash = bcrypt.hashSync(password, 10);

                const verified = bcrypt.compareSync(password, hash);

                if (verified) {

                    req.session.loggedin = true;
                    req.session.email = email;
                    req.session.regno = results[0].regno;
                    res.redirect('/dashboard.html');
                } else {
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
app.post('/flogin', (req, res) => {

    req.session.loggedin = false;
    var email = req.body.email;

    var password = req.body.password;


    if (email && password) {
        db.query(`SELECT * FROM faculty_advisor WHERE mail = '${email}' `, function(error, results) {
            if (results.length > 0) {
                var hash=results[0].password;
                const passwordHash = bcrypt.hashSync(password, 10);
                const verified = bcrypt.compareSync(password, hash);
             

                if (verified) {

                    req.session.loggedin = true;
                    req.session.email = email;
                    req.session.fid = results[0].fid;
                    res.redirect('/fdashboard.html');
                } else {
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


app.get('/vsub',(req, res)=>{
    
    var fid= req.session.fid;
    var sid=req.session.sid;
    var total;
    var s;
    var rem;
    var course_id=req.session.course_id;
        var cdept = req.session.cdept;
    let q=`select ssub.*,team.team_name,team.team_members from ssub inner join team on ssub.team_id = team.team_id where sid = '${sid}'`
    db.query(q,(err,result)=>{
        
            let q1=`select * from team where course_id='${course_id}'and cdept='${cdept}'`;
            db.query(q1,(err,result1)=>{
                console.log(result1)
                 total=result1.length;
                 s=result.length;
                rem=total-result.length;

                var array=[s,rem,result]
                res.send(array);

            })
           
       
        
    })


})
app.get('/download1',(req, res)=>{
    var filen=req.query.filen;
    res.download(`${__dirname }/sub/${filen}`)
})
app.get('/flogout', (req, res) => {
    req.session.loggedin = false;
    req.session.email = "";
    req.session.regno = "";
    res.redirect('/');
}) 
app.get('/fcourses', (req, res) => {
    var fid = req.session.fid;
    if (fid != null) {
        var q1 = `select distinct * from course where fid='${fid}'`;
        db.query(q1, (err, result) => {

            res.send(result);
        })
    }

}) 
app.get('/fcourses1', (req, res) => {
    var fid = req.session.fid;
    if (fid != null) {
        var q1 = `select dept from faculty_advisor where fid='${fid}'`;
        db.query(q1, (err, result) => {
            var dept = result[0].dept;
            var q2 = `select * from course  where cdept='${dept}'`;
            db.query(q2, (err, result1) => {

                res.send(result1);
            })
        })
    }


})

app.get('/fdashboard', (req, res) => {
    var obj;
    var email = req.session.email;
    db.query(`SELECT * FROM  faculty_advisor WHERE mail = '${email}'`, (err, result) => {
        obj = result;
        res.send(obj);
        res.end();
    })

})

app.get('/fdashboard.html', (req, res) => {
    if (req.session.loggedin == true) {
        req.session.course_id = '';
        req.session.cdept = '';

        res.sendFile(`${__dirname}/fdashboard.html`)
    } else {
        res.redirect('/flogin.html');
    }
})

app.get('/existingprojects.html', (req, res) => {
    res.sendFile(`${__dirname}/existingprojects.html`)
})

app.get('/projectList', (req, res) => {
    let q = `SELECT p.* , t.team_id, t.team_members, t.team_name, t.course_id, t.cdept, fa.fname FROM project as p INNER JOIN team as t ON t.team_id = p.team_id INNER JOIN faculty_advisor as fa ON t.fid = fa.fid`;
    db.query(q, (err, result) => {
        //console.log(result);
        if (err) throw err;
        res.send(result);
    });
});