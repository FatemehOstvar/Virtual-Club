const express= require('express')
const session = require('express-session');
const passport = require('passport')
const app = express()
require('dotenv').config()
require('./config/passport')(passport);
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 1000 * 60 * 60* 24 * 1000  },
})); //app.use(passport.authenticate('session'));

const expressLayouts = require("express-ejs-layouts");
app.use(expressLayouts);
app.set("layout", "layout");

app.use(passport.initialize())
app.use(passport.session())
const port = process.env.PORT || 3010

const {spectatorRouter} = require('./routers/spectators');
const {adminRouter} = require('./routers/admin');
const {userRouter} = require('./routers/members');

const {join} = require("node:path");
app.set('view engine', 'ejs')

const assetsPath = join(__dirname, "public");
app.use(express.static('public'))
app.use(express.static(assetsPath));
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use((req,res,next)=>{
    res.locals.err = null;
    res.locals.messages = null;
    res.locals.roleName = null;
    res.locals.role = null;
    res.locals.pageCss = null;
    next()
})
app.use('/admin', adminRouter)
app.use('/user', userRouter)
app.use('/',spectatorRouter)
app.listen(port, () => {
    console.log(`Server listening on port http://localhost:${port}`)
})