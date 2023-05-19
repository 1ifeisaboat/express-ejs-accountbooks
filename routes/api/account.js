var express = require('express');
const accountModule = require('../../module/accountModule');
const moment = require('moment');
const { expressjwt } = require('express-jwt');
const { secret } = require('../../../project/config/config')

var router = express.Router();

router.use(expressjwt({
  secret,
  algorithms: ['HS256']
}).unless({ path: /^\/api\/[/reg|/login]/ }))

router.get('/account', (req, res) => {
  accountModule.find().sort({ time: -1 }).then(value => {
    if (value.length === 0) {
      throw new Error('用户列表为空')
    }
    console.log(req.auth)
    res.json({
      code: '0000',
      msg: '获取用户列表成功',
      data: {
        list: value,
        Authorization: req.auth
      }
    })
  }).catch(error => {
    console.log(error)
    res.json({
      code: '1001',
      msg: error.message,
      data: null
    })
  })
})

router.post('/account', (req, res) => {
  accountModule.create({
    ...req.body,
    time: moment(req.body.time, moment.defaultFormatUtc).toDate()
  }).then(value => {
    console.log(value)
    res.json({
      code: '0000',
      msg: '添加成功',
      data: value
    })
  }).catch(error => {
    console.log(error)
    res.json({
      code: '1002',
      msg: error.message,
      data: null
    })
  })
})

router.delete('/account/:id', (req, res) => {
  accountModule.deleteOne({
    _id: req.params.id
  }).then(value => {
    console.log(value)
    if (value.deletedCount !== 1) {
      throw new Error('id不存在')
    }
    res.json({
      code: '0000',
      msg: '删除成功',
      data: value
    })
  }).catch(error => {
    console.log(error)
    res.json({
      code: '1003',
      msg: error.message,
      data: null
    })
  })
})

router.patch('/account/:id', (req, res) => {
  accountModule.updateOne({
    _id: req.params.id
  }, {
    $set: req.body
  }).then(value => {
    if (value.modifiedCount === 0) {
      throw new Error('不能与原值一致')
    }
    console.log(value)
    res.json({
      code: '0000',
      msg: '更新成功',
      data: value
    })
  }).catch(error => {
    console.log(error)
    res.json({
      code: '1004',
      msg: error.message,
      data: null
    })
  })
})

router.get('/account/:id', (req, res) => {
  accountModule.findById(req.params.id).then(value => {
    console.log(value)
    res.json({
      code: '0000',
      msg: '查询成功',
      data: value
    })
  }).catch(error => {
    console.log(error)
    res.json({
      code: '1005',
      msg: error.message,
      data: null
    })
  })
})

router.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.json({
      code: '1006',
      msg: err.message,
      data: null
    })
  }
  res.json({
    code: '1007',
    msg: err.message,
    data: null
  })
})

module.exports = router;
