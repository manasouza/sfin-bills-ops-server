const {Firestore} = require('@google-cloud/firestore')

const db = new Firestore({
    projectId: 'smartfinance-bills-beta',
    keyFilename: process.env.credentials,
})
const billsCategoryMap = db.collection('bills_config').doc('mapping_test')

function replacer(key, value) {
    if (value instanceof Object) {
        return '[Socket/HTTPParser Object]'; // Placeholder representation
    } else {
        return value;
    }
}


exports.createCategoryMap = async (req, res, next) => {
    const data = req.body
    const convertedData = { [data.name]: data.value }
    console.log(`[DEBUG] creating ${convertedData}`)
    await billsCategoryMap.update(convertedData)
    res.status(201).send(convertedData)
}

exports.getCategoriesMap = async (req, res, next) => {
    const mappingDoc = await billsCategoryMap.get()
        .then((mappingDoc) => {
            console.log(mappingDoc.data())
            if (!mappingDoc.exists) {
                console.log('[ERROR] no mapping category found for bills')
                res.status(404).send("no mapping category found for bills")
            } else {
                let result = []
                new Map(Object.entries(mappingDoc.data())).forEach((v,k) => {
                    result.push({k,v})
                })
                console.log(result)
                // const newLocal = new Map(Object.entries(mappingDoc.data()));
                res.status(200).send(result)
            }
        })
        .catch((error) => {
            console.log(error);
        }) 
}

exports.getAllCategoriesName = async (req, res, next) => {
    console.log("retrieve all categories from db")
    const mappingDoc = await billsCategoryMap.get()
    if (!mappingDoc.exists) {
        console.log('[ERROR] no mapping category found for bills')
        res.status(404).send("no mapping category found for bills")
    } else {
        let uniqueList = new Set(Object.values(mappingDoc.data()).sort())
        console.log(uniqueList)
        res.status(200).send(Array.from(uniqueList))
    }
}