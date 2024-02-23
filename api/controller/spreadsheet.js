const { JWT } = require('google-auth-library')
const {GoogleSpreadsheet} = require('google-spreadsheet')

const SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive.file',
]

const saContent = JSON.parse(process.env.sa)
const jwt = new JWT({
    email: saContent.client_email,
    key: saContent.private_key,
    scopes: SCOPES,
  });

const gspreadsheet = new GoogleSpreadsheet(process.env.spreadsheetId, jwt);


exports.getAllCategoriesName = async (req, res, next) => {
    console.log("retrieve all categories from spreadsheet")
    await gspreadsheet.loadInfo()
    const billsSheet = gspreadsheet.sheetsByIndex[0]
    console.log('[INFO] Loaded doc: %s on first sheet: %s', gspreadsheet.title, billsSheet.title)
    await billsSheet.loadCells('A4:A69')
    console.log('[DEBUG] find category cells and set values: %s', billsSheet.cellStats)
    const rows = await billsSheet.getCellsInRange('A4:A69')
    console.log(rows)
    res.status(200).send(rows)
}
  