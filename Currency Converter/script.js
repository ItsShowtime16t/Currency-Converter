let apikey = "ee923b6463187862fc89bf5f"

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("button");
const fromCurr = document.querySelector(".from select")
const toCurr = document.querySelector(".to select")
const msg = document.querySelector(".msg")
const swapBtn = document.querySelector(".dropdown i");

const Main_URL= `https://v6.exchangerate-api.com/v6/${apikey}/latest/`;

countryList = {AUD: "AU",BGN: "BG",BRL: "BR",CAD: "CA",CHF: "CH",CNY: "CN",CZK: "CZ",DKK: "DK",EUR: "FR",GBP: "GB",HKD: "HK",HRK: "HR",HUF: "HU",IDR: "ID",ILS: "IL",INR: "IN",ISK: "IS",JPY: "JP",KRW: "KR",MXN: "MX",MYR: "MY",NOK: "NO",NZD: "NZ",PHP: "PH",PLN: "PL",RON: "RO",RUB: "RU",SEK: "SE",SGD: "SG",THB: "TH",TRY: "TR",USD: "US",ZAR: "ZA"};


for (let select of dropdowns) {
    for (currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;

        if(select.name === "From" && currCode === "USD") {
            newOption.selected = true;
        } else if (select.name === "To" && currCode === "INR") {
            newOption.selected = true;
        }
        select.append(newOption);
    }

    select.addEventListener("change", (event) => {
        updateFlag(event.target);
    });
}

const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];

    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;

    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
}

swapBtn.addEventListener("click", () => {
    const tempCurr = fromCurr.value;
    fromCurr.value = toCurr.value;
    toCurr.value = tempCurr;
    
    updateFlag(fromCurr);
    updateFlag(toCurr);
    
    updateExchangeRate();
});

const updateExchangeRate = async () => {
    try {
        msg.innerText = "Converting...";
        btn.disabled = true;

        let amount = document.querySelector(".amount input")
        let amtVal = amount.value;

        if(amtVal == "" || amtVal <= 0) {
            amtVal = 1;
            amount.value = "1";
        }
        
        const URL = `${Main_URL}/${fromCurr.value}`;
        let response = await fetch(URL);

        let data = await response.json();
        let rate = data.conversion_rates[toCurr.value];
        let finalAmnt = amtVal * rate;

        msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmnt} ${toCurr.value}`;
    } catch (error) {
        msg.innerText = "Error occurred while fetching exchange rates!";
        console.error(error);
    } finally {
        btn.disabled = false;
    }
}

btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
});

window.addEventListener("load", () => {
    updateExchangeRate();
});
