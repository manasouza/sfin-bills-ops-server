const express = require('express')
const router = express.Router()

router.get('/', function (req, res, next) {
    console.log("healthcheck")
    res.status(200).send({
        title: "Node Express API",
        version: "0.0.1"
    });
});

module.exports = router;