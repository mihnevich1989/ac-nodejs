const { Router } = require('express')
const router = Router();

router.get('/', (req, res) => {
    res.render('lit', {
        title: 'Проект: Литейка',
        isLit: true
    })
})

module.exports = router