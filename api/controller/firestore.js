const {Firestore} = require('@google-cloud/firestore')

const db = new Firestore({
    projectId: 'smartfinance-bills-beta',
    keyFilename: process.env.credentials,
})
// TODO: externalize config
const billsCategoryMap = db.collection('bills_config').doc('mapping')
const billsSettings = db.collection('bills_config').doc('settings')
const defaultColumnOffsets = {
    pix: 4,
    comprovante: 0,
}

exports.createCategoryMap = async (req, res, next) => {
    const data = req.body
    const convertedData = { [data.name]: data.value }
    console.log('[DEBUG] creating ' + JSON.stringify(convertedData))
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
exports.getSettings = async (req, res, next) => {
    const settingsDoc = await billsSettings.get()
    if (!settingsDoc.exists) {
        res.status(200).send({ columnOffsets: defaultColumnOffsets })
        return
    }

    res.status(200).send({
        columnOffsets: settingsDoc.get('columnOffsets') ?? defaultColumnOffsets
    })
}

exports.updateSettings = async (req, res, next) => {
    const columnOffsets = req.body.columnOffsets
    if (!columnOffsets) {
        res.status(400).send('columnOffsets must be provided')
        return
    }

    const settings = { columnOffsets: normalizeColumnOffsets(columnOffsets) }
    await billsSettings.set(settings, { merge: true })
    res.status(200).send(settings)
}

function normalizeColumnOffsets(columnOffsets) {
    return Object.fromEntries(
        Object.entries(columnOffsets)
            .map(([source, offset]) => [source.toLowerCase(), Number.parseInt(offset, 10)])
            .filter(([, offset]) => !Number.isNaN(offset))
    )
}
