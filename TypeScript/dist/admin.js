"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// 🟢 Hàm tải danh sách sản phẩm
const loadProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch("http://localhost:5000/products");
        if (!response.ok)
            throw new Error("Không thể tải dữ liệu từ API");
        const products = yield response.json();
        const productTableBody = document.getElementById("productTableBody");
        if (!productTableBody)
            return;
        productTableBody.innerHTML = ""; // Xóa danh sách cũ
        products.forEach((product) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><img src="images/${product.img || 'default-image.jpg'}" alt="${product.name}" style="width: 120px; height: 120px;"></td>
                <td>${product.name}</td>
                <td>${product.price.toLocaleString()} VND</td>
                <td>${product.hot}</td>
                <td>${product.idcate}</td>
                <td style="width: 120px">
                    <button onclick="showEditForm('${product.id}', '${product.name}', ${product.price}, '${product.img}', '${product.description}', ${product.hot}, ${product.idcate})">✏️</button>
                    <button onclick="deleteProduct('${product.id}')">❌</button>
                </td>
            `;
            productTableBody.prepend(row);
        });
    }
    catch (error) {
        console.error("Lỗi khi tải danh sách sản phẩm:", error);
        alert("Không thể tải danh sách sản phẩm. Vui lòng kiểm tra lại kết nối API.");
    }
});
// 🟢 Hàm thêm sản phẩm
const addProduct = (name, price, img, description, hot, idcate) => __awaiter(void 0, void 0, void 0, function* () {
    if (!name.trim() || isNaN(price) || price <= 0 || !img.trim()) {
        alert("Vui lòng nhập thông tin sản phẩm hợp lệ!");
        return;
    }
    const newProduct = {
        id: Date.now().toString(),
        name: name.trim(),
        price,
        img: img.trim(),
        description: description.trim(),
        hot,
        idcate
    };
    try {
        const response = yield fetch('http://localhost:5000/products', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newProduct),
        });
        if (!response.ok)
            throw new Error("Không thể thêm sản phẩm mới");
        alert("Sản phẩm đã được thêm thành công!");
        const form = document.getElementById("productForm");
        form === null || form === void 0 ? void 0 : form.reset();
        toggleFormVisibility("productForm", false);
        loadProducts(); // Cập nhật danh sách
    }
    catch (error) {
        console.error("Lỗi khi thêm sản phẩm:", error);
        alert("Thêm sản phẩm thất bại. Vui lòng kiểm tra kết nối API.");
    }
});
// 🟡 Hàm hiển thị form chỉnh sửa sản phẩm
const showEditForm = (id, name, price, img, description, hot, idcate) => {
    const editForm = document.getElementById("editProductForm");
    const nameInput = document.getElementById("editProductName");
    const priceInput = document.getElementById("editProductPrice");
    const imgInput = document.getElementById("editProductImg");
    const descriptionInput = document.getElementById("editProductDescription");
    const hotInput = document.getElementById("editProductHot");
    const idcateInput = document.getElementById("editProductIdcate");
    // Điền thông tin sản phẩm vào form
    nameInput.value = name;
    priceInput.value = price.toString();
    imgInput.value = img;
    descriptionInput.value = description;
    hotInput.value = hot.toString();
    idcateInput.value = idcate.toString();
    // Lưu ID sản phẩm vào form
    editForm.dataset.productId = id;
    // Hiển thị form sửa
    toggleFormVisibility("editProductForm", true);
};
// 🟡 Hàm chỉnh sửa sản phẩm
const editProduct = () => __awaiter(void 0, void 0, void 0, function* () {
    const form = document.getElementById("editProductForm");
    const productId = form.dataset.productId;
    if (!productId)
        return;
    const nameInput = document.getElementById("editProductName");
    const priceInput = document.getElementById("editProductPrice");
    const imgInput = document.getElementById("editProductImg");
    const descriptionInput = document.getElementById("editProductDescription");
    const hotInput = document.getElementById("editProductHot");
    const idcateInput = document.getElementById("editProductIdcate");
    const name = nameInput.value.trim();
    const price = parseFloat(priceInput.value);
    const img = imgInput.value.trim();
    const description = descriptionInput.value.trim();
    const hot = parseInt(hotInput.value);
    const idcate = parseInt(idcateInput.value);
    if (!name || isNaN(price) || price <= 0 || !img || isNaN(hot) || isNaN(idcate)) {
        alert("Vui lòng nhập thông tin hợp lệ!");
        return;
    }
    try {
        const response = yield fetch(`http://localhost:5000/products/${productId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, price, img, description, hot, idcate }),
        });
        if (!response.ok)
            throw new Error("Không thể cập nhật sản phẩm");
        alert("Sản phẩm đã được cập nhật thành công!");
        form.reset();
        toggleFormVisibility("editProductForm", false);
        loadProducts();
    }
    catch (error) {
        console.error("Lỗi khi sửa sản phẩm:", error);
        alert("Cập nhật sản phẩm thất bại. Vui lòng kiểm tra lại kết nối API.");
    }
});
// 🔴 Hàm xóa sản phẩm
const deleteProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?"))
        return;
    try {
        const response = yield fetch(`http://localhost:5000/products/${id}`, { method: "DELETE" });
        if (!response.ok)
            throw new Error("Không thể xóa sản phẩm");
        alert("Sản phẩm đã bị xóa thành công!");
        loadProducts();
    }
    catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
        alert("Xóa sản phẩm thất bại. Vui lòng kiểm tra lại kết nối API.");
    }
});
// 🟠 Hàm hiển thị/ẩn form
const toggleFormVisibility = (formId, show) => {
    const form = document.getElementById(formId);
    if (form) {
        form.style.display = show ? "block" : "none";
    }
};
// Hàm hiển thị form thêm sản phẩm
const showAddForm = () => {
    toggleFormVisibility("productForm", true);
};
// Hàm ẩn form thêm hoặc sửa sản phẩm
const hideForms = () => {
    toggleFormVisibility("productForm", false);
    toggleFormVisibility("editProductForm", false);
};
// Gắn các sự kiện khi trang tải
document.addEventListener("DOMContentLoaded", () => {
    var _a, _b, _c;
    loadProducts();
    // Xử lý thêm sản phẩm
    const productForm = document.getElementById("productForm");
    productForm === null || productForm === void 0 ? void 0 : productForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const name = document.getElementById("name").value.trim();
        const price = parseFloat(document.getElementById("price").value);
        const img = document.getElementById("img").value.trim();
        const description = document.getElementById("description").value.trim();
        const hot = parseInt(document.getElementById("hot").value);
        const idcate = parseInt(document.getElementById("idcate").value);
        addProduct(name, price, img, description, hot, idcate);
    });
    // Xử lý cập nhật sản phẩm
    const editForm = document.getElementById("editProductForm");
    editForm === null || editForm === void 0 ? void 0 : editForm.addEventListener("submit", (event) => {
        event.preventDefault();
        editProduct();
    });
    // Gắn sự kiện cho các nút hiển thị và ẩn form
    (_a = document.getElementById("showAddFormButton")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", showAddForm);
    (_b = document.getElementById("cancelAddFormButton")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", hideForms);
    (_c = document.getElementById("cancelEditFormButton")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", hideForms);
});
// Xuất các hàm để dùng trong HTML
window.loadProducts = loadProducts;
window.addProduct = addProduct;
window.showEditForm = showEditForm;
window.deleteProduct = deleteProduct;
