import { PRODUCTS_URL } from "../../settings.js";
import { handleHttpErrors, sanitizeStringWithTableRows } from "../../utils.js";

export function initProducts() {
    getProducts();
    document.querySelector("#new-product").onclick = goToAddProduct;
    document.querySelector("#find-product").onclick = goToEditProduct;
}

async function getProducts() {
    const products = await fetch(PRODUCTS_URL).then(handleHttpErrors);
    displayProducts(products);
}

function displayProducts(products) {
    const productData = products
        .map(
            (p) =>
                `<tr class="tr">
            <td>${p.id}</td>
            <td>${p.name}</td>
            <td>${p.price},-</td>
            <td>${p.weight}g</td>
        </tr>
        `
        )
        .join("\n");

    document.querySelector("#tbody").innerHTML = sanitizeStringWithTableRows(productData);
}

function goToAddProduct() {
    window.location = "#/addProduct";
}

function goToEditProduct() {
    window.location = "#/editProduct";
}
