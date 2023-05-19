const express = require('express')
const userModule = require('../../module/userModule')
const md5 = require('md5')
const router = express.Router()
router.get('/login', (req, res) => {
    res.render('auth/login')
})
router.get('/reg', (req, res) => {
    res.render('auth/reg')
})
router.post('/reg', (req, res) => {
    userModule.create({
        ...req.body,
        password: md5(req.body.password)
    }).then(value => {
        console.log(value)
        res.render('success', { msg: '注册成功', url: '/login' })
    }).catch(error => {
        console.log(error)
        res.render('fail', { msg: '注册失败', url: '/reg' })
    })
})
router.post('/login', (req, res) => {
    userModule.findOne({
        username: req.body.username,
        password: md5(req.body.password)
    }).then(value => {
        if (!value) {
            throw new Error('用户名或密码错误')
        }
        console.log(value)
        req.session.username = value.username
        req.session._id = value._id
        res.render('success', { msg: `登录成功 ${value.username}`, url: '/account' })
    }).catch(error => {
        console.log(error)
        res.render('fail', { msg: `登录失败, ${error.message}`, url: '/login' })
    })
})
router.post('/logout', (req, res) => {
    const username = req.session.username
    req.session.destroy(() => {
        res.render('success', { msg: `登出成功 ${username}`, url: '/login' })
    })
})
module.exports = router