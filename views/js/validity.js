// login

document.getElementById('email').addEventListener('input', function () {
    this.setCustomValidity('');
});
  
document.getElementById('email').addEventListener('invalid', function () {
    if (this.value === '') {
        this.setCustomValidity('E-Posta adresi boş bırakılamaz.');
    } else {
        this.setCustomValidity('Geçerli bir E-Posta adresi giriniz.');
    }
});



document.getElementById('password').addEventListener('input', function () { 
    this.setCustomValidity(''); 
});

document.getElementById('password').addEventListener('invalid', function () {
    if (this.value === '') {
        this.setCustomValidity('Şifre boş bırakılamaz.');
    } else {
        this.setCustomValidity('Şifre en az 6 karakter uzunluğunda olmalıdır.');
    }
});

// register

document.getElementById('email1').addEventListener('input', function () {
    this.setCustomValidity('');
});
  
document.getElementById('email1').addEventListener('invalid', function () {
    if (this.value === '') {
        this.setCustomValidity('E-Posta adresi boş bırakılamaz.');
    } else {
        this.setCustomValidity('Geçerli bir E-Posta adresi giriniz.');
    }
});

document.getElementById('phone').addEventListener('input', function () {
    this.setCustomValidity('');
});
  
document.getElementById('phone').addEventListener('invalid', function () {
    if (this.value === '') {
        this.setCustomValidity('Telefon numarası boş bırakılamaz.');
    }
});

document.getElementById('name').addEventListener('input', function () {
    this.setCustomValidity('');
});
  
document.getElementById('name').addEventListener('invalid', function () {
    if (this.value === '') {
        this.setCustomValidity('İsim kısmı boş bırakılamaz.');
    }
});

document.getElementById('sirname').addEventListener('input', function () {
    this.setCustomValidity('');
});
  
document.getElementById('sirname').addEventListener('invalid', function () {
    if (this.value === '') {
        this.setCustomValidity('Soyisim kısmı boş bırakılamaz.');
    }
});


document.getElementById('sirname').addEventListener('input', function () {
    this.setCustomValidity('');
});
  
document.getElementById('sirname').addEventListener('invalid', function () {
    if (this.value === '') {
        this.setCustomValidity('Soyisim kısmı boş bırakılamaz.');
    }
});


document.getElementById('psw1').addEventListener('input', function () {
    this.setCustomValidity('');
});
  
document.getElementById('psw1').addEventListener('invalid', function () {
    if (this.value === '') {
        this.setCustomValidity('Bir şifre belirlemeniz gerekir.');
    }
});


function checkPsw (psw1, psw2, passwordError){
    var password1 = document.getElementById(psw1);
    var password2 = document.getElementById(psw2);
    var passwordError = document.getElementById(passwordError);
    
    function checkPasswordMatch() {
        if (password1.value !== password2.value) {
            passwordError.textContent = "Şifreler eşleşmiyor.";
            password2.setCustomValidity("Şifreler eşleşmiyor.");
        } else {
            passwordError.textContent = "";
            password2.setCustomValidity("");
        }
    }
    
    password1.addEventListener('input', checkPasswordMatch);
    password2.addEventListener('input', checkPasswordMatch);
}