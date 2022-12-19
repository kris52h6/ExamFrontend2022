import { DELIVERIES_URL, PRODUCTORDERS_URL } from "../../settings.js";
import { handleHttpErrors, getIdFromUrl, sanitizeStringWithTableRows, makeOptions, displayResponse, clearResponse } from "../../utils.js";

export function initEditDelivery() {
    getDeliveryFromUrl();
    getProductOrders();
    clearProductForm();
    document.querySelector("#add-form").addEventListener("submit", addProductToOrder);
    document.querySelector("#van-form").addEventListener("submit", addDeliveryToVan);
}

async function getDeliveryFromUrl() {
    const deliveryId = getIdFromUrl();
    if (deliveryId != undefined) {
        const delivery = await fetch(DELIVERIES_URL + "/" + deliveryId).then(handleHttpErrors);
        displayDelivery(delivery);
    }
}

function displayDelivery(delivery) {
    document.querySelector("#date").value = delivery.deliveryDate;
    document.querySelector("#warehouse").value = delivery.fromWareHouse;
    document.querySelector("#destination").value = delivery.destination;
}
async function getProductOrders() {
    const deliveryId = getIdFromUrl();
    try {
        const productOrderList = await fetch(PRODUCTORDERS_URL + "/delivery/" + deliveryId).then(handleHttpErrors);
        displayProductOrders(productOrderList);
    } catch (err) {
        if (err.apiError) {
            displayResponse(err.apiError.message, true);
        } else {
            displayResponse(err.message, true);
        }
    }
}

function displayProductOrders(productOrderList) {
    const listData = productOrderList
        .map(
            (po) =>
                `<tr>
                
                    <td>${po.quantity}</td>
                    <td>${po.productName}</td>
                </tr>`
        )
        .join("\n");

    document.querySelector("#tbody").innerHTML = sanitizeStringWithTableRows(listData);

    let totalPrice = 0;
    let totalWeight = 0;

    for (let i = 0; i < productOrderList.length; i++) {
        totalPrice += productOrderList[i].quantity * productOrderList[i].productPrice;
        totalWeight += productOrderList[i].quantity * productOrderList[i].productWeight;
    }

    document.querySelector("#total-price").innerHTML = DOMPurify.sanitize("Total pris: " + totalPrice + ",-");
    document.querySelector("#total-weight").innerHTML = DOMPurify.sanitize("Total vægt: " + totalWeight + "g");
}

async function addProductToOrder() {
    const productOrder = createProductOrderFromFormInput();
    const productOrderRequest = makeOptions("POST", productOrder);

    try {
        await fetch(PRODUCTORDERS_URL, productOrderRequest).then(handleHttpErrors);
        displayResponse("Produkt tilføjet", false);
        getProductOrders();
    } catch (err) {
        if (err.apiError) {
            displayResponse(err.apiError.message, true);
        } else {
            displayResponse(err.message, true);
        }
    }
}

function createProductOrderFromFormInput() {
    const productOrder = {
        productName: document.querySelector("#product-name").value,
        quantity: document.querySelector("#product-quantity").value,
        deliveryId: getIdFromUrl(),
    };
    return productOrder;
}

async function addDeliveryToVan() {
    const deliveryId = getIdFromUrl();
    const vanId = document.querySelector("#van").value;

    const requestBody = {
        id: deliveryId,
    };

    const vanRequest = makeOptions("POST", requestBody);

    try {
        await fetch(DELIVERIES_URL + "/van/" + vanId, vanRequest).then(handleHttpErrors);
        displayResponse("Bestilling tilknyttet", false);
    } catch (err) {
        if (err.apiError) {
            displayResponse(err.apiError.message, true);
        } else {
            displayResponse(err.message, true);
        }
    }
}

function clearProductForm() {
    document.querySelector("#product-name").value = "";
    document.querySelector("#product-quantity").value = "";
    clearResponse();
}
