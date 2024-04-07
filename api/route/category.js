const express = require('express')
const router = express.Router()

const firestoreController = require('../controller/firestore')
const spreadsheetController = require('../controller/spreadsheet')

router.get('/categories', spreadsheetController.getAllCategoriesName)
router.get('/categories/mapping', firestoreController.getCategoriesMap)

router.post('/categories', firestoreController.createCategoryMap)

module.exports = router;