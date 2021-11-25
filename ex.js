const express =require('express');
const sql =require('mysql2');
const bp = require('body-parser');

const app =express();

app.use(bp.json());
app.use(bp.urlencoded({ extended: false }));
app.use(express.static('script'));

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
app.get('/projectportal',(req,res)=>{
	res.sendFile(`${__dirname}/index.html`);
})
