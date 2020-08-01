const { Router } = require('express')
const fs = require('fs')
const path = require('path')
const router = Router()
const { v4: uuid } = require("uuid");
const ListActions = require('../models/listActionsModel');


router.delete('/:id/edit/remove/:lid', async (req, res) => {
    const actions = await ListActions.removeEditList('list', req.params.id, req.params.lid);
    res.status(200).json(actions)
})

router.get('/', async (req, res) => {
    const list = await ListActions.getAllActions('list')
    res.render('saveActions', {
        title: 'Сохраненные списки actions',
        isSave: true,
        list
    })
})

router.get('/:id/edit', async (req, res) => {
    const actions = await ListActions.getAllActions('list'),
        list = actions.find(c => c.list_id === req.params.id);

    res.render('saveActions-edit', {
        title: `Редактировать ${list.list_name}`,
        list
    })
})

router.post('/', async (req, res) => {
    const listName = await (req.body.name_list),
        saveActionList = await ListActions.getAllActions('noCoverListMZK'),
        date = ListActions.getDate(),
        list = await ListActions.getAllActions('list');
    list.push({ list_name: listName, date: date, list_id: uuid(), actions: saveActionList })
    fs.writeFile(path.join(__dirname, '..', 'data', 'list.json'), JSON.stringify(list), err => {
        if (err) throw err
    })
    res.redirect('/save-actions')
})

module.exports = router