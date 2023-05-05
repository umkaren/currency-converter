//variables
const fromCurrency = document.getElementById('base-currency')
const targetCurrency = document.getElementById('target-currency')
const amountConverting = document.getElementById('amount')
const convertedAmount = document.getElementById('converted-amount')
const historicalConversion = document.getElementById('historicalConversion')
const historicalRateBtn = document.getElementById('historical-rates');
const saveBtn = document.getElementById('save-favorite')
const saveArea = document.getElementById('favorite-currency-pairs')
const fetchURL = `https://api.apilayer.com/exchangerates_data/latest?`

let myHeaders = new Headers();
myHeaders.append('apikey', '3rf87g8WNvIugg9BjHrwU81tkOWmauxC');

let requestOptions = {
method: 'GET',
redirect: 'follow',
headers: myHeaders
};

//function to fetch exchange rate and display the converted value
function getXchangeRates() {
  const fromCurrencyValue = fromCurrency.value;
  const targetCurrencyValue = targetCurrency.value;
  const amountConvertingValue = amountConverting.value;
  const url = `${fetchURL}symbols=${targetCurrencyValue}&base=${fromCurrencyValue}`
  
  if (amountConvertingValue <= 0 || isNaN(amountConvertingValue)) {
    alert('Please enter a valid amount.')
  } else if (fromCurrencyValue == targetCurrencyValue) {
    alert('This is the same currency. Please choose another currency to convert.')
  } else {
    fetch(url, requestOptions)
    .then(response => response.json())
    .then(result => {
      console.log(result.rates[targetCurrencyValue])
      const exchangeRate = result.rates[targetCurrencyValue]
    
      const conversionOutput = exchangeRate * amountConvertingValue
      convertedAmount.innerHTML = `${conversionOutput} ${targetCurrencyValue}`
  })
    .catch(error => {
      convertedAmount.innerHTML = ''
      alert('We ran into an issue getting the data. Please try again later.')
      console.log('error', error)})
  }
}

//event listeners
fromCurrency.addEventListener('change', getXchangeRates);
amountConverting.addEventListener('change', getXchangeRates);
targetCurrency.addEventListener('change', getXchangeRates);
historicalRateBtn.addEventListener('click', historicalRate);
saveBtn.addEventListener('click', saveFavorites);

//historical conversion
function historicalRate() {
  const base = fromCurrency.value;
  const symbol = targetCurrency.value;

  fetch(`https://api.apilayer.com/exchangerates_data/2022-01-01?symbols=${symbol}&base=${base}`, requestOptions)
    .then(response => response.json())
    .then(data => {

      const historicalXRate = data.rates; 
      const hConversion = Object.keys(historicalXRate)[0];

      historicalConversion.innerHTML = 'Historical exchange rate on 2022-01-01: 1 ' + base + ' = ' + historicalXRate[hConversion] + '' + symbol
    })
    .catch(error => {
      convertedAmount.innerHTML = ''
      alert('We ran into an issue getting the data. Please try again later.')
      console.log('error', error)})
}

//favorites
function saveFavorites() {
  const base = fromCurrency.value;
  const target = targetCurrency.value;

  if (base == target) {
    alert('Cannot save to favorite. Selection will not convert.')
  } else {

  //check if pair exists
  const pairs = JSON.parse(localStorage.getItem("favoritePairs")) || [];
  const pair = `${base}/${target}`;
  if (pairs.includes(pair)) {
    alert("This is already saved.");
    return;
  }

  pairs.push(pair);
  localStorage.setItem("favoritePairs", JSON.stringify(pairs));
  const html = pairs.map((p) => `<button class="favorite-pair">${p}</button>`).join("");
  saveArea.innerHTML = html;

  const favoritePairButtons = document.querySelectorAll(".favorite-pair");
  favoritePairButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const [selectedBase, selectedTarget] = button.textContent.split("/");
      fromCurrency.value = selectedBase;
      targetCurrency.value = selectedTarget;
      getXchangeRates();
    });
  });
}}

const savedPairs = document.querySelectorAll('#favorite-currency-pairs p');
savedPairs.forEach((pair) => {
  pair.addEventListener('click', () => {
    const [base, target] = pair.textContent.split('/');
    fromCurrency.value = base.trim();
    targetCurrency.value = target.trim();
    getXchangeRates();
  });
});