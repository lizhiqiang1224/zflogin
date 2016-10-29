/**
 * Created by lizhiqiang on 2016/10/29.
 */
var express = require('express');
var app = express();

var path = require('path');
//设置模板引擎
app.set('view engine','html');
//指定模板存放目录，当res.render的第一个参数写的是此路径下面的子路径
app.set('views',path.resolve('views'));
//用EJS的语法渲染html的模板文件
app.engine('.html',require('ejs').__express);

//解析请求体
var bodyParser = require('body-parser');
//请求体处理中间件,把请求体转成对象放在req.body上
app.use(bodyParser.urlencoded({extended:true}));



var session = require('express-session');
app.use(session({
    resave:true, //每次客户端请求的时候重新保存session
    saveUninitialized:true, //保存未初始化的session
    secret:'zfpx' //加密cookie
}));

app.get('/login',function (req,res) {
    res.render('login');
});

app.post('/login',function(req,res){
    var user = req.body; //得到请求体
    console.log(user);
    if(user.username == user.password){//如果在表单中输入的用户名和密码相同，则登录成功
        //把用户名写入session
        req.session.username = user.username;
        req.session.password = user.password;
        //重定向到user页面
        res.redirect('/user');  // 请
    }else{
        res.redirect('back');
    }
});

function checkLogin(req,res,next){
    if(req.session.username){
        next();
    }else{
        res.redirect('/login');
    }
}

app.get('/user',checkLogin,function(req,res){
    res.render('user',{username:req.session.username})
});

app.listen(8080);