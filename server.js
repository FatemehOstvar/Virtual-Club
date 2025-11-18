const express= require('express')
const app = express()
require('dotenv').config()

const port = process.env.PORT || 3010
const {memberRouter}= require('./routers/members')

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/',memberRouter)

app.listen(port, () => {
    console.log(`Server listening on port http://localhost:${port}`)
})
