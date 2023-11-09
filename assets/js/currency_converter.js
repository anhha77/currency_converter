const BASE_URL = "https://v6.exchangerate-api.com/v6/";
const API_KEY = "8f43fcc97f1d23c2191ed43e";
const baseCode = document.querySelector("#base-code");
const targetCode = document.querySelector("#target-code");
let errorMsg = document.querySelector("#error-message");
let supportCodesList = [];
let currencyRate = 0;
const baseUnit = document.querySelector("#base-unit");
const targetRate = document.querySelector("#target-rate");
const baseAmount = document.querySelector("#base-amount");
const targetAmount = document.querySelector("#target-amount");

// Get support code

const supportCodes = async () => {
    try {
        let response = await fetch(`${BASE_URL}${API_KEY}/codes`);
        if (response.ok) {
            let data = await response.json();
            // console.log(data["supported_codes"]);
            return data["supported_codes"]
        }
        return []
    } catch (error) {
        console.log(error.message);
        return []
    }
};

// Get conversion rate
const conversionRate = async (code1, code2) => {
    try {
        let response = await fetch(`${BASE_URL}${API_KEY}/pair/${code1}/${code2}`);
        if (response.ok) {
            data = await response.json();
            const rate = data["conversion_rate"];
            let baseCurrency = supportCodesList.find((item) => item[0] === code1);
            let targetCurrency = supportCodesList.find((item) => item[0] === code2);
            baseUnit.textContent = `1 ${baseCurrency[1]} equals`;
            targetRate.textContent = `${rate} ${targetCurrency[1]}`
            return rate
        }
        return 0
    } catch (error) {
        console.log(error.message);
        return 0
    }
}

// Create options

const initialize = async () => {
    errorMsg.textContent = "Loading data...";
    supportCodesList = await supportCodes();
    errorMsg.textContent = "";
    if (supportCodesList.length === 0) {
        errorMsg.textContent = "No supported codes";
        return 0 
    }
    supportCodesList.forEach((item) => {
        const optionBaseCode = document.createElement("option");
        optionBaseCode.value = item[0];
        optionBaseCode.textContent = item[1];
        baseCode.appendChild(optionBaseCode);

        const optionTargetCode = document.createElement("option");
        optionTargetCode.value = item[0];
        optionTargetCode.textContent = item[1];
        targetCode.appendChild(optionTargetCode);
    });
    baseCode.value = "VND";
    targetCode.value = "USD";
    currencyRate = await conversionRate(baseCode.value, targetCode.value);
    // console.log(currencyRate);
    
};

initialize();

// Listen to the select tag
baseCode.addEventListener("change", async () => {
    errorMsg.textContent = "Loading data...";
    currencyRate = await conversionRate(baseCode.value, targetCode.value);
    errorMsg.textContent = "";
    baseAmount.value = "";
    targetAmount.value = "";
});

targetCode.addEventListener("change", async () => {
    errorMsg.textContent = "Loading data...";
    currencyRate = await conversionRate(baseCode.value, targetCode.value);
    errorMsg.textContent = "";
    baseAmount.value = "";
    targetAmount.value = "";
});

// Listen to input tag
baseAmount.addEventListener("input", async () => {
    targetAmount.value = `${Math.round(parseFloat(baseAmount.value) * currencyRate * 10**6)/10**6}`;
});

targetAmount.addEventListener("input", async () => {
    baseAmount.value = `${Math.round(parseFloat(targetAmount.value) / currencyRate * 10**6)/10**6}`;
})

