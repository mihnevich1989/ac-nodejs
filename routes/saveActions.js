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
router.delete('/:id/edit/delete/:lid', async (req, res) => {
    let allActions = await ListActions.getAllActions('list')
    allActions = allActions.filter(c => c.list_id !== req.params.lid)
    fs.writeFile(path.join(__dirname, '..', 'data', `list.json`), JSON.stringify(allActions), err => {
        if (err) {
            return res.status(500)
        }
        return res.status(200).json(allActions)
    })
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
        list = actions.find(c => c.list_id === req.params.id),
        noCover = await ListActions.getAllActions(`noCover${list.base}`),
        allApiBase = await ListActions.getAllActions(`actions${list.base}`),
        cover = allApiBase.length - list.actions.length;

    res.render('saveActions-edit', {
        title: `Редактирование ${list.list_name}`,
        list,
        allApiBase,
        cover,
        noCover
    })
})

router.post('/', async (req, res) => {
    const baseName = await (req.body.base_name);
    const listName = await (req.body.name_list),
        saveActionList = await ListActions.getAllActions(`noCoverList${baseName}`),
        date = ListActions.getDate(),
        list = await ListActions.getAllActions('list');
    list.push({ list_name: listName, date: date, base: baseName, list_id: uuid(), actions: saveActionList })
    fs.writeFile(path.join(__dirname, '..', 'data', 'list.json'), JSON.stringify(list), err => {
        if (err) throw err
    })
    res.redirect('/save-actions')
})

module.exports = router