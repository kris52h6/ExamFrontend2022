import { PRODUCTS_URL } from "../../settings.js";
import { handleHttpErrors, displayResponse, clearResponse } from "../../utils.js";

export function initEditProduct() {
    document.querySelector("#get-product-submit").onclick = getProduct;
    displayProductFromUrl();
    // clearResponse();
}

async function getProduct() {
    const productId = document.querySelector("#product-id").value;

    try {
        const product = await fetch(PRODUCTS_URL + "/" + productId).then(handleHttpErrors);
        displayProduct(product);
    } catch (err) {
        if (err.apiError) {
            console.error("Full API error: ", err.apiError);
            displayResponse(err.apiError.message, true);
        } else {
            console.error(err.message);
        }
    }
}

function displayProduct(product, productId) {
    document.querySelector("#name").value = product.name;
    document.querySelector("#price").value = product.price;
    document.querySelector("#weight").value = product.weight;
    console.log(productId);
    if (productId != undefined) {
        document.querySelector("#product-id").value = productId;
    }
}

async function displayProductFromUrl() {
    const productId = getIdFromUrl();
    if (productId != undefined) {
        const product = await fetch(PRODUCTS_URL + "/" + productId).then(handleHttpErrors);
        displayProduct(product, productId);
    }
}

function getIdFromUrl() {
    return window.location.href.split("=")[1];
}
