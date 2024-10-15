<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet">
    <link href="../src/output.css" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <title>Reset password</title>
</head>
<body class="h-full bg-slate-400 font-inter">
    <div id="notification" class="fixed top-4 right-4 z-50"></div>
    <div class="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="w-full max-w-md bg-white border border-gray-300 rounded-lg shadow-lg p-6">
            <div class="ml-1 font-semibold flex items-center">
                <a href="login.php" class="text-blue-500 flex items-center text-sm hover:underline">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 mr-1">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                back
                </a>

            </div>
            <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 class="mt-3 text-center text-xl font-semibold leading-9 tracking-tight text-gray-900">Reset Password</h2>
            </div>
            
            <div class="mt-3 sm:mx-auto sm:w-full sm:max-w-sm">
                <form class="space-y-6" action="../Config/auth.php" method="POST" onsubmit="handleSubmit(event)">
                    <div>
                        <label for="username" class="block text-sm font-medium leading-6 text-gray-900">Username</label>
                        <div class="mt-2">
                            <input id="username" name="username" required type="text" autocomplete="username" placeholder="username" class="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                        </div>
                    </div>
                    
                    <div>
                        <div class="flex items-center justify-between">
                            <label for="password" class="block text-sm font-medium leading-6 text-gray-900">New Password</label>
                        </div>
                        <div class="mt-2">
                            <input id="password" name="password" required type="password" autocomplete="current-password" placeholder="password" class="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                        </div>
                    </div>

                    <div>
                        <button id="loginButton" type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 mb-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Ganti password</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <script src="../js/script.js">
    </script>
</body>
</html>
