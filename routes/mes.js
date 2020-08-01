const { Router } = require('express')
const router = Router();

router.get('/', (req, res) => {
    res.render('mes', {
        title: 'Проект: МЭС',
        isMes: true
    })
})

module.exports = router