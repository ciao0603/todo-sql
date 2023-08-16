module.exports = {
  authenticator: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    console.log('not auth')
    res.redirect('/users/login')
  }
}