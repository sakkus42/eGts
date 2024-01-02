const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
};

function checkEmail() {
    const email = document.querySelector('#email1');

    if (!validateEmail(email.value)){
        document.querySelector('#emailErr').style.display = 'block';
    }else {
        document.querySelector('#emailErr').style.display = 'none';
    }
}


function cleanPhoneNumber(phoneNumber) {
    const cleaned = phoneNumber.replace(/\D/g, '');
    const withoutPrefix = cleaned.startsWith('90') ? cleaned.slice(2) : 
                            cleaned.startsWith('0') ? cleaned.slice(1) :
                            cleaned;
    return withoutPrefix;
}


function checkPhone(){
    const phoneregex = /^(\+90|0)?\s*(\(\d{3}\)[\s-]*\d{3}[\s-]*\d{2}[\s-]*\d{2}|\(\d{3}\)[\s-]*\d{3}[\s-]*\d{4}|\(\d{3}\)[\s-]*\d{7}|\d{3}[\s-]*\d{3}[\s-]*\d{4}|\d{3}[\s-]*\d{3}[\s-]*\d{2}[\s-]*\d{2})$/;
    const phone = document.querySelector('#phone');
    
    if (phone.value == ''){
        return;
    }
    if (!phoneregex.test(phone.value)){
        document.querySelector('#phoenErr').style.display = 'block';
    }else {
        phone.value = cleanPhoneNumber(phone.value);
        document.querySelector('#phoenErr').style.display = 'none';
    }
}

document.addEventListener("DOMContentLoaded", function() {
    var elements = document.getElementsByTagName("INPUT");
    for (var i = 0; i < elements.length; i++) {
        elements[i].oninvalid = function(e) {
            e.target.setCustomValidity("");
            if (!e.target.validity.valid) {
                e.target.setCustomValidity("Zorunlu Alan");
            }
        };
        elements[i].oninput = function(e) {
            e.target.setCustomValidity("");
        };
    }
})

function hideErrorMessageE() {
    const errorElement = document.getElementById('errorE');
    if (errorElement){
        errorElement.style.display = 'none';
    }
}

function hideErrorMessageP() {
    const errorElement = document.getElementById('errorP');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

setTimeout(hideErrorMessageE, 3000);
setTimeout(hideErrorMessageP, 3000);


