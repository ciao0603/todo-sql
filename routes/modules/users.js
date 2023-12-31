const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')

const db = require('../../models')
const User = db.User

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []
  User.findOne({ where: { email } }).then(user => {
    if (user) {
      errors.push({ message: '這個Email已被註冊，請直接登入。' })
      return res.render('register', { errors, name, email, password, confirmPassword })
    }
    if (!name || !email || !password || !confirmPassword) {
      errors.push({ message: '所有欄位皆為必填。' })
    }
    if (password !== confirmPassword) {
      errors.push({ message: '密碼與確認密碼不相符。' })
    }
    if (errors.length) {
      return res.render('register', { errors, name, email, password, confirmPassword })
    }

    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(password, salt))
      .then(hash => User.create({
        name,
        email,
        password: hash
      }))
      .then(() => res.redirect('/'))
      .catch(err => console.log(err))
  })
})

router.get('/logout', (req, res) => {
  req.logOut()
  req.flash('success_msg', '你已成功登出。')
  res.redirect('/users/login')
})

module.exports = router