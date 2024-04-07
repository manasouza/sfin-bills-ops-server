const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
const hcRoutes = require('./api/route/integration');
const categoryRoutes = require('./api/route/category');

app.use(cors())
app.use(bodyParser.json())
app.use("/", hcRoutes)
app.all("/categories", categoryRoutes)
app.all("/categories/mapping", categoryRoutes)

app.listen(3000, () => {
    console.log("API ready on port 3000")
})