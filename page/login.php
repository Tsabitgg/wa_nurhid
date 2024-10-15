<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/png" href="../assets/img/Logo_512.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet">
    <link href="../src/output.css" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <title>Login</title>
</head>
<body class="h-full bg-slate-400 font-inter">
    <div id="notification" class="fixed top-4 right-4 z-50"></div>
    <div class="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="w-full max-w-md bg-white border border-gray-300 rounded-lg shadow-lg p-6">
            <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                <div class="flex items-center justify-center space-x-3">
                    <img class="h-12 w-auto" src="../assets/img/Logo_512.png" alt="Your Company">
                    <span class="text-lg font-bold">SEND WHATSAPP</span>
                </div>
                <h2 class="mt-10 text-center text-2xl font-semibold leading-9 tracking-tight text-gray-900">Sign in to your account</h2>
            </div>
            
            <div class="mt-7 sm:mx-auto sm:w-full sm:max-w-sm">
                <form class="space-y-6" action="../Config/auth.php" method="POST" onsubmit="handleSubmit(event)">
                    <div>
                        <label for="username" class="block text-sm font-medium leading-6 text-gray-900">Username</label>
                        <div class="mt-2">
                            <input id="username" name="username" required type="text" autocomplete="username" placeholder="username" class="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                        </div>
                    </div>
                    
                    <div>
                        <div class="flex items-center justify-between">
                            <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
                        </div>
                        <div class="mt-2">
                            <input id="password" name="password" required type="password" autocomplete="current-password" placeholder="password" class="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                        </div>
                        <!-- <div class="mt-2 text-end text-blue-600 text-sm hover:underline">
                            <a href="resetPassword.php">Lupa Password ?</a>
                        </div> -->

                    </div>

                    <div>
                        <button id="loginButton" type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 mb-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign in</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <script src="../js/scriptLogin.js">
    </script>
</body>
</html>
