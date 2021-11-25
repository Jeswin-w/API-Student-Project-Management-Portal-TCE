const express =require('express');
const sql =require('mysql2');
const bp = require('body-parser');

const app =express();

app.use(bp.json());
app.use(bp.urlencoded({ extended: false }));
app.use(express.static('images'));

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
    res.redirect('/dashboard');
})

