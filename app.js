function validation() {

    const checkValidation = (input) => {
        removeError(input);

        if (input.value !== "") {
            switch(input.name) {
                case "phone":
                    if (!validatePhone(input.value)) return renderError(input, 'Некорректный номер телефона');
                    break;
                case "email":
                    if (!validateEmail(input.value)) return renderError(input, 'Некорректная почта');
                    break;
                default: 
                    break;
            }
        }

        if (input.required && input.value === "") {
            return renderError(input, 'Заполните поле');
        }
    }

    const validateEmail = (value) => {
        const regExp = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        return regExp.test(String(value).toLowerCase()) ;
    }

    const validatePhone = (value) => {
        const regExp = /^[\d\+]{2}\ \([\d]{2,3}\)\ [\d]{2,3}-[\d]{2,3}-[\d]{2,3}$/;
        return regExp.test(String(value).toLowerCase());
    }

    const removeError = (input) => {
        const oldErrorEl = input.closest('[data-input-wrapper]').querySelector('[data-input-error]');
        if (oldErrorEl) oldErrorEl.remove();

        input.closest('[data-input-wrapper]')?.classList?.remove('not-valid');

    }

    const renderError = (input, message) => {
        input.closest('[data-input-wrapper]')?.classList?.add('not-valid');
        const errorEl = document.createElement('span');
        errorEl.className= 'input_wrapper__error';
        errorEl.dataset.inputError = "";
        errorEl.textContent = message;
        input.after(errorEl);

        return true;
    }

    return {
        checkValidation: checkValidation,
        removeError: removeError,
    }
}



const inputs = document.querySelectorAll('[data-input]');
const validator = validation();

document.querySelectorAll('[name="phone"]').forEach(el => {
    IMask(el, {
        mask: '+{7} (000) 000-00-00'
    });
})

inputs.forEach(input => {
    input.addEventListener('blur', _ => validator.checkValidation(input))
    input.addEventListener('focus', _ => validator.removeError(input))

})

document.addEventListener('submit', async e => {
    e.preventDefault();
    let isNotValidation = false;

    e.target.querySelectorAll('[data-input]').forEach(input => {
        if (validator.checkValidation(input)) isNotValidation = true;
    })

    if (isNotValidation) return;

    await fetch('/mailer', {
        method: "POST",
        body: new FormData(e.target)
    }).then(res => {
        return res.json();
    }).then( data => {
        //В случае успеха что-то делаем
        alert('success')
    })
    .catch(error => {
        //Или выводим ошибку
        alert(error);
    })
})