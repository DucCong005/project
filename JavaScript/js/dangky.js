function checkSignupForm(event) {
    // Lấy giá trị của các trường đầu vào
    var username = document.getElementById('newUsername').value.trim();
    var password = document.getElementById('newPassword').value.trim();
    var confirmPassword = document.getElementById('confirmPassword').value.trim();
    
    // Kiểm tra xem các trường đã được nhập hay chưa
    if (username === "") {
        alert("Hãy nhập tên đăng ký!");
        return false;
    }
    if (password === "") {
        alert("Hãy nhập mật khẩu!");
        return false;
    }
    if (confirmPassword === "") {
        alert("Hãy nhập lại mật khẩu!");
        return false;
    }

    // Kiểm tra xem mật khẩu đã được nhập đúng không
    if (password !== confirmPassword) {
        alert("Mật khẩu nhập lại không khớp!");
        return false;
    }
    
    // Ngăn chặn hành động mặc định của biểu mẫu
    // event.preventDefault();
    
    // Nếu tất cả các điều kiện đều đúng, chuyển hướng trang hoặc thực hiện hành động khác
    // Ví dụ: window.location.href = "dangnhap.html";
    
    // Trả về true để submit biểu mẫu
    window.location.href = "dangnhap.html";
    return true;
}
