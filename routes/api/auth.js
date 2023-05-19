const express = require('express')
const userModule = require('../../module/userModule')
const md5 = require('md5')
const jwt = require('jsonwebtoken')
const { secret } = require('../../../project/config/config')
const router = express.Router()

router.post('/reg', (req, res) => {
    userModule.create({
        ...req.body,
        password: md5(req.body.password)
    }).then(value => {
        console.log(value)
        res.json({
            code: '0000',
            msg: '注册成功',
            data: value
        })
    }).catch(error => {
        console.log(error)
        res.json({
            code: '2001',
            msg: error.message,
            data: null
        })
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
        const token = jwt.sign({
            username: value.username,
            _id: value._id
        }, secret, {
            expiresIn: 60 * 60 * 24 * 7
        })
        res.json({
            code: '0000',
            msg: `登录成功 ${value.username}`,
            token: `Bearer ${token}`
        })
    }).catch(error => {
        console.log(error)
        res.json({
            code: '2002',
            msg: error.message,
            data: null
        })
    })
})

module.exports = router