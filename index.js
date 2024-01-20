const express=require('express');
const urlRoute=require('./routes/url');
const path=require('path');
const {connectToMongo}=require('./connect');
const URL=require('./models/url');
const staticRoute=require('./routes/staticRouter');
const app=express();
const PORT=8080;
connectToMongo('mongodb+srv://vijayendhergatla21:oVJ8omfDL4jiwktX@cluster0.zk6ci0t.mongodb.net/?retryWrites=true&w=majority')
.then(()=>console.log('Connected to DB'));

app.set('view engine','ejs');
app.set('views',path.resolve('./views'));

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use('/',staticRoute);
app.use("/url",urlRoute);
app.get('/url/:shortId',async(req,res)=>{
    const shortId=req.params.shortId;
    const entry=await URL.findOneAndUpdate({
        shortId,
    },
    {$push:{
        visitHistory:{
            timestamp:Date.now(),

        },
        },
    }
    )
    res.redirect(entry.redirectURL);

});

app.listen(PORT,()=>console.log(`Sever started at ${PORT}`));
