import { DELIVERIES_URL, VANS_URL } from "../../settings.js";
import { handleHttpErrors, sanitizeStringWithTableRows } from "../../utils.js";

export function initAssigned() {
    getVans();
    getAssignedDeliveries();
}

async function getVans() {
    const vans = await fetch(VANS_URL).then(handleHttpErrors);
    displayVans(vans);
}

function displayVans(vans) {
    const vansData = vans
        .map(
            (v) =>
                `
        <tr/>
            <td>${v.id}</td>
            <td>${v.brand}</td>
            <td>${v.model}</td>
            <td>${v.currentCapacity}/${v.maxCapacity}g</td>
        </tr>
        `
        )
        .join("\n");

    document.querySelector("#vans-body").innerHTML = sanitizeStringWithTableRows(vansData);
}

async function getAssignedDeliveries() {
    const deliveries = await fetch(DELIVERIES_URL + "/assigned").then(handleHttpErrors);

    displayDeliveries(deliveries);
}

function displayDeliveries(deliveries) {
    console.log(deliveries);
    const deliveriesData = deliveries
        .map(
            (d) =>
                `
        <tr class="tr">
            <td>${d.id}</td>
            <td>${d.deliveryDate}</td>
            <td>${d.fromWareHouse}</td>
            <td>${d.destination}</td>
            <td>${d.vanId}</td>
        </tr>
        `
        )
        .join("\n");

    document.querySelector("#tbody").innerHTML = sanitizeStringWithTableRows(deliveriesData);
}
