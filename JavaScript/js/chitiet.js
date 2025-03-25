function themvaogio(id, ten, hinh, gia) {
    var cart = JSON.parse(localStorage.getItem("cart"));
    if (cart == null) {
        cart = [];
        cart.push({ id: id, name: ten, image: hinh, price: gia, quantity: 1 });
    } else {
        let item = cart.find(item => item.id === id);
        if (item) item.quantity++;
        else cart.push({ id: id, name: ten, image: hinh, price: gia, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
}

function changeLargeImage(imageUrl) {
    document.querySelector('.box-anh2 img').src = imageUrl; // Assuming the large image is within a container with class 'box-anh2'
}

function loadDetail() {
    var id = sessionStorage.getItem('id_Detail');
    let sp = ""; // Khởi tạo chuỗi HTML
    for (let i = 0; i < products.length; i++) {
        if (id == products[i].id) {
            let sp1 = "";
            for (let j = 0; j < products[i].anhnho.length; j++) {
                sp1 += `<img src="./img/${products[i].anhnho[j]}" alt="" onclick="changeLargeImage('./img/${products[i].anhnho[j]}')">`;
            }
            sp += `<div>
                <div class="box-anh2">
                    <img src="./img/${products[i].image}" alt="">
                </div>
                <div class="col30">
                    <div class="imgg">
                        ${sp1}
                    </div>
                </div>
                <div class="box-chu2">
                    <a href="index.html">Trang chủ  /</a> 
                    <a href="#">Trà Thái Nguyên</a>
                    <div class="ten">
                        ${products[i].name}
                    </div>
                    <div class="gia">
                        ${products[i].price}đ
                    </div>
                    <ul>
                        <li>Khối lượng: 100g</li>
                        <li>Thương hiệu: Tâm trà Thái</li>
                        <li>Xuất sứ: Thái Nguyên</li>
                        <li>Thành phần: 100% chè tân cương Thái Nguyên</li>
                    </ul>
                    <fieldset>
                        <legend>Tiêu chí của chúng tôi</legend>
                        <ul>
                            <li>Chọn lọc kĩ lưỡng từng lá trà xanh</li>
                            <li>Sử dụng công nghệ mới nhất để sấy trà</li>
                            <li>Mức giá cạnh tranh nhất!</li>
                            <li>Giao hàng nhanh nhất trong nội thành Hà Nội</li>
                            <li>Hoàn tiền 100% nếu bạn không hài lòng</li>
                        </ul>
                    </fieldset>
                    <div class="tag-a">
                        <a href="#" onclick="themvaogio(${products[i].id},'${products[i].name}','${products[i].image}',${products[i].price})"> THÊM VÀO GIỎ HÀNG <br> Gọi điện thoại xác nhận và giao hàng tận nơi</a>
                    </div>
                    <hr class="hr">
                </div>
            </div>`;
            break; // Khi sản phẩm được tìm thấy, không cần tiếp tục vòng lặp
        }
    }
    // Set nội dung HTML sau khi vòng lặp hoàn thành
    document.querySelector("#loadDetail").innerHTML = sp;
}

loadDetail();
