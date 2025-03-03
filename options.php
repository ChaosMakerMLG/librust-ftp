<?php 
session_start();

if(empty($_SESSION['valid'])) {
    header('location:/');
    exit;
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
    <link href="/css/options.css" rel="stylesheet" />
    <link href="/css/global.css" rel="stylesheet" />
    <title>Opcje</title>
</head>
<body>
    <div id="main-wrapper">
        <div class="mini-wrapper" id="left" onclick="clickMe(this.id)">
            <div id="left">
                <i class='bx bxs-lock-open'>

                </i>
            </div>
        </div>
        <div class="mini-wrapper" id="right" onclick="clickMe(this.id)">
            <div id="right">
                <i class='bx bxs-user-plus' >
    
                </i>
            </div>
        </div>
    </div>
</body>
</html>
<script>
    setTimeout(() => {
        document.getElementById('main-wrapper').classList.add('active'); 
    }, 200);

    function clickMe(id) {

        const element = document.getElementById(id);

        element.classList.add('click');
    setTimeout(() => {
        element.classList.remove('click');
    }, 100);

    if(id == 'left') {
        setTimeout(() => {
            location.href = '/reset.php';
        }, 200);
    }
    else if(id == 'right') {
        setTimeout(() => {
            location.href = '/main.php';
        }, 200);
    }
    else {
        console.log('Something got fucked and you called a function from a nonexisting element');
        return;
    }
    }
</script>