let timerInterval;
let countdownInterval;
let tasks = [];
let totalExpense = 0;
let waterCount = 0;
const waterGoal = 8;

function showTaskPage() {
    document.getElementById('mainPage').style.display = 'none';
    document.getElementById('taskPage').style.display = 'block';
    window.scrollTo(0, 0);
}

function showMainPage() {
    document.getElementById('taskPage').style.display = 'none';
    document.getElementById('mainPage').style.display = 'block';
    window.scrollTo(0, 0);
}

function changeTheme() {
    let theme = document.getElementById('bgTheme').value;
    document.body.className = theme;
}

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

function startTimer() {
    clearInterval(timerInterval);
    
    let minutes = Number(document.getElementById("timerMinutes").value);
    
    if (!minutes || minutes <= 0) {
        minutes = 25;
    }
    
    let time = minutes * 60;

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
    document.getElementById("timerMinutes").value = "";
    result("timerResult", "25:00");
}

function result(id, text) {
    document.getElementById(id).innerText = text;
}

function g1El(){ return document.getElementById("g1"); }
function g2El(){ return document.getElementById("g2"); }
function g3El(){ return document.getElementById("g3"); }

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

function addTask() {
    let input = document.getElementById("taskInput");
    let taskName = input.value.trim();

    if (!taskName) return;

    tasks.push({
        id: Date.now(),
        name: taskName,
        completed: false
    });

    input.value = "";
    renderTasks();
}

function toggleTask(id) {
    let task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        renderTasks();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    renderTasks();
}

function renderTasks() {
    let list = document.getElementById("taskList");
    let emptyMsg = document.getElementById("emptyMessage");
    
    if (!list || !emptyMsg) return;
    
    let completed = tasks.filter(t => t.completed).length;
    let pending = tasks.length - completed;

    list.innerHTML = "";

    if (tasks.length === 0) {
        emptyMsg.style.display = "block";
    } else {
        emptyMsg.style.display = "none";

        tasks.forEach(task => {
            let div = document.createElement("div");
            div.className = "task-item" + (task.completed ? " completed" : "");

            let checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = task.completed;
            checkbox.onchange = () => toggleTask(task.id);

            let label = document.createElement("label");
            label.textContent = task.name;
            label.onclick = () => toggleTask(task.id);

            let btn = document.createElement("button");
            btn.textContent = "Delete";
            btn.onclick = () => deleteTask(task.id);

            div.appendChild(checkbox);
            div.appendChild(label);
            div.appendChild(btn);
            list.appendChild(div);
        });
    }

    document.getElementById("totalTasks").innerText = tasks.length;
    document.getElementById("completedTasks").innerText = completed;
    document.getElementById("pendingTasks").innerText = pending;
}

function resetTasks() {
    if (tasks.length === 0) return;
    
    if (confirm("Are you sure you want to clear all tasks?")) {
        tasks = [];
        renderTasks();
    }
}

window.onload = function() {
    renderTasks();
};
