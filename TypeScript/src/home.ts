interface Product {
  id: number | string;
  name: string;
  price: number;
  img: string;
  description: string;
  hot: number;
  idcate: number;
}

interface CartItem extends Product {
  quantity: number;
}

interface Order {
  id: string;
  customer: { name: string; address: string; phone: string; email: string };
  items: CartItem[];
}
interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: string; // "admin" hoặc "user"
}
let isLoggedIn = false; // Biến kiểm tra trạng thái đăng nhập
let currentUser: User | null = null; // Lưu thông tin người dùng hiện tại
// 🟢 Lấy giỏ hàng từ localStorage
const getCart = (): CartItem[] => JSON.parse(localStorage.getItem("cart") || "[]");

// 🟢 Lưu giỏ hàng vào localStorage
const saveCart = (cart: CartItem[]): void => localStorage.setItem("cart", JSON.stringify(cart));

// 🟢 Biến toàn cục lưu giỏ hàng
let cart: CartItem[] = getCart();

// 🟢 Thêm sản phẩm vào giỏ hàng
const addToCart = (id: string | number, name: string, price: number, img: string, description: string, hot: number, idcate: number): void => {
  const existingItem = cart.find(item => item.id === id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id, name, price, img, description, hot, idcate, quantity: 1 });
  }
  saveCart(cart);
  alert("Sản phẩm đã được thêm vào giỏ hàng!");
  updateCartIcon();
  displayCart();
};

// Đăng ký hàm vào `window` để sử dụng từ HTML
(window as any).addToCart = addToCart;

// 🟢 Hàm hiển thị giỏ hàng
const displayCart = (): void => {
  cart = getCart(); // Lấy giỏ hàng từ localStorage
  const cartList = document.getElementById("cartList") as HTMLUListElement;

  if (!cartList) return;

  cartList.innerHTML = ""; // Xóa nội dung cũ

  cart.forEach((item, index) => {
    const price = typeof item.price === "number" && !isNaN(item.price) ? item.price : 0;

    // Tạo phần tử `li`
    const li = document.createElement("li");
    li.className = "cart_product d-flex flex-md-row flex-column align-items-md-center align-items-start justify-content-start";
    li.innerHTML = `
      <div class="cart_product_image">
        <img src="images/${item.img}" alt="${item.name}" style="width: 120px; height: 120px;">
      </div>
      <div class="cart_product_name"><a href="product.html">${item.name}</a></div>
      <div class="cart_product_info ml-auto">
        <div class="cart_product_info_inner d-flex flex-row align-items-center justify-content-md-end justify-content-start">
          <div class="cart_product_price">${price.toLocaleString()} VND</div>
          <div class="product_quantity_container">
            <div class="product_quantity clearfix">
              <input id="quantity_input_${index}" type="text" min="1" value="${item.quantity}">
              <div class="quantity_buttons">
                <div id="quantity_inc_button_${index}" class="quantity_inc quantity_control">
                  <i class="fa fa-caret-up" aria-hidden="true"></i>
                </div>
                <div id="quantity_dec_button_${index}" class="quantity_dec quantity_control">
                  <i class="fa fa-caret-down" aria-hidden="true"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="cart_product_total">${(price * item.quantity).toLocaleString()} VND</div>
          <div class="cart_product_button">
            <button class="remove_button" data-index="${index}"><img src="images/trash.png" alt="Remove"></button>
          </div>
        </div>
      </div>
    `;

    cartList.appendChild(li); // Thêm phần tử vào danh sách
  });

  // Gắn sự kiện cho các nút
  attachCartEvents();

  // Cập nhật tổng tiền
  updateCartTotal();
  updateCartIcon();
};

