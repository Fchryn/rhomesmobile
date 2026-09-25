export const numberToCurrency = (number) => {
    if(!number){
        return `Rp 0`;
    }
    number = (typeof number === "string" ? parseInt(number) : number);
    return `Rp${new Intl.NumberFormat('de-DE').format(number)}`;
}

export const currencyToNumber = (currency) => {
    return Number(currency.replace(/\D/g, ""));
}

export const formatPhone = (phone) => {
    if(!phone){
        return phone;
    }
    if(`${phone.charAt(0)}` === "0"){
        return `+62${phone.substring(1)}`;
    }
    if(`${phone.charAt(0)}` === "+"){
        return phone;
    }
    return `+62${phone}`;
}

export const wrapTextBySize = (input, len) => {
    var curr = len;
    var prev = 0;
    const output = [];
    while (input[curr]) {
        if (input[curr++] == ' ') {
            output.push(input.substring(prev,curr));
            prev = curr;
            curr += len;
        }
    }
    output.push(input.substr(prev));  
    return output;
}