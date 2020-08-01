const { Router } = require('express');
const router = Router();
const ListActions = require('../models/listActionsModel');


router.delete('/remove/:id', async (req, res) => {
    const allActions = await ListActions.remove(req.params.id, `noCoverListMZK`)
    res.status(200).json(allActions)
})

router.get('/update', async (req, res) => {
    await ListActions.checkCover('apiPostman', 'actionsMZK', 'noCoverMZK')
    await ListActions.update("noCoverMZK", 'noCoverListMZK')
    res.redirect('/mzk/check-cover')
})

router.get('/', async (req, res) => {
    const allNoCoverApi = await ListActions.getAllActions('noCoverMZK'),
        allApiBase = await ListActions.getAllActions('actionsMZK'),
        allApiUpdateList = await ListActions.getAllActions('noCoverListMZK'),
        percent = Math.floor((allApiUpdateList.length * 100) / allApiBase.length)
    res.render('checkCover', {
        title: 'Проект: МЗК - проверка actions',
        isCheckCover: true,
        allNoCoverApi,
        allApiBase,
        percent,
        allApiUpdateList
    })
})




module.exports = router
