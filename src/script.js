let timerInterval;
let countdownInterval;

/* CGPA */
function calculateCGPA() {
    let g1 = Number(g1El().value);
    let g2 = Number(g2El().value);
    let g3 = Number(g3El().value);

    if (!g1 || !g2 || !g3) {
        result("cgpaResult", "Enter all GPA values");
        return;
    }

    let cgpa = (g1 + g2 + g3) / 3;
    result("cgpaResult", "CGPA: " + cgpa.toFixed(2));
}

function resetCGPA() {
    g1El().value = "";
    g2El().value = "";
    g3El().value = "";
    result("cgpaResult", "");
}

/* Attendance */
function calculateAttendance() {
    let total = Number(document.getElementById("total").value);
    let attended = Number(document.getElementById("attended").value);

    if (total <= 0 || attended > total) {
        result("attendanceResult", "Invalid input");
        return;
    }

    let percent = (attended / total) * 100;
    let status = percent >= 75 ? "Safe ✅" : "Shortage ⚠️";

    result(
        "attendanceResult",
        percent.toFixed(2) + "% — " + status
    );
}

function resetAttendance() {
    document.getElementById("total").value = "";
    document.getElementById("attended").value = "";
    result("attendanceResult", "");
}

/* Countdown */
function startCountdown() {
    clearInterval(countdownInterval);

    let date = new Date(document.getElementById("examDate").value);

    countdownInterval = setInterval(() => {
        let now = new Date();
        let diff = date - now;

        if (diff <= 0) {
            result("countdownResult", "Exam Day 🎉");
            clearInterval(countdownInterval);
            return;
        }

        let d = Math.floor(diff / (1000 * 60 * 60 * 24));
        let h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        let m = Math.floor((diff / (1000 * 60)) % 60);

        result("countdownResult", `${d}d ${h}h ${m}m left`);
    }, 1000);
}

function resetCountdown() {
    clearInterval(countdownInterval);
    document.getElementById("examDate").value = "";
    result("countdownResult", "");
}

/* Pomodoro */
function startTimer() {
    clearInterval(timerInterval);
    let time = 25 * 60;

    timerInterval = setInterval(() => {
        let min = Math.floor(time / 60);
        let sec = time % 60;

        result(
            "timerResult",
            min + ":" + (sec < 10 ? "0" : "") + sec
        );

        time--;

        if (time < 0) {
            clearInterval(timerInterval);
            result("timerResult", "Break Time ☕");
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
    result("timerResult", "25:00");
}

/* Helpers */
function result(id, text) {
    document.getElementById(id).innerText = text;
}

function g1El(){ return document.getElementById("g1"); }
function g2El(){ return document.getElementById("g2"); }
function g3El(){ return document.getElementById("g3"); }

/* ==========================
   EXPENSE TRACKER
========================== */

let totalExpense = 0;

function addExpense() {
    let amount = Number(document.getElementById("expenseAmount").value);

    if (amount <= 0) return;

    totalExpense += amount;

    document.getElementById("expenseResult").innerText =
        "Total: ₹" + totalExpense;

    document.getElementById("expenseAmount").value = "";
}

function resetExpense() {
    totalExpense = 0;
    document.getElementById("expenseAmount").value = "";
    document.getElementById("expenseResult").innerText = "Total: ₹0";
}

/* ==========================
   WATER TRACKER
========================== */

let waterCount = 0;
const waterGoal = 8;

function addWater() {
    if (waterCount < waterGoal) {
        waterCount++;
    }

    document.getElementById("waterResult").innerText =
        waterCount + " / " + waterGoal + " glasses";

    if (waterCount === waterGoal) {
        document.getElementById("waterResult").innerText += " ✅";
    }
}

function resetWater() {
    waterCount = 0;
    document.getElementById("waterResult").innerText =
        "0 / 8 glasses";
}

/*Change Time*/
function changeTheme() {
    let theme = document.getElementById('bgTheme').value;
    document.body.className = theme;
}