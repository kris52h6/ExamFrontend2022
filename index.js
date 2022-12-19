import "https://unpkg.com/navigo";
import { adjustForMissingHash, loadHtml, renderTemplate, setActiveLink } from "./utils.js";

import { initProducts } from "./pages/products/products.js";
import { initAddProduct } from "./pages/addProduct/addProduct.js";
import { initEditProduct } from "./pages/editProduct/editProduct.js";
import { initDeliveries } from "./pages/deliveries/deliveries.js";
import { initAddDelivery } from "./pages/addDelivery/addDelivery.js";

window.addEventListener("load", async () => {
    const templateHome = await loadHtml("./pages/home/home.html");
    const templateNotFound = await loadHtml("./pages/notFound/notFound.html");
    const templateProducts = await loadHtml("./pages/products/products.html");
    const templateAddProduct = await loadHtml("./pages/addProduct/addProduct.html");
    const templateEditProduct = await loadHtml("./pages/editProduct/editProduct.html");
    const templateDeliveries = await loadHtml("./pages/deliveries/deliveries.html");
    const templateAddDelivery = await loadHtml("./pages/addDelivery/addDelivery.html");

    adjustForMissingHash();

    const router = new Navigo("/", { hash: true });
    window.router = router;

    router
        .hooks({
            before(done, match) {
                setActiveLink("menu", match.url);
                done();
            },
        })
        .on({
            "/": () => {
                renderTemplate(templateHome, "content");
            },
            "/products": () => {
                renderTemplate(templateProducts, "content");
                initProducts();
            },
            "/addProduct": () => {
                renderTemplate(templateAddProduct, "content");
                initAddProduct();
            },
            "/editProduct": () => {
                renderTemplate(templateEditProduct, "content");
                initEditProduct();
            },
            "/deliveries": () => {
                renderTemplate(templateDeliveries, "content");
                initDeliveries();
            },
            "/addDelivery": () => {
                renderTemplate(templateAddDelivery, "content");
                initAddDelivery();
            },
        })
        .notFound(() => {
            renderTemplate(templateNotFound, "content");
        })
        .resolve();
});
