
// -------------------- EmailJS Init --------------------
(function () {
    emailjs.init("6aW5MFWnKe3B9E4mW");
})();

let generatedOTP = "";

    // -------------------- SEND OTP --------------------
    function sendOTP() {
        const email = document.getElementById("email").value.trim();
        const msg = document.getElementById("msg");

        if (!email) {
            msg.innerText = "Please enter email!";
            return;
        }

        generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();

        const expiryTime = new Date(Date.now() + 15 * 60000).toLocaleTimeString();

        const params = {
            user_email: email,
            passcode: generatedOTP,
            time: expiryTime
        };

        emailjs.send("service_2fn7tzv", "template_at93rja", params)
            .then(() => {
            msg.style.color = "green";
            msg.innerText = "OTP sent to your email!";
            document.getElementById("step2").style.display = "block";
            document.getElementById("boxy").style.display = "none";
        })
        .catch(error => {
            msg.style.color = "red";
            msg.innerText = "Failed to send OTP!";
            console.error(error);
        });
    }

    document.getElementById("sendOtp").addEventListener("click", sendOTP);

    // -------------------- FIREBASE SETUP --------------------
    const firebaseConfig = {
        apiKey: "AIzaSyBUPXbKjKybtj5w9wYUKLj8F1WbDnwI_PE",
        authDomain: "myfirstproject-a9bd5.firebaseapp.com",
        databaseURL: "https://myfirstproject-a9bd5-default-rtdb.firebaseio.com",
        projectId: "myfirstproject-a9bd5",
        storageBucket: "myfirstproject-a9bd5.appspot.com",
        messagingSenderId: "565178101938",
        appId: "1:565178101938:web:36cde7a47e08b2e79a59ab"
    };

    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.database();


    // -------------------- VERIFY OTP --------------------
    function verifyOTP() {
        const otpEntered = document.getElementById("otpInput").value.trim();
        const msg = document.getElementById("message");

        if (otpEntered === generatedOTP) {
            document.getElementById("otpInput").style.display = "none";
            document.getElementById("verifyguddu").style.display = "none";
            // document.getElementById("message").style.display = "block";
            msg.style.display = "block";
            msg.style.color = "green";
            msg.innerHTML = "<b>OTP Verified ✔</b>";

            // OTP correct → Signup start
            signup();
            setTimeout(() => {
                window.location.href = "quiz.html"; 
            }, 1000);

        } else {
            msg.style.color = "red";
            msg.innerHTML = "<b>Invalid OTP</b>";
        }
    }

    document.getElementById("verifyguddu").addEventListener("click", verifyOTP);


    // -------------------- SIGNUP FUNCTION --------------------
    function signup() {
        let name = document.getElementById("name").value.trim();
        let email = document.getElementById("email").value.trim();
        let gender = document.getElementById("gender").value.trim();
        let age = document.getElementById("age").value.trim();
        let dob = document.getElementById("dob").value;
        let password = document.getElementById("password").value.trim();
        let msg = document.getElementById("msg");

        if (!name || !email || !gender || !age || !dob || !password) {
            msg.style.color = "red";
            msg.innerText = "Please fill all fields!";
            return;
        }

        auth.createUserWithEmailAndPassword(email, password)
        .then(cred => {
            const user = cred.user;

            db.ref("users/" + user.uid).set({
                name,
                email,
                gender,
                age,
                dob,
                verified: true
            });

            // REDIRECT HERE (NEXT HTML FILE)
            setTimeout(() => {
                window.location.href = "quiz.html"; // ← अपनी file का नाम डालो
            }, 1200);

        })
        .catch(error => {
            msg.style.color = "red";
            msg.innerText = error.message;
        });
    }

    /*=========================
      Sign In function for user 
      =========================
    */

    function signin() {
        let email = document.getElementById("login_email").value.trim();
        let password = document.getElementById("login_password").value.trim();
        let msg = document.getElementById("login_msg");

        if (!email || !password) {
        msg.style.color = "red";
        msg.innerText = "Please enter email and password!";
        return;
        }

        auth.signInWithEmailAndPassword(email, password)
        .then(cred => {
            const user = cred.user;

            // Fetch additional user data
            db.ref("users/" + user.uid).once("value")
            .then(snapshot => {
                if (snapshot.exists()) {

                    msg.style.color = "green";
                    msg.innerText = "Login successful! Redirecting...";

                    // Redirect to next page
                    setTimeout(() => {
                        window.location.href = "quiz.html"; // ← Apni file ka naam daalo
                    }, 1200);

                } else {
                    msg.style.color = "red";
                    msg.innerText = "Account data not found!";
                }
            });

        })
        .catch(error => {
            msg.style.color = "red";
            msg.innerText = error.message;
        });
    }

    /*========================
      forgot password function
      ========================
    */

    function forgotPassword() {
        let email = document.getElementById("login_email").value.trim();
        let msg = document.getElementById("login_msg");

        if (!email) {
            msg.style.color = "red";
            msg.innerText = "Please enter your email first!";
            return;
        }

        auth.sendPasswordResetEmail(email)
        .then(() => {
            msg.style.color = "green";
            msg.innerText = "Password reset link sent to your email!";
        })
        .catch(error => {
            msg.style.color = "red";
            msg.innerText = error.message;
        });
    }

    // Show SignUp Box
    function SignUp() {
        document.getElementById("signIn-box").style.display = "none";
        document.getElementById("signUp-box").style.display = "block";
    }

    // Show SignIn Box
    function SignIn() {
        document.getElementById("signIn-box").style.display = "block";
        document.getElementById("signUp-box").style.display = "none";
    }


    /*===========================================
      show and hide password function in sign in 
      ===========================================
    */
    const pass = document.getElementById("login_password");
    const toggle = document.getElementById("togglePassword");
    toggle.addEventListener("click", () => {
        if (pass.type === "password") {
            pass.type = "text";
            toggle.src = "image/showEye.png";   // open eye icon
        } else {
            pass.type = "password";
            toggle.src = "image/hideEye.png";        // closed eye icon
        }
    });

    /*===========================================
      show and hide password function in sign Up 
      ===========================================
    */

    const pass2 = document.getElementById("password2");
    const toggle2 = document.getElementById("togglePassword2")
    toggle2.addEventListener("click", ()=>{
        if (pass2.type === "password") {
            pass2.type = "text";
            toggle2.src = "image/showEye.png";   // open eye icon
        } else {
            pass2.type = "password";
            toggle2.src = "image/hideEye.png";        // closed eye icon
        }
    });