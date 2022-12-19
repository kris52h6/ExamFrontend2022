import { DELIVERIES_URL } from "../../settings.js";
import { handleHttpErrors, sanitizeStringWithTableRows } from "../../utils.js";

export function initDeliveries() {
    document.querySelector("#add-delivery").onclick = goToAddDelivery;
    document.querySelector("#tbody").onclick = goToEditDelivery;
    getDeliveries();
}

async function getDeliveries() {
    const deliveries = await fetch(DELIVERIES_URL).then(handleHttpErrors);
    displayDeliveries(deliveries);
}

function displayDeliveries(deliveries) {
    const deliveriesData = deliveries
        .map(
            (d) =>
                `
        <tr class="tr">
            <td>${d.id}</td>
            <td>${d.deliveryDate}</td>
            <td class="col-1">
            <a id="${d.id}" class="btn btn-dark">Rediger</a>
            </td>
        </tr>
        `
        )
        .join("\n");

    document.querySelector("#tbody").innerHTML = sanitizeStringWithTableRows(deliveriesData);
}

function goToAddDelivery() {
    window.location = "#/addDelivery";
}

function goToEditDelivery(evt) {
    if (evt.target.tagName.toLowerCase() !== "a") {
        return;
    }
    const deliveryId = evt.target.id;
    window.location = "#/editDelivery?=" + deliveryId;
}
