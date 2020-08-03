const express = require('express')
const exhb = require('express-handlebars')
const homeRouter = require('./routes/home')
const mzkRouter = require('./routes/mzk')
const litRouter = require('./routes/lit')
const mesRouter = require('./routes/mes')
const saveRouter = require('./routes/saveActions')
const checkCover = require('./routes/checkCover')

const app = express()

const hbs = exhb.create({
    defaultLayout: 'main',
    extname: 'hbs'
})
app.engine('hbs', hbs.engine)
app.set('views', 'views')
app.set('view engine', 'hbs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.use('/', homeRouter)
app.use('/mzk', mzkRouter)
app.use('/lit', litRouter)
app.use('/mes', mesRouter)
app.use('/mzk/check-cover', checkCover)
app.use('/lit/check-cover', checkCover)
app.use('/mes/check-cover', checkCover)
app.use('/save-actions', saveRouter)

app.use(function (err, req, res) {
    console.error(err.stack);
    res.status(500).send('Что-то полшо не так, обновите страницу!');
});

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
    console.log(`Сервер запустился на порту: ${PORT}`);
})