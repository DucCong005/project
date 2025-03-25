var tt = 0;

function hienGioHang() {
    var cart = JSON.parse(localStorage.getItem("cart"));
    if (cart) {
        var gioHangElement = document.querySelector("#gio-hang");
        gioHangElement.innerHTML = ""; // Xóa nội dung giỏ hàng trước khi hiển thị lại

        cart.forEach((product, index) => {
            var tc = product.price * product.quantity;
            tt += tc;
            gioHangElement.innerHTML += 
            `<div class="giohang">
                <div class="item-giohang">
                    <div class="hinhanh">
                        <img src="img/${product.image}" alt="">
                    </div>
                    <p class="ten ml">${product.name}</p>
                    <div class="gia">${product.price} đ</div>
                    <div>
                        <input type="number" class="soluong" min="1" value="${product.quantity}"
                        oninput="updateQuantity(${index}, this.value)">
                    </div>
                    <p class="tongtien ml">${tc} đ</p>
                    <div class="hanhdong ml" onclick="removeItem(${index})"><i class="fa-solid fa-trash"></i></div>
                </div>
            </div>`;
        });
    }
    tongtien();
}

function updateQuantity(index, quantity) {
    var cart = JSON.parse(localStorage.getItem("cart"));
    cart[index].quantity = parseInt(quantity);
    cart[index].total = cart[index].price * parseInt(quantity);
    localStorage.setItem("cart", JSON.stringify(cart));
    hienGioHang();
}

function removeItem(index) {
    var cart = JSON.parse(localStorage.getItem("cart"));
    var removedItem = cart.splice(index, 1)[0]; // Lấy ra sản phẩm bị xóa để cập nhật lại tổng tiền
    tt -= removedItem.total; // Giảm tổng tiền đi giá trị của sản phẩm bị xóa
    localStorage.setItem("cart", JSON.stringify(cart));
    hienGioHang();
}

function tongtien() {
    document.querySelector("#tong-tien").textContent = tt;
}

hienGioHang();
