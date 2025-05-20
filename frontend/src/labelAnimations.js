export function initLabelAnimations(inputs) { 
    inputs.forEach(({ input, label }) => {
        let inputElement = document.getElementById(input);
        let labelElement = document.getElementById(label);
        if(inputElement && labelElement) {
            inputElement.addEventListener("focus", () => { AnimateLabelFocus(labelElement) });
            inputElement.addEventListener("focusout", () => { AnimateLabelFocusOut(inputElement, labelElement) });
        }
    })
}


function AnimateLabelFocus(label) {
    label.style.transform = "translate(-35px, -18px) scale(0.7)";
    label.style.color = "black";
}

function AnimateLabelFocusOut(input, label) {
    if(!input.value) {
        label.style.transform = "translate(0px, 0px) scale(1)";
        label.style.color = "rgb(43,43,43)";
    }
 }