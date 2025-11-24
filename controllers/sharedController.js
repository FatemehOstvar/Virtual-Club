const passport = require('passport')
require('../config/passport')(passport);

function viewLogIn(req, res, next) {
    res.render('login');
}

async function logOut(req, res, next) {
  req.logout((err)=>{
  if(err){
      return next(err);
  }
  res.redirect('login');
  });
}


async function logIn(req, res, next) {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.render('login',{err: info?.message|| 'Login failed'});
        }
        req.logIn(user, (err)=>{
            if (err) return next(err);
            if(req.user.role ===  'admin'){
            res.redirect(`/admin/messages`);
            }
            else if(req.user.role === 'user'){
            res.redirect(`/user/messages`);
            }
            else if(req.user.role === 'spectator'){
            res.redirect(`/messages`);
            }
            else{
                res.redirect('/login');
            }
        })

    })(req, res, next)

}

module.exports = {logOut,viewLogIn,logIn}