<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Sign Up Form by Colorlib</title>

    <!-- Font Icon -->
    <link rel="stylesheet" href="public/auth/fonts/material-icon/css/material-design-iconic-font.min.css">

    <!-- Main css -->
    <link rel="stylesheet" href="public/auth/css/style.css">
</head>
<body>
    <div class="main">
        <!-- Sing in Form -->
        <section class="sign-in">
            <div class="container">
                <div class="signin-content">
                    <div class="signin-image">
                        <figure><img src="public/auth/images/signin-image.jpg" alt="sing up image"></figure>
                        <a href="<?=$baseurl?>/register" class="signup-image-link" style="font-family: sans-serif;">Tạo tài khoản?</a>
                        <a href="<?=$baseurl?>" class="signup-image-link">Trở về trang chủ</a>
                    </div>
                    <div class="signin-form">
                        <h2 class="form-title" style="font-family: sans-serif;">Đăng nhập</h2>
                        <form method="POST" action="postlogin" class="register-form" id="login-form">
                        <div class="form-group">
                                <label for="your_name"><i class="zmdi zmdi-account material-icons-name"></i></label>
                                <input type="text" name="email" id="your_name" placeholder="Email" value="<?= $_POST['email'] ?? ""?>" readdir/>
                            </div>
                            <div class="form-group">
                                <label for="your_pass"><i class="zmdi zmdi-lock"></i></label>
                                <input type="password" name="password" id="your_pass" placeholder="Password" value="<?= $_POST['password'] ?? ""?>"readdir/>
                            </div>
                            <!-- Hiển thị thông báo lỗi nếu có -->
                            <div class="form-group">
                            <?php if(isset($errors) && count($errors)>0){?>
                            <ul>
                                <?php foreach($errors as $error){?>
                                    <li style="color:red">                                      
                                            <?php echo $error?>                                       
                                    </li>
                                <?php }?>
                            </ul>  
                            <?php }?>                            
                            </div>
                            <div class="form-group form-button">
                            <input type="submit" name="signin" id="signin" class="form-submit" value="Đăng nhập" style="font-family: sans-serif;"/>
                      
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    </div>
</body>
</html>
