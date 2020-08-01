const { Router } = require('express')
const router = Router();
const UpdateDataBase = require('../models/connectPostgresModel')

router.get('/', (req, res) => {
    res.render('home', {
        title: 'Главная страница',
        isHome: true
    })
})

router.get('/update-mzk', async (req, res) => {
    if (res.ok) {
        await UpdateDataBase.updateMzk()
    }
})
router.get('/update-lit', async (req, res) => {
    if (res.ok) {
        await UpdateDataBase.updateLit()
    }
})

module.exports = router