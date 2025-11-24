const express= require('express')
const app = express()
require('dotenv').config()
const passport = require('passport')
require('./config/passport')(passport);
app.use(passport.initialize())
app.use(passport.session()); //app.use(passport.authenticate('session'));

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
    next()
})
app.use('/',spectatorRouter)
app.use('/admin', adminRouter)
app.use('/user', userRouter)
app.listen(port, () => {
    console.log(`Server listening on port http://localhost:${port}`)
})


