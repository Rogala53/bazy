export function validateInputAnimation(inputs) {
    inputs.forEach(({ input, button }) => {
        let inputElement = document.getElementById(input);
        let buttonElement = document.getElementById(button);
        if (buttonElement && inputElement) {
            buttonElement.addEventListener("click", function (e) {
              if (validateInput(inputElement, e));
            });
            inputElement.addEventListener("focusout", function () {
              focusOutOfInput(this);
            });
          }
    })
}
function validateInput(input, e) {
    if (!input.value) {
        input.style.border = "2px solid red";
        e.preventDefault();
    }
}

function focusOutOfInput(input) {
    if (input.value) {
        input.style.border = " 1px solid #627264";
    }
}