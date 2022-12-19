import { DELIVERIES_URL, PRODUCTORDERS_URL } from "../../settings.js";
import { handleHttpErrors, getIdFromUrl, sanitizeStringWithTableRows, makeOptions, displayResponse } from "../../utils.js";

export function initEditDelivery() {
    getDeliveryFromUrl();
    getProductOrders();
    document.querySelector("form").addEventListener("submit", addProductToOrder);
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
            // console.error(err.message);
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
    console.log("pp");
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
            // console.error(err.message);
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
