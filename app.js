// Add VAT to the input number.
const addVAT = input => input + (input * 0.2);

// Price calculator
const etsyForm = document.querySelector('#etsySellPriceForm');
const spreadsheetPrice = document.querySelector('#spreadsheetPrice');
const etsyPostageInput = document.querySelector('#shippingPrice');
const sellPrice = document.querySelector('#sellPrice');
const feeContainer = document.querySelector('#feeContainer');

// Modal
const modalContainer = document.querySelector('.modal');
const modalBackground = document.querySelector('.modal-background');
const modalShowBtn = document.querySelector('#modalShowBtn');
const modalCloseBtn = document.querySelector('.modal-close');

etsyForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const spreadsheetPriceValue = parseInt(spreadsheetPrice.value);
    const etsyPostage = parseInt(etsyPostageInput.value);
    const one = calcFees(spreadsheetPriceValue, spreadsheetPriceValue, etsyPostage, true);
    const two = calcFees(one[0], spreadsheetPriceValue, etsyPostage, false);
    sellPrice.value = two[0].toFixed(2);

    feeContainer.innerHTML = '';
    for (let fee in two[1]) {
        if (fee === 'transaction' || fee === 'total') {
            const feeShort = two[1][fee]().toFixed(2);
            const newTD = document.createElement('td');
            newTD.append(`£${feeShort}`);
            feeContainer.append(newTD);
        } else {
            const feeShort = two[1][fee].toFixed(2);
            const newTD = document.createElement('td');
            newTD.append(`£${feeShort}`);
            feeContainer.append(newTD);
        }
    }
    copyContent();
})

const calcFees = (inputPrice, spreadsheetPrice = inputPrice, postagePrice = 2.85, isFirst = true) => {
    const etsyFees = {
        renew: addVAT(0.15),
        processing: addVAT(((inputPrice + postagePrice) * 0.04) + 0.20),
        regOp: addVAT(((inputPrice + postagePrice) * 0.0032)),
        transaction() {
            if (isFirst) {
                return addVAT(((inputPrice) * 0.065))
            } else {
                return addVAT(((inputPrice + postagePrice) * 0.065))
            }
        },
        postage: addVAT((postagePrice * 0.065)),
        total() {
            let total = 0;
            for (key in etsyFees) {
                if (typeof etsyFees[key] === 'number') {
                    total += etsyFees[key];
                } else if (key === 'transaction') {
                    total += etsyFees[key]();
                }
            }
            return total
        }
    }
    return [spreadsheetPrice + etsyFees.total(), etsyFees];
}

// Copy Etsy sell price
const copyContent = async () => {
    try {
        await navigator.clipboard.writeText(sellPrice.value);
        console.log('Content copied to clipboard');
    } catch (err) {
        console.error('Failed to copy: ', err);
    }
}

// Modal functionality
modalShowBtn.addEventListener('click', () => {
    modalContainer.classList.add('is-active');
})

modalBackground.addEventListener('click', () => {
    modalContainer.classList.remove('is-active');
})

modalCloseBtn.addEventListener('click', () => {
    modalContainer.classList.remove('is-active');
})

document.addEventListener("keyup", (e) => {
    if (e.code === 'Escape') {
        modalContainer.classList.remove('is-active');
    }
});