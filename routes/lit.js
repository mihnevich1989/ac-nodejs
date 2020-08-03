const { Router } = require('express');
const ListActions = require('../models/listActionsModel');
const fs = require('fs');
const path = require('path');
const router = Router();

router.get('/', async (req, res) => {
    const allApiPostman = await ListActions.getAllActions('apiPostman')
    const noCover = await ListActions.getAllActions('noCoverLit')
    const allApiBase = await ListActions.getAllActions('actionsLit')
    const allApiUpdateList = await ListActions.getAllActions('noCoverListLit')
    const cover = allApiBase.length - noCover.length
    const percent = {
        noCover: Math.round((noCover.length * 100) / allApiBase.length),
        noCoverEdit: Math.round((allApiUpdateList.length * 100) / allApiBase.length),
        cover: Math.round((cover * 100) / allApiBase.length)
    }
    res.render('lit', {
        title: 'Проект: ЛМ',
        isLit: true,
        allApiPostman,
        allApiUpdateList,
        allApiBase,
        percent,
        noCover,
        cover
    })
})
router.post('/', async (req, res) => {
    const api = await (req.body.api).split(',');
    fs.writeFile(path.join(__dirname, '..', 'data', 'apiPostman.json'), JSON.stringify(api), err => {
        if (err) throw err
    })
    res.redirect('/lit/check-cover')
})

module.exports = router