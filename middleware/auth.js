module.exports = {
  authenticator: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    req.flash('warning_msg', '需先登入才可使用。')
    res.redirect('/users/login')
  }
}