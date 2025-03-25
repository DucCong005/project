// Interface định nghĩa kiểu dữ liệu sản phẩm
interface Product {
    id: number | string;
    name: string;
    price: number;
    img: string;
    description: string;
    hot: number;
    idcate: number;
}

// 🟢 Hàm tải danh sách sản phẩm
const loadProducts = async (): Promise<void> => {
    try {
        const response = await fetch("http://localhost:5000/products");
        if (!response.ok) throw new Error("Không thể tải dữ liệu từ API");

        const products: Product[] = await response.json();  
        const productTableBody = document.getElementById("productTableBody") as HTMLTableSectionElement;

        if (!productTableBody) return;

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
    } catch (error) {
        console.error("Lỗi khi tải danh sách sản phẩm:", error);
        alert("Không thể tải danh sách sản phẩm. Vui lòng kiểm tra lại kết nối API.");
    }
};

// 🟢 Hàm thêm sản phẩm
const addProduct = async (name: string, price: number, img: string, description: string, hot: number, idcate: number): Promise<void> => {
    if (!name.trim() || isNaN(price) || price <= 0 || !img.trim()) {
        alert("Vui lòng nhập thông tin sản phẩm hợp lệ!");
        return;
    }

    const newProduct: Product = {
        id: Date.now().toString(),
        name: name.trim(),
        price,
        img: img.trim(),
        description: description.trim(),
        hot,
        idcate
    };

    try {
        const response = await fetch('http://localhost:5000/products', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newProduct),
        });

        if (!response.ok) throw new Error("Không thể thêm sản phẩm mới");

        alert("Sản phẩm đã được thêm thành công!");
        const form = document.getElementById("productForm") as HTMLFormElement | null;
        form?.reset();
        toggleFormVisibility("productForm", false);

        loadProducts(); // Cập nhật danh sách
    } catch (error) {
        console.error("Lỗi khi thêm sản phẩm:", error);
        alert("Thêm sản phẩm thất bại. Vui lòng kiểm tra kết nối API.");
    }
};

// 🟡 Hàm hiển thị form chỉnh sửa sản phẩm
const showEditForm = (id: string, name: string, price: number, img: string, description: string, hot: number, idcate: number): void => {
    const editForm = document.getElementById("editProductForm") as HTMLFormElement;
    const nameInput = document.getElementById("editProductName") as HTMLInputElement;
    const priceInput = document.getElementById("editProductPrice") as HTMLInputElement;
    const imgInput = document.getElementById("editProductImg") as HTMLInputElement;
    const descriptionInput = document.getElementById("editProductDescription") as HTMLInputElement;
    const hotInput = document.getElementById("editProductHot") as HTMLInputElement;
    const idcateInput = document.getElementById("editProductIdcate") as HTMLInputElement;

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
const editProduct = async (): Promise<void> => {
    const form = document.getElementById("editProductForm") as HTMLFormElement;
    const productId = form.dataset.productId;

    if (!productId) return;

    const nameInput = document.getElementById("editProductName") as HTMLInputElement;
    const priceInput = document.getElementById("editProductPrice") as HTMLInputElement;
    const imgInput = document.getElementById("editProductImg") as HTMLInputElement;
    const descriptionInput = document.getElementById("editProductDescription") as HTMLInputElement;
    const hotInput = document.getElementById("editProductHot") as HTMLInputElement;
    const idcateInput = document.getElementById("editProductIdcate") as HTMLInputElement;

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
        const response = await fetch(`http://localhost:5000/products/${productId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, price, img, description, hot, idcate }),
        });

        if (!response.ok) throw new Error("Không thể cập nhật sản phẩm");

        alert("Sản phẩm đã được cập nhật thành công!");
        form.reset();
        toggleFormVisibility("editProductForm", false);
        loadProducts();
    } catch (error) {
        console.error("Lỗi khi sửa sản phẩm:", error);
        alert("Cập nhật sản phẩm thất bại. Vui lòng kiểm tra lại kết nối API.");
    }
};

// 🔴 Hàm xóa sản phẩm
const deleteProduct = async (id: string): Promise<void> => {
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;

    try {
        const response = await fetch(`http://localhost:5000/products/${id}`, { method: "DELETE" });

        if (!response.ok) throw new Error("Không thể xóa sản phẩm");

        alert("Sản phẩm đã bị xóa thành công!");
        loadProducts();
    } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
        alert("Xóa sản phẩm thất bại. Vui lòng kiểm tra lại kết nối API.");
    }
};

// 🟠 Hàm hiển thị/ẩn form
const toggleFormVisibility = (formId: string, show: boolean): void => {
    const form = document.getElementById(formId);
    if (form) {
        form.style.display = show ? "block" : "none";
    }
};

// Hàm hiển thị form thêm sản phẩm
const showAddForm = (): void => {
    toggleFormVisibility("productForm", true);
};

// Hàm ẩn form thêm hoặc sửa sản phẩm
const hideForms = (): void => {
    toggleFormVisibility("productForm", false);
    toggleFormVisibility("editProductForm", false);
};

// Gắn các sự kiện khi trang tải
document.addEventListener("DOMContentLoaded", () => {
    loadProducts();

    // Xử lý thêm sản phẩm
    const productForm = document.getElementById("productForm") as HTMLFormElement;
    productForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        const name = (document.getElementById("name") as HTMLInputElement).value.trim();
        const price = parseFloat((document.getElementById("price") as HTMLInputElement).value);
        const img = (document.getElementById("img") as HTMLInputElement).value.trim();
        const description = (document.getElementById("description") as HTMLInputElement).value.trim();
        const hot = parseInt((document.getElementById("hot") as HTMLInputElement).value);
        const idcate = parseInt((document.getElementById("idcate") as HTMLInputElement).value);
        addProduct(name, price, img, description, hot, idcate);
    });

    // Xử lý cập nhật sản phẩm
    const editForm = document.getElementById("editProductForm") as HTMLFormElement;
    editForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        editProduct();
    });

    // Gắn sự kiện cho các nút hiển thị và ẩn form
    document.getElementById("showAddFormButton")?.addEventListener("click", showAddForm);
    document.getElementById("cancelAddFormButton")?.addEventListener("click", hideForms);
    document.getElementById("cancelEditFormButton")?.addEventListener("click", hideForms);
});

// Xuất các hàm để dùng trong HTML
(window as any).loadProducts = loadProducts;
(window as any).addProduct = addProduct;
(window as any).showEditForm = showEditForm;
(window as any).deleteProduct = deleteProduct;
