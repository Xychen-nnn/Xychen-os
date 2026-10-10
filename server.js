require('dotenv').config();
const path=require('path'),express=require('express');
const {initDb}=require('./src/database'),{notFound,errorHandler}=require('./src/middleware/errors');

const app=express();
const PORT=Number(process.env.PORT||3000);

app.set('trust proxy',1);
initDb();
app.disable('x-powered-by');
app.use(express.json({limit:'100kb'}));
app.use(express.urlencoded({extended:false,limit:'100kb'}));

app.use('/api',require('./src/routes/health'));
app.use('/api/site',require('./src/routes/site'));
app.use('/api/announcements',require('./src/routes/announcements'));
app.use('/api/reports',require('./src/routes/reports'));
app.use('/api/requests',require('./src/routes/requests'));
app.use('/api/support',require('./src/routes/support'));

app.use(express.static(path.join(__dirname,'public'),{extensions:['html']}));
app.use('/api',(req,res)=>res.status(404).json({error:'Not found'}));
app.use(notFound);
app.use(errorHandler);

if(!process.env.VERCEL){
  app.listen(PORT,'0.0.0.0',()=>console.log(`Xychen OS listening on http://localhost:${PORT}`));
}

module.exports=app;
