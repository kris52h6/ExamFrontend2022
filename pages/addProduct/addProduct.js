import { PRODUCTS_URL } from "../../settings.js";
import { displayResponse, handleHttpErrors, makeOptions } from "../../utils.js";

export function initAddProduct() {
    document.querySelector("form").addEventListener("submit", addProduct);
    clearPage();
}

async function addProduct() {
    const newProduct = getProductFromFormInput();

    const productRequest = makeOptions("POST", newProduct);
    try {
        await fetch(PRODUCTS_URL, productRequest).then(handleHttpErrors);
        displayResponse("Produkt tilføjet", false);
    } catch (err) {
        if (err.apiError) {
            displayResponse(err.apiError.message, true);
        } else {
            displayResponse(err.message, true);
        }
    }
}

function getProductFromFormInput() {
    const product = {
        name: document.querySelector("#name").value,
        price: document.querySelector("#price").value,
        weight: document.querySelector("#weight").value,
    };
    return product;
}

function clearPage() {
    document.querySelector("#name").value = "";
    document.querySelector("#price").value = "";
    document.querySelector("#weight").value = "";
    document.querySelector(".response").innerHTML = DOMPurify.sanitize("");
}