// 🟢 Hiển thị form thanh toán hoặc chuyển hướng
// Hàm kiểm tra và xử lý thanh toán
const checkout = (): void => {
  // Lấy phần tử modal đăng nhập
  const loginModal = document.getElementById("login-modal") as HTMLElement | null;

  // Kiểm tra trạng thái đăng nhập
  if (!isLoggedIn || !currentUser) {
    alert("Bạn cần đăng nhập trước khi thanh toán!");

    // Hiển thị modal đăng nhập nếu tồn tại
    if (loginModal) {
      loginModal.style.display = "block";
    } else {
      console.error("Modal đăng nhập (loginModal) không tồn tại trong DOM.");
    }

    return;
  }

  // Nếu đã đăng nhập, chuyển đến trang thanh toán
  alert("Chuyển đến trang thanh toán...");
  window.location.href = "checkout.html";
};

// Ánh xạ hàm vào `window` để gọi từ HTML
(window as any).checkout = checkout;
// 🟢 Gửi đơn hàng và chuyển đến orders.html
const submitOrder = async (): Promise<void> => {
  const name = (document.getElementById("customerName") as HTMLInputElement).value;
  const address = (document.getElementById("customerAddress") as HTMLInputElement).value;
  const phone = (document.getElementById("customerPhone") as HTMLInputElement).value;
  const email = (document.getElementById("customerEmail") as HTMLInputElement).value;

  if (!name || !address || !phone || !email) {
    alert("Vui lòng nhập đầy đủ thông tin khách hàng!");
    return;
  }

  const order = { customer: { name, address, phone, email }, items: cart };

  try {
    const response = await fetch('http://localhost:5000/orders', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });

    if (response.ok) {
      alert("Đơn hàng đã được gửi thành công!");
      cart = [];
      saveCart(cart);
      displayCart();
      document.getElementById("checkoutForm")!.style.display = "none";
      window.location.href = "orders.html";
      loadOrders();
    } else {
      alert("Lỗi khi gửi đơn hàng!");
    }
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng:", error);
    alert("Không thể gửi đơn hàng. Vui lòng thử lại!");
  }
};

// Đăng ký hàm vào `window`
(window as any).submitOrder = submitOrder;

