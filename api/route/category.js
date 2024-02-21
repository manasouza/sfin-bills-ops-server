const express = require('express')
const router = express.Router()

const firestoreController = require('../controller/firestore')

router.get('/categories', firestoreController.getAllCategoriesName)
router.get('/categories/mapping', firestoreController.getCategoriesMap)

router.post('/categories', function(req, res, next) {
    console.log("create new category")
})

module.exports = router;