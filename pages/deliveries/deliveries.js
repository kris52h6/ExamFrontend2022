import { DELIVERIES_URL } from "../../settings.js";
import { handleHttpErrors, sanitizeStringWithTableRows } from "../../utils.js";

export function initDeliveries() {
    document.querySelector("#add-delivery").onclick = goToAddDelivery;
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
        </tr>
        `
        )
        .join("\n");

    document.querySelector("#tbody").innerHTML = sanitizeStringWithTableRows(deliveriesData);
}

function goToAddDelivery() {
    window.location = "#/addDelivery";
}
