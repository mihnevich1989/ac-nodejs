const { Router } = require('express');
const router = Router();
const ListActions = require('../models/listActionsModel');


router.delete('/remove/:id', async (req, res) => {
    const base = req.baseUrl.slice(1, 4).toUpperCase()
    const allActions = await ListActions.remove(req.params.id, `noCoverList${base}`)
    res.status(200).json(allActions)
})

router.get('/update', async (req, res) => {
    const base = req.baseUrl.slice(1, 4).toUpperCase()
    if (base === "MZK" || base === "LIT") {
        await ListActions.checkCover('apiPostman', `actions${base}`, `noCover${base}`)
    } else if (base === "MES") {
        await ListActions.checkCoverMES(`controllers${base}`, 'apiPostman', `actions${base}`, `noCover${base}`)
    }

    await ListActions.update(`noCover${base}`, `noCoverList${base}`)
    res.redirect(`${req.baseUrl}`)
})

router.get('/', async (req, res) => {
    const base = req.baseUrl.slice(1, 4).toUpperCase()
    const allNoCoverApi = await ListActions.getAllActions(`noCover${base}`),
        allApiBase = await ListActions.getAllActions(`actions${base}`),
        allApiUpdateList = await ListActions.getAllActions(`noCoverList${base}`),
        percent = Math.floor((allApiUpdateList.length * 100) / allApiBase.length)
    res.render('checkCover', {
        title: `Проект: ${base} - проверка actions`,
        isCheckCover: true,
        allNoCoverApi,
        allApiBase,
        percent,
        allApiUpdateList
    })
})




module.exports = router
