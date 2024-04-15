const express = require('express')
const router = express.Router()

const firestoreController = require('../controller/firestore')
const spreadsheetController = require('../controller/spreadsheet')
const pubsubController = require('../controller/pubsub')

router.get('/categories', spreadsheetController.getAllCategoriesName)
router.get('/categories/mapping', firestoreController.getCategoriesMap)
router.get('/categories/unmapped', pubsubController.getUncategorizedValues)

router.post('/categories', firestoreController.createCategoryMap)

module.exports = router;