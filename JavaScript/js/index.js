function arr_Detail(id) {
    sessionStorage.setItem('id_Detail', id);
    window.location.href = "chitietsp.html";
}

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
    alert("Sản phẩm đã được thêm vào giỏ hàng !");
}

function loadsanpham(cateId) {
    let sp = "";
    for (let i = 0; i < products.length; i++) {
        if (products[i].cate_id === cateId) {
            sp += `<div class="box-5 mg20 bgcolor">
            <div class="hinh">
                <a href="chitietsp.html" onclick="arr_Detail(${products[i].id})">
                    <img src="./img/${products[i].image}" alt="">
                </a>
                <div class="nutgiohang">
                    <span onclick="themvaogio(${products[i].id},'${products[i].name}','${products[i].image}',${products[i].price})"><i class="fa-solid fa-cart-plus" style="color: red; padding-left: 10px; font-size: 20px;"></i></span>
                    <a href="chitietsp.html" onclick="arr_Detail(${products[i].id})"><i class="fa-solid fa-magnifying-glass" style="color: red; padding-left: 10px; font-size: 20px;"></i></a>
                </div>
            </div>
            <div class="ten">
                <a onclick="arr_Detail(${products[i].id})">${products[i].name}</a>
            </div>
            <div class="gia">
                ${products[i].price}đ
            </div>
        </div>`;
        }
    }
    return sp;
}

document.querySelector("#loadsp").innerHTML = loadsanpham(1);
document.querySelector("#loadsp2").innerHTML = loadsanpham(2);
document.querySelector("#loadsp3").innerHTML = loadsanpham(3);
