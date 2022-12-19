import { DELIVERIES_URL } from "../../settings.js";
import { handleHttpErrors, makeOptions } from "../../utils.js";

export function initAddDelivery() {
    document.querySelector("form").addEventListener("submit", addDelivery);
}

async function addDelivery() {
    const deliveryToBeAdded = getDeliveryFromFormInput();

    const deliveryRequest = makeOptions("POST", deliveryToBeAdded);

    try {
        await fetch(DELIVERIES_URL, deliveryRequest).then(handleHttpErrors);
    } catch (err) {
        if (err.apiError) {
            displayResponse(err.apiError.message, true);
        } else {
            // console.error(err.message);
        }
    }
}

function getDeliveryFromFormInput() {
    const delivery = {
        deliveryDate: document.querySelector("#date").value,
        fromWareHouse: document.querySelector("#warehouse").value,
        destination: document.querySelector("#destination").value,
    };
    return delivery;
}
