function checkLoginForm(event) {
    var username = document.getElementById('username').value.trim();
    var password = document.getElementById('password').value.trim();
    
    if (username === "") {
        alert("Hãy nhập tên đăng nhập!");
        return false;
    }
    if (password === "") {
        alert("Hãy nhập mật khẩu!");
        return false;
    }
    // Ngăn chặn hành động mặc định của nút
    // event.preventDefault();
    
    // Chuyển hướng trang
    window.location.href = "index.html";
    return true;
}
