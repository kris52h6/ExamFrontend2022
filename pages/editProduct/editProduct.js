import { PRODUCTS_URL } from "../../settings.js";
import { handleHttpErrors, displayResponse, clearResponse, makeOptions } from "../../utils.js";

export function initEditProduct() {
    document.querySelector("#get-product-submit").onclick = getProduct;
    document.querySelector("#submit").onclick = editProduct;
    document.querySelector("#delete").onclick = deleteProduct;
    clearResponse();
    clearProduct();
    getProductFromUrl();
}

async function getProduct() {
    const productName = document.querySelector("#product-name").value;

    try {
        const product = await fetch(PRODUCTS_URL + "/name/" + productName).then(handleHttpErrors);
        displayProduct(product);
    } catch (err) {
        if (err.apiError) {
            displayResponse(err.apiError.message, true);
        } else {
            displayResponse(err.message, true);
        }
    }
}

function displayProduct(product, productId) {
    document.querySelector("#name").value = product.name;
    document.querySelector("#price").value = product.price;
    document.querySelector("#weight").value = product.weight;
    document.querySelector("#id").value = product.id;
    document.querySelector("#product-name").value = product.name;
}

async function getProductFromUrl() {
    const productId = getIdFromUrl();
    if (productId != undefined) {
        const product = await fetch(PRODUCTS_URL + "/" + productId).then(handleHttpErrors);
        displayProduct(product, productId);
    }
}

async function editProduct() {
    const newProduct = getProductFromFormInput();
    const productId = document.querySelector("#id").value;

    const editProductRequest = makeOptions("PUT", newProduct);

    try {
        await fetch(PRODUCTS_URL + "/" + productId, editProductRequest).then(handleHttpErrors);
        displayResponse("Produkt gemt", false);
    } catch (err) {
        if (err.apiError) {
            displayResponse(err.apiError.message, true);
        } else {
            displayResponse(err.message, true);
        }
    }
}

async function deleteProduct() {
    const productId = document.querySelector("#id").value;

    const editProductRequest = makeOptions("DELETE");

    try {
        await fetch(PRODUCTS_URL + "/" + productId, editProductRequest).then(handleHttpErrors);
        displayResponse("Produkt slettet", false);
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

function getIdFromUrl() {
    return window.location.href.split("=")[1];
}

function clearProduct() {
    document.querySelector("#product-name").value = "";
    document.querySelector("#name").value = "";
    document.querySelector("#price").value = "";
    document.querySelector("#weight").value = "";
}