// 🟢 Tải danh sách đơn hàng
const loadOrders = async (): Promise<void> => {
  try {
    const response = await fetch('http://localhost:5000/orders');
    if (!response.ok) throw new Error("Không thể tải đơn hàng.");
    const orders: Order[] = await response.json();

    const orderTable = document.getElementById("orderTable") as HTMLTableElement;
    if (!orderTable) {
      console.error("Không tìm thấy bảng hiển thị đơn hàng.");
      return;
    }

    // Xóa nội dung cũ
    const tableBody = orderTable.querySelector("tbody");
    if (tableBody) tableBody.innerHTML = "";

    // Thêm dữ liệu đơn hàng vào bảng
    orders.forEach(order => {
      const row = document.createElement("tr");

      // Tạo các cột (cells)
      const customerCell = document.createElement("td");
      customerCell.textContent = `${order.customer.name} - ${order.customer.address}`;

      const itemsCell = document.createElement("td");
      itemsCell.textContent = order.items.map(item => `${item.name} x${item.quantity}`).join(", ");

      // Thêm các cột vào hàng
      row.appendChild(customerCell);
      row.appendChild(itemsCell);

      // Thêm hàng vào body của bảng
      if (tableBody) tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Lỗi khi tải danh sách đơn hàng:", error);
    alert("Không thể tải danh sách đơn hàng. Vui lòng thử lại!");
  }
};

// Gọi hàm khi DOM đã tải
document.addEventListener("DOMContentLoaded", () => {
  loadOrders();
});

// 🟢 Gắn sự kiện cho giỏ hàng
const attachCartEvents = (): void => {
  cart = getCart(); // Lấy giỏ hàng từ localStorage

  // Gắn sự kiện thay đổi số lượng
  cart.forEach((_item, index) => {
    const quantityInput = document.getElementById(`quantity_input_${index}`) as HTMLInputElement;
    const incButton = document.getElementById(`quantity_inc_button_${index}`);
    const decButton = document.getElementById(`quantity_dec_button_${index}`);
    const removeButton = document.querySelector(`.remove_button[data-index="${index}"]`) as HTMLButtonElement;

    if (quantityInput) {
      quantityInput.addEventListener("change", (e) => {
        const value = parseInt((e.target as HTMLInputElement).value, 10);
        updateQuantity(index, value);
      });
    }

    if (incButton) {
      incButton.addEventListener("click", () => increaseQuantity(index));
    }

    if (decButton) {
      decButton.addEventListener("click", () => decreaseQuantity(index));
    }

    if (removeButton) {
      removeButton.addEventListener("click", () => removeCartItem(index));
    }
  });
};

// 🟢 Hàm tăng số lượng sản phẩm
const increaseQuantity = (index: number): void => {
  const cart = getCart();
  cart[index].quantity += 1;
  saveCart(cart);
  displayCart();
};
(window as any).increaseQuantity = increaseQuantity;

// 🟢 Hàm giảm số lượng sản phẩm
const decreaseQuantity = (index: number): void => {
  const cart = getCart();
  if (cart[index].quantity > 1) {
    cart[index].quantity -= 1;
    saveCart(cart);
    displayCart();
  }
};
(window as any).decreaseQuantity = decreaseQuantity;

// 🟢 Hàm cập nhật số lượng sản phẩm
const updateQuantity = (index: number, quantity: number): void => {
  const cart = getCart();
  cart[index].quantity = quantity > 0 ? quantity : 1;
  saveCart(cart);
  displayCart();
};
(window as any).updateQuantity = updateQuantity;

// 🟢 Hàm xóa sản phẩm khỏi giỏ hàng
const removeCartItem = (index: number): void => {
  const cart = getCart();
  cart.splice(index, 1); // Xóa sản phẩm theo chỉ số
  saveCart(cart);
  displayCart();
};
(window as any).removeCartItem = removeCartItem;

// 🟢 Hàm xóa toàn bộ giỏ hàng
const clearCart = (): void => {
  // Xóa toàn bộ giỏ hàng
  cart = [];
  saveCart(cart); // Lưu lại trạng thái giỏ hàng rỗng vào localStorage
  displayCart(); // Cập nhật lại giao diện
  alert("Giỏ hàng đã được xóa!");
};
// Gắn hàm clearCart vào `window` để sử dụng trong HTML nếu cần
(window as any).clearCart = clearCart;
// Gắn sự kiện cho nút "Clear Cart"
const clearCartButton = document.querySelector(".button_clear") as HTMLButtonElement;
if (clearCartButton) {
  clearCartButton.addEventListener("click", clearCart);
}
// 🟢 Hàm tiếp tục mua sắm
const continueShopping = (): void => {
  window.location.href = "index.html";
};
(window as any).continueShopping = continueShopping;
// Gắn sự kiện cho nút "Continue Shopping"
const continueShoppingButton = document.querySelector(".button_update.cart_button_2") as HTMLButtonElement;
if (continueShoppingButton) {
  continueShoppingButton.addEventListener("click", continueShopping);
}

// 🟢 Hàm cập nhật tổng tiền giỏ hàng
const updateCartTotal = (): void => {
  const cart = getCart();
  const subtotalElement = document.querySelector(".cart_total ul li:nth-child(1) .cart_total_price");
  const shippingElement = document.querySelector(".cart_total ul li:nth-child(2) .cart_total_price");
  const totalElement = document.querySelector(".cart_total ul li:nth-child(3) .cart_total_price");

  if (!subtotalElement || !shippingElement || !totalElement) return;

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 5 : 0;
  const total = subtotal + shipping;

  subtotalElement.textContent = `${subtotal.toLocaleString()} VND`;
  shippingElement.textContent = `${shipping.toLocaleString()} VND`;
  totalElement.textContent = `${total.toLocaleString()} VND`;
};
const updateCheckoutTotal = (): void => {
  // Lấy dữ liệu giỏ hàng
  const cart: CartItem[] = getCart();

  // Tính toán Subtotal, Shipping và Total
  const subtotal: number = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping: number = subtotal > 0 ? 5 : 0;
  const total: number = subtotal + shipping;

  // Tìm các phần tử DOM trên trang checkout
  const productListElement = document.querySelector<HTMLUListElement>(".cart_total ul");
  const subtotalElement = document.querySelector<HTMLDivElement>(".cart_total ul li:nth-child(3) .cart_total_price");
  const shippingElement = document.querySelector<HTMLDivElement>(".cart_total ul li:nth-child(4) .cart_total_price");
  const totalElement = document.querySelector<HTMLDivElement>(".cart_total ul li:nth-child(5) .cart_total_price");

  // Kiểm tra xem các phần tử cần thiết có tồn tại không
  if (!productListElement || !subtotalElement || !shippingElement || !totalElement) {
    console.error("Không tìm thấy các phần tử cần thiết trên DOM.");
    return;
  }

  // Cập nhật danh sách sản phẩm
  const productItemsHTML = cart.map(
    (item) => `
      <li class="d-flex flex-row align-items-center justify-content-start">
        <div class="cart_total_title">${item.name} x${item.quantity}</div>
        <div class="cart_total_price ml-auto">${(item.price * item.quantity).toLocaleString()} VND</div>
      </li>
    `
  ).join("");

  productListElement.innerHTML = `
    <li class="d-flex flex-row align-items-center justify-content-start">
      <div class="cart_total_title">Product</div>
      <div class="cart_total_price ml-auto">Total</div>
    </li>
    ${productItemsHTML}
    <li class="d-flex flex-row align-items-center justify-content-start">
      <div class="cart_total_title">Subtotal</div>
      <div class="cart_total_price ml-auto">${subtotal.toLocaleString()} VND</div>
    </li>
    <li class="d-flex flex-row align-items-center justify-content-start">
      <div class="cart_total_title">Shipping</div>
      <div class="cart_total_price ml-auto">${shipping.toLocaleString()} VND</div>
    </li>
    <li class="d-flex flex-row align-items-start justify-content-start total_row">
      <div class="cart_total_title">Total</div>
      <div class="cart_total_price ml-auto">${total.toLocaleString()} VND</div>
    </li>
  `;

  // Cập nhật giá trị cho Subtotal, Shipping, và Total
  subtotalElement.textContent = `${subtotal.toLocaleString()} VND`;
  shippingElement.textContent = `${shipping.toLocaleString()} VND`;
  totalElement.textContent = `${total.toLocaleString()} VND`;
};

// 🟢 Hàm để fetch và hiển thị sản phẩm mới
const newPro = async (): Promise<void> => {
  try {
    const response = await fetch('http://localhost:5000/products?_limit=9');
    const products: Product[] = await response.json();

    const productsContainer = document.getElementById('newPro');
    if (!productsContainer) return; // Kiểm tra phần tử tồn tại

    let productsHTML = '';
    products.forEach((product: Product) => {
      productsHTML += `
        <div class="col-lg-4 product_col">
          <div class="product">
            <div class="product_image">
              <img src="images/${product.img}" alt="${product.name}">
            </div>
            <div class="rating rating_4">
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
            </div>
            <div class="product_content clearfix">
              <div class="product_info">
                <div class="product_name"><a href="product.html?id=${product.id}">${product.name}</a></div>
                <div class="product_price">${product.price.toLocaleString()} VND</div>
              </div>
              <div class="product_options">
                <div class="product_buy product_option" onclick="addToCart('${product.id}', '${product.name}', ${product.price}, '${product.img}', '${product.description}', ${product.hot}, ${product.idcate})">
                  <img src="images/shopping-bag-white.svg" alt="">
                </div>
                <div class="product_fav product_option">+</div>
              </div>
            </div>
          </div>
        </div>
      `;
    });

    productsContainer.innerHTML = productsHTML;
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

// 🟢 Hàm để fetch và hiển thị sản phẩm theo danh mục "Bag"
const showBag = async (): Promise<void> => {
  try {
    const response = await fetch('http://localhost:5000/products?idcate=1&_limit=3');
    const products: Product[] = await response.json();

    const productsContainer = document.getElementById('showBag');
    if (!productsContainer) return; // Kiểm tra phần tử tồn tại

    let productsHTML = '';
    products.forEach((product: Product) => {
      productsHTML += `
        <div class="col-lg-4 product_col">
          <div class="product">
            <div class="product_image">
              <img src="images/${product.img}" alt="${product.name}">
            </div>
            <div class="rating rating_4">
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
            </div>
            <div class="product_content clearfix">
              <div class="product_info">
                <div class="product_name"><a href="product.html?id=${product.id}">${product.name}</a></div>
                <div class="product_price">${product.price.toLocaleString()} VND</div>
              </div>
              <div class="product_options">
                <div class="product_buy product_option" onclick="addToCart('${product.id}', '${product.name}', ${product.price}, '${product.img}', '${product.description}', ${product.hot}, ${product.idcate})">
                  <img src="images/shopping-bag-white.svg" alt="">
                </div>
                <div class="product_fav product_option">+</div>
              </div>
            </div>
          </div>
        </div>
      `;
    });

    productsContainer.innerHTML = productsHTML;
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

// 🟢 Hàm để fetch và hiển thị sản phẩm theo danh mục "Sneakers"
const showSneakers = async (): Promise<void> => {
  try {
    const response = await fetch('http://localhost:5000/products?idcate=2&_limit=3');
    const products: Product[] = await response.json();

    const productsContainer = document.getElementById('showSneakers');
    if (!productsContainer) return; // Kiểm tra phần tử tồn tại

    let productsHTML = '';
    products.forEach((product: Product) => {
      productsHTML += `
        <div class="col-lg-4 product_col">
          <div class="product">
            <div class="product_image">
              <img src="images/${product.img}" alt="${product.name}">
            </div>
            <div class="rating rating_4">
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
            </div>
            <div class="product_content clearfix">
              <div class="product_info">
                <div class="product_name"><a href="product.html?id=${product.id}">${product.name}</a></div>
                <div class="product_price">${product.price.toLocaleString()} VND</div>
              </div>
              <div class="product_options">
                <div class="product_buy product_option" onclick="addToCart('${product.id}', '${product.name}', ${product.price}, '${product.img}', '${product.description}', ${product.hot}, ${product.idcate})">
                  <img src="images/shopping-bag-white.svg" alt="">
                </div>
                <div class="product_fav product_option">+</div>
              </div>
            </div>
          </div>
        </div>
      `;
    });

    productsContainer.innerHTML = productsHTML;
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

// 🟢 Hàm để fetch và hiển thị sản phẩm theo danh mục "Jacket"
async function showJacket(): Promise<void> {
  try {
    const response = await fetch('http://localhost:5000/products?idcate=3&_limit=3');
    const products: Product[] = await response.json();

    const productsContainer = document.getElementById('showJacket');
    if (!productsContainer) return; // Kiểm tra phần tử tồn tại

    let productsHTML = '';
    products.forEach((product: Product) => {
      productsHTML += `
        <div class="col-lg-4 product_col">
          <div class="product">
            <div class="product_image">
              <img src="images/${product.img}" alt="${product.name}">
            </div>
            <div class="rating rating_4">
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
            </div>
            <div class="product_content clearfix">
              <div class="product_info">
                <div class="product_name"><a href="product.html?id=${product.id}">${product.name}</a></div>
                <div class="product_price">${product.price.toLocaleString()} VND</div>
              </div>
              <div class="product_options">
                <div class="product_buy product_option" onclick="addToCart('${product.id}', '${product.name}', ${product.price}, '${product.img}', '${product.description}', ${product.hot}, ${product.idcate})">
                  <img src="images/shopping-bag-white.svg" alt="">
                </div>
                <div class="product_fav product_option">+</div>
              </div>
            </div>
          </div>
        </div>
      `;
    });

    productsContainer.innerHTML = productsHTML;
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}
async function showPro(): Promise<void> {
  try {
    const response = await fetch('http://localhost:5000/products');
    const products: Product[] = await response.json();

    const productsContainer = document.getElementById('showPro');
    if (!productsContainer) return; // Kiểm tra phần tử tồn tại

    let productsHTML = '';
    products.forEach((product: Product) => {
      productsHTML += `
          <div class="product">
							<div class="product_image"><img src="images/${product.img}" alt=""></div>
							<div class="rating rating_4" data-rating="4">
								<i class="fa fa-star"></i>
								<i class="fa fa-star"></i>
								<i class="fa fa-star"></i>
								<i class="fa fa-star"></i>
								<i class="fa fa-star"></i>
							</div>
							<div class="product_content clearfix">
								<div class="product_info">
									<div class="product_name"><a href="product.html?id=${product.id}">${product.name}</a></div>
									<div class="product_price">${product.price.toLocaleString()} VND</div>
								</div>
								<div class="product_options">
									<div class="product_buy product_option" onclick="addToCart('${product.id}', '${product.name}', ${product.price}, '${product.img}', '${product.description}', ${product.hot}, ${product.idcate})"><img src="images/shopping-bag-white.svg" alt=""></div>
									<div class="product_fav product_option">+</div>
								</div>
							</div>
						</div>
      `;
    });

    productsContainer.innerHTML = productsHTML;
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

// 🟢 Hàm để fetch và hiển thị chi tiết sản phẩm
const loadProductDetail = async (id: number | string): Promise<void> => {
  try {
    const response = await fetch(`http://localhost:5000/products/${id}`);
    const product: Product = await response.json();

    const productDetailContainer = document.querySelector('#loadDetail');
    if (!productDetailContainer) return;

    const productDetailHTML = `
        <div class="col-lg-7">
        <div class="product_image">
          <div class="product_image_large">
            <img src="images/${product.img}" alt="${product.name}">
          </div>
          <div class="product_image_thumbnails d-flex flex-row align-items-start justify-content-start">
            <div class="product_image_thumbnail" style="background-image:url(images/${product.img})" data-image="images/${product.img}"></div>
          </div>
        </div>
      </div>

      <div class="col-lg-5">
        <div class="product_content">
          <div class="product_name">${product.name}</div>
          <div class="product_price">${product.price.toLocaleString()}</div>
          <div class="rating rating_4" data-rating="4">
            <i class="fa fa-star"></i>
            <i class="fa fa-star"></i>
            <i class="fa fa-star"></i>
            <i class="fa fa-star"></i>
            <i class="fa fa-star"></i>
          </div>

          <div class="in_stock_container">
            <div class="in_stock ${product.hot ? 'in_stock_true' : 'in_stock_false'}"></div>
            <span>${product.hot ? 'Hot Product' : 'Regular Product'}</span>
          </div>
          <div class="product_text">
            <p>${product.description}</p>
          </div>

          <div class="product_quantity_container">
            <span>Quantity</span>
            <div class="product_quantity clearfix">
              <input type="number" id="quantity" value="1" min="1">
              <div class="quantity_buttons">
                <div id="quantity_inc_button" class="quantity_inc quantity_control">
                  <i class="fa fa-caret-up" aria-hidden="true"></i>
                </div>
                <div id="quantity_dec_button" class="quantity_dec quantity_control">
                  <i class="fa fa-caret-down" aria-hidden="true"></i>
                </div>
              </div>
            </div>
          </div>

          <div class="product_size_container">
            <span>Size</span>
            <div class="product_size">
              <ul class="d-flex flex-row align-items-start justify-content-start">
                <li><input type="radio" id="radio_1" name="product_radio" class="regular_radio radio_1"><label for="radio_1">XS</label></li>
                <li><input type="radio" id="radio_2" name="product_radio" class="regular_radio radio_2" checked><label for="radio_2">S</label></li>
                <li><input type="radio" id="radio_3" name="product_radio" class="regular_radio radio_3"><label for="radio_3">M</label></li>
                <li><input type="radio" id="radio_4" name="product_radio" class="regular_radio radio_4"><label for="radio_4">L</label></li>
                <li><input type="radio" id="radio_5" name="product_radio" class="regular_radio radio_5"><label for="radio_5">XL</label></li>
              </ul>
            </div>
                <div >
                  <button class="button cart_button" onclick="addToCart('${product.id}', '${product.name}', ${product.price}, '${product.img}', '${product.description}', ${product.hot}, ${product.idcate})">Add to cart🛒</button>
                </div>
          </div>
        </div>
      </div>
    `;
    productDetailContainer.innerHTML = productDetailHTML;
  } catch (error) {
    console.error('Error loading product detail:', error);
  }
};


// hiển thị sản phẩm trên icon giỏ hàng
const updateCartIcon = (): void => {
  const cart = getCart();
  const cartNum = document.querySelector(".cart_num");

  if (cartNum) {
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    cartNum.textContent = totalItems.toString();
  }
};

// Gắn sự kiện vào biểu tượng giỏ hàng
const cartIcon = document.querySelector(".cart");
if (cartIcon) {
  cartIcon.addEventListener("click", () => {
    window.location.href = "cart.html"; // Điều hướng tới trang giỏ hàng
  });
}

// Kiểm tra trạng thái đăng nhập từ localStorage khi tải trang
document.addEventListener("DOMContentLoaded", () => {
  const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
  const storedCurrentUser = localStorage.getItem("currentUser");

  if (storedIsLoggedIn === "true" && storedCurrentUser) {
      isLoggedIn = true;
      currentUser = JSON.parse(storedCurrentUser) as User;

      // Hiển thị thông tin người dùng
      const userElement = document.querySelector(".user") as HTMLElement;
      userElement.innerHTML = `
          <li><span>Chào ${currentUser.username}</span></li>
          <li><button id="logout-btn">Đăng xuất</button></li>
      `;

      const logoutBtn = document.getElementById("logout-btn") as HTMLButtonElement;
      logoutBtn.addEventListener("click", () => {
          alert("Đã đăng xuất");
          isLoggedIn = false;
          currentUser = null;
          localStorage.clear();
          window.location.reload();
      });
  }
});

// Đăng ký
const registerModal = document.getElementById("register-modal") as HTMLElement | null;
const registerBtn = document.getElementById("register-btn") as HTMLButtonElement | null;
const closeRegister = document.getElementById("close-register") as HTMLButtonElement | null;
const registerForm = document.getElementById("register-form") as HTMLFormElement | null;

registerBtn?.addEventListener("click", () => {
  registerModal!.style.display = "block";
});

closeRegister?.addEventListener("click", () => {
  registerModal!.style.display = "none";
});

registerForm?.addEventListener("submit", async (e: SubmitEvent) => {
  e.preventDefault();

  const formData = new FormData(registerForm);
  const data: Record<string, string> = {};
  formData.forEach((value, key) => {
      data[key] = value as string;
  });

  if (data.password !== data.confirmPassword) {
      alert("Mật khẩu và xác nhận mật khẩu không khớp");
      return;
  }

  try {
      const emailCheckResponse = await fetch(`http://localhost:5000/users?email=${data.email}`);
      const existingUsers = await emailCheckResponse.json();

      if (existingUsers.length > 0) {
          alert("Email đã tồn tại. Vui lòng sử dụng email khác hoặc đăng nhập.");
          return;
      }

      const response = await fetch("http://localhost:5000/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
              username: data.username,
              email: data.email,
              password: data.password,
              role: "user",
          }),
      });

      if (!response.ok) throw new Error("Đăng ký thất bại");

      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      registerModal!.style.display = "none";
      loginModal!.style.display = "block";
  } catch (error) {
      console.error("Lỗi đăng ký:", error);
      alert("Đăng ký thất bại");
  }
});

// Đăng nhập
const loginModal = document.getElementById("login-modal") as HTMLElement | null;
const loginBtn = document.getElementById("login-btn") as HTMLButtonElement | null;
const closeLogin = document.getElementById("close-login") as HTMLButtonElement | null;
const loginForm = document.getElementById("login-form") as HTMLFormElement | null;
const toRegisterLink = document.getElementById("to-register") as HTMLAnchorElement | null;

toRegisterLink?.addEventListener("click", (e: MouseEvent) => {
  e.preventDefault();
  loginModal!.style.display = "none";
  registerModal!.style.display = "block";
});

loginBtn?.addEventListener("click", () => {
  loginModal!.style.display = "block";
});

closeLogin?.addEventListener("click", () => {
  loginModal!.style.display = "none";
});

loginForm?.addEventListener("submit", async (e: SubmitEvent) => {
  e.preventDefault();

  const formData = new FormData(loginForm);
  const data: Record<string, string> = {};
  formData.forEach((value, key) => {
      data[key] = value as string;
  });

  try {
      const response = await fetch(`http://localhost:5000/users?email=${data.email}&password=${data.password}`);
      const users: User[] = await response.json();

      if (users.length > 0) {
          const user = users[0];
          isLoggedIn = true;
          currentUser = user;

          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("currentUser", JSON.stringify(user));

          alert(`Đăng nhập thành công với tư cách ${user.role === "admin" ? "Admin" : "User"}`);

          if (user.role === "admin") {
              window.location.href = "admin.html";
          } else {
              loginModal!.style.display = "none";
              window.location.reload();
          }
      } else {
          alert("Email hoặc mật khẩu không chính xác");
      }
  } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      alert("Đăng nhập thất bại");
  }
});
// Gắn sự kiện click vào tên người dùng
const userNameElement = document.getElementById("user-name") as HTMLElement;
userNameElement.addEventListener("click", () => {
    if (currentUser) {
        // Lưu thông tin người dùng vào localStorage
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        // Chuyển hướng đến trang thông tin người dùng
        window.location.href = "user-info.html";
    }
});

// Khởi tạo DOMContentLoaded
document.addEventListener("DOMContentLoaded", async () => {
  // Lấy thông tin người dùng từ localStorage
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null") as User | null;

  // DOM các phần tử
  const userName = document.getElementById("user-name");
  const userEmail = document.getElementById("user-email");
  const userRole = document.getElementById("user-role");
  const ordersBody = document.getElementById("orders-body");
  const emptyOrders = document.getElementById("empty-orders");

  // Kiểm tra người dùng đăng nhập
  if (!currentUser) {
    // alert("Bạn cần đăng nhập để xem thông tin.");
    // loginModal!.style.display = "block";
    return;
  }

  // Hiển thị thông tin người dùng
  if (userName && userEmail && userRole) {
    userName.textContent = currentUser.username;
    userEmail.textContent = currentUser.email;
    userRole.textContent = currentUser.role === "admin" ? "Quản trị viên" : "Người dùng";
  } else {
    console.error("Không tìm thấy phần tử thông tin người dùng.");
  }

  // Tải và hiển thị danh sách đơn hàng
  if (ordersBody && emptyOrders) {
    try {
      const response = await fetch("http://localhost:5000/orders");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const orders: Order[] = await response.json();

      // Lọc đơn hàng của người dùng hiện tại
      const userOrders = orders.filter((order) => order.customer.email === currentUser.email);

      if (userOrders.length > 0) {
        emptyOrders.style.display = "none"; // Ẩn thông báo "Không có đơn hàng"
        userOrders.forEach((order) => {
          const row = document.createElement("tr");

          const total = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

          row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.items.map((item) => item.name).join(", ")}</td>
            <td>${order.items.map((item) => item.quantity).join(", ")}</td>
            <td>${order.items.map((item) => `$${item.price}`).join(", ")}</td>
            <td>$${total.toFixed(2)}</td>
          `;
          ordersBody.appendChild(row);
        });
      } else {
        emptyOrders.style.display = "block"; // Hiển thị thông báo "Không có đơn hàng"
      }
    } catch (error) {
      const errorMessage = (error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định.");
  console.error("Lỗi tải dữ liệu đơn hàng:", errorMessage);
  emptyOrders.textContent = errorMessage;
  emptyOrders.style.display = "block";
    }
  } else {
    console.error("Không tìm thấy phần tử bảng đơn hàng.");
  }
});

window.onload = () => {
  // Gọi hàm load chi tiết sản phẩm nếu có id trong URL
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  if (productId) {
    loadProductDetail(productId);
  }

  // json-server --watch db.json --port 5000
  // Gọi các hàm hiển thị sản phẩm
  newPro();
  showBag();
  showSneakers();
  showJacket();
  showPro();
  loadOrders();
};
// 🟢 Khởi tạo sự kiện
window.addEventListener("DOMContentLoaded", () => {
  displayCart();
  updateCartIcon();
  updateCheckoutTotal();
});
