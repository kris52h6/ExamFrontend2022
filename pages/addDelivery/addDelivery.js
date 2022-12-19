import { DELIVERIES_URL } from "../../settings.js";
import { handleHttpErrors, makeOptions, displayResponse, clearResponse } from "../../utils.js";

export function initAddDelivery() {
    document.querySelector("form").addEventListener("submit", addDelivery);
    clearDelivery();
}

async function addDelivery() {
    const deliveryToBeAdded = getDeliveryFromFormInput();

    const deliveryRequest = makeOptions("POST", deliveryToBeAdded);

    try {
        const response = await fetch(DELIVERIES_URL, deliveryRequest).then(handleHttpErrors);
        createDeliveryLink(response);
        displayResponse("Bestilling tilføjet", false);
    } catch (err) {
        if (err.apiError) {
            displayResponse(err.apiError.message, true);
        } else {
            displayResponse(err.message, true);
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

function createDeliveryLink(response) {
    const div = document.querySelector("#link");
    const newLink = document.createElement("a");
    const newDeliveryId = response.id;
    newLink.innerText = "Gå til bestilling";
    newLink.href = "";
    div.appendChild(newLink);
    newLink.addEventListener("mouseup", () => {
        goToDelivery(newDeliveryId);
    });
}

function goToDelivery(newDeliveryId) {
    window.location = "#/editDelivery?=" + newDeliveryId;
}

function clearDelivery() {
    document.querySelector("#date").value = "";
    document.querySelector("#warehouse").value = "";
    document.querySelector("#destination").value = "";
    document.querySelector("#link").innerHTML = "";
    clearResponse();
}
