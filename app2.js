// Method
// - Get spreadsheet price
// - Add fees
// 
import { eval } from 'mathjs'
// Function that returns the percentage of a number. 
// e.g. getPercentageOf(50, 100) would return 50
const getPercentageOf = (inputPercentage, inputNumber) => (inputPercentage / 100) * inputNumber

// Function that adds VAT to the input number.
const addVAT = num => num + (num * 0.2)

// Function that rounds number to teo decimal places
const roundNum = num => {
    return Math.round((num + Number.EPSILON) * 100) / 100
}

const calculateFees = (spreadsheetPrice, postagePrice) => {
    const totalPrice = spreadsheetPrice + postagePrice
    const fees = {
        renewal: roundNum(addVAT(0.16)),
        processing: Math.round(addVAT(getPercentageOf(4, totalPrice) + 0.20)),
        transactionItem: roundNum(addVAT(getPercentageOf(6.5, spreadsheetPrice))),
        transactionPostage: roundNum(addVAT(getPercentageOf(6.5, postagePrice))),
        regOp: roundNum(addVAT(getPercentageOf(0.32, totalPrice))),
        total() {
            return roundNum(this.renewal + this.processing + this.transactionItem + this.transactionPostage + this.regOp)
        },
    }
    return fees
}

// Price calculator
const etsyForm = document.querySelector('#etsySellPriceForm')
const spreadsheetSellPriceInput = document.querySelector('#spreadsheetPrice')
const etsyShippingPriceInput = document.querySelector('#shippingPrice')
const sellPriceOutput = document.querySelector('#sellPrice')

// Modal
const modalContainer = document.querySelector('.modal')
const modalBackground = document.querySelector('.modal-background')
const feeContainer = document.querySelector('#feeContainer')
const modalShowBtn = document.querySelector('#modalShowBtn')
const modalCloseBtn = document.querySelector('.modal-close')

// Fees:
// ----------------------------------------------------------
// Renewal Fee: 0.16 + VAT
// Processing Fee: 4.0% of the order total plus £0.20 + VAT
// Transaction Fee (Item): 6.5% of item total + VAT
// Transaction Fee (Postage): 6.5% of postage total + VAT
// Regulatory Operating fee: 0.32% of the order total + VAT

etsyForm.addEventListener("input", (e) => {
    e.preventDefault()
    const sheetPrice = parseFloat(document.querySelector('#spreadsheetPrice').value)
    const shipPrice = parseFloat(document.querySelector('#shippingPrice').value)
    // const totalPrice = sheetPrice + shipPrice
    // if (sheetPrice && shipPrice) {
    //     fees.processing = parseFloat(roundNum(addVAT(getPercentageOf(4, totalPrice) + 0.20)))
    //     fees.transactionItem = parseFloat(roundNum(addVAT(getPercentageOf(6.5, sheetPrice))))
    //     fees.transactionPostage = parseFloat(roundNum(addVAT(getPercentageOf(6.5, shipPrice))))
    //     fees.regOp = parseFloat(roundNum(addVAT(getPercentageOf(0.32, totalPrice))))
    //     fees.total = parseFloat((fees.renewal + fees.processing + fees.transactionItem + fees.transactionPostage + fees.regOp).toFixed(2))
    //     sellPriceOutput.value = (sheetPrice + fees.total).toFixed(2)
    // }
    const one = calculateFees(sheetPrice, shipPrice)
    console.log(eval("2 + 3 * 4"))
})