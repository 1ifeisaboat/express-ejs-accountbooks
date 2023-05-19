var express = require('express');
const accountModule = require('../../module/accountModule');
const moment = require('moment');

var router = express.Router();

router.get('/', (req, res,) => {
  res.redirect('/account');
})

router.get('/account', (req, res) => {
  accountModule.find().sort({ time: -1 }).then(value => {
    res.render('list', { accounts: value, moment, username: req.session.username })
  }).catch(error => {
    console.log(error)
    res.status(404).send('获取用户列表失败')
  })
})

router.get('/account/create', (req, res) => {
  res.render('create')
})

router.post('/account/create', (req, res) => {
  accountModule.create({
    ...req.body,
    time: moment(req.body.time, moment.defaultFormatUtc).toDate()
  }).then(value => {
    console.log(value)
    res.render('success', { msg: '添加成功', url: '/account' })
  }).catch(error => {
    console.log(error)
    res.render('fail', { msg: '添加失败', url: '/account/create' })
  })
})
router.post('/account/:id', (req, res) => {
  accountModule.deleteOne({
    _id: req.params.id
  }).then(value => {
    console.log(value)
    res.render('success', { msg: '删除成功', url: '/account' })
  }).catch(error => {
    console.log(error)
    res.render('fail', { msg: '删除失败', url: '/account' })
  })
})
module.exports = router;
