const express=require(`express`);
const app=express();

const path= require(`path`);

const port= 8000;

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,'../Pages/home.html'))
});

app.listen(port,() =>
{
    console.log(`Server port running on '${port}'`);
})