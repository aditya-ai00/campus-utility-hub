let timerInterval;
let countdownInterval;
let tasks = [];
let totalExpense = 0;
let waterCount = 0;
const waterGoal = 8;

let autoThemeEnabled = false;

/* ===============================
   PAGE SWITCHING
================================= */

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

/* ===============================
   MANUAL THEME SWITCH
================================= */

function changeTheme() {

    if (autoThemeEnabled) return;

    let theme = document.getElementById('bgTheme').value;

    document.body.classList.remove("gradient","blue","purple","dark","mac");
    document.body.classList.add(theme);

    localStorage.setItem("campusTheme", theme);
}

/* ===============================
   AUTO THEME TOGGLE
================================= */

function toggleAutoTheme() {

    const toggle = document.getElementById("autoThemeToggle");
    const selector = document.getElementById("bgTheme");

    autoThemeEnabled = toggle.checked;

    if (autoThemeEnabled) {

        selector.disabled = true;
        applySystemTheme();

    } else {

        selector.disabled = false;

        const savedTheme = localStorage.getItem("campusTheme");

        if (savedTheme) {
            document.body.classList.remove("gradient","blue","purple","dark","mac");
            document.body.classList.add(savedTheme);
        }
    }
}

/* ===============================
   SYSTEM THEME DETECTION
================================= */

function applySystemTheme() {

    if (!autoThemeEnabled) return;

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    document.body.classList.remove("gradient","blue","purple","dark","mac");

    if (prefersDark) {
        document.body.classList.add("dark");
    } else {
        document.body.classList.add("mac");
    }
}

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    applySystemTheme();
});

/* ===============================
   CGPA CALCULATOR
================================= */

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

    const summary = document.getElementById("summaryCGPA");
    if (summary) summary.innerText = cgpa.toFixed(2);
}

function resetCGPA() {

    g1El().value = "";
    g2El().value = "";
    g3El().value = "";

    result("cgpaResult", "");

    const summary = document.getElementById("summaryCGPA");
    if (summary) summary.innerText = "--";
}

/* ===============================
   SMART ATTENDANCE PREDICTOR
================================= */

function calculateAttendance() {

    let total = Number(document.getElementById("total").value);
    let attended = Number(document.getElementById("attended").value);
    let remaining = Number(document.getElementById("remaining").value);

    if (total <= 0 || attended > total) {

        result("attendanceResult","Invalid input");
        document.getElementById("attendanceAdvice").innerText = "";
        document.getElementById("attendanceFuture").innerText = "";
        return;
    }

    let percent = (attended / total) * 100;
    let status = percent >= 75 ? "Safe ✅" : "Shortage ⚠️";

    result("attendanceResult", percent.toFixed(2) + "% — " + status);

    const summary = document.getElementById("summaryAttendance");
    if (summary) summary.innerText = percent.toFixed(1) + "%";

    const required = 0.75;

    if (percent < 75) {

        let classesNeeded = Math.ceil((required * total - attended) / (1 - required));

        document.getElementById("attendanceAdvice").innerText =
        "Attend next " + classesNeeded + " classes to reach 75%";

    } else {

        let bunk = Math.floor((attended - required * total) / required);

        document.getElementById("attendanceAdvice").innerText =
        "You can skip next " + bunk + " classes safely";
    }

    /* future prediction */

    if (remaining > 0) {

        let maxAttendance = ((attended + remaining) / (total + remaining)) * 100;

        document.getElementById("attendanceFuture").innerText =
        "Maximum possible attendance this semester: " +
        maxAttendance.toFixed(2) + "%";
    }
}

function resetAttendance() {

    document.getElementById("total").value = "";
    document.getElementById("attended").value = "";
    document.getElementById("remaining").value = "";

    result("attendanceResult","");
    document.getElementById("attendanceAdvice").innerText = "";
    document.getElementById("attendanceFuture").innerText = "";

    const summary = document.getElementById("summaryAttendance");
    if (summary) summary.innerText = "--";
}

/* ===============================
   SEMESTER PLANNER
================================= */

function calculatePlanner(){

    let subjects = Number(document.getElementById("subjects").value);
    let target = Number(document.getElementById("targetCgpa").value);

    if(subjects <= 0 || target <= 0){

        result("plannerResult","Invalid input");
        return;
    }

    let required = target.toFixed(2);

    result(
        "plannerResult",
        "Average GPA required per subject: " + required
    );
}

function resetPlanner(){

    document.getElementById("subjects").value = "";
    document.getElementById("targetCgpa").value = "";

    result("plannerResult","");
}

/* ===============================
   EXAM COUNTDOWN
================================= */

function startCountdown() {

    clearInterval(countdownInterval);

    let date = new Date(document.getElementById("examDate").value);

    countdownInterval = setInterval(() => {

        let now = new Date();
        let diff = date - now;

        if (diff <= 0) {

            result("countdownResult","Exam Day 🎉");
            clearInterval(countdownInterval);
            return;
        }

        let d = Math.floor(diff/(1000*60*60*24));
        let h = Math.floor((diff/(1000*60*60))%24);
        let m = Math.floor((diff/(1000*60))%60);

        result("countdownResult",`${d}d ${h}h ${m}m left`);

    },1000);
}

function resetCountdown(){

    clearInterval(countdownInterval);
    document.getElementById("examDate").value = "";
    result("countdownResult","");
}

/* ===============================
   STUDY TIMER
================================= */

function startTimer(){

    clearInterval(timerInterval);

    let minutes = Number(document.getElementById("timerMinutes").value);
    if(!minutes || minutes <=0) minutes = 25;

    let time = minutes * 60;

    timerInterval = setInterval(()=>{

        let min = Math.floor(time/60);
        let sec = time % 60;

        result("timerResult", min + ":" + (sec<10?"0":"") + sec);

        time--;

        if(time<0){
            clearInterval(timerInterval);
            result("timerResult","Break Time ☕");
        }

    },1000);
}

function resetTimer(){

    clearInterval(timerInterval);

    document.getElementById("timerMinutes").value="";
    result("timerResult","25:00");
}

/* ===============================
   HELPER FUNCTIONS
================================= */

function result(id,text){
    document.getElementById(id).innerText = text;
}

function g1El(){ return document.getElementById("g1"); }
function g2El(){ return document.getElementById("g2"); }
function g3El(){ return document.getElementById("g3"); }

/* ===============================
   EXPENSE TRACKER
================================= */

function addExpense(){

    let amount = Number(document.getElementById("expenseAmount").value);
    if(amount<=0) return;

    totalExpense += amount;

    document.getElementById("expenseResult").innerText =
    "Total: ₹" + totalExpense;

    document.getElementById("expenseAmount").value="";

    const summary = document.getElementById("summaryExpense");
    if(summary) summary.innerText = "₹"+totalExpense;
}

function resetExpense(){

    totalExpense = 0;

    document.getElementById("expenseAmount").value="";
    document.getElementById("expenseResult").innerText="Total: ₹0";

    const summary = document.getElementById("summaryExpense");
    if(summary) summary.innerText = "₹0";
}

/* ===============================
   WATER TRACKER
================================= */

function addWater(){

    if(waterCount < waterGoal) waterCount++;

    document.getElementById("waterResult").innerText =
    waterCount + " / " + waterGoal + " glasses";

    if(waterCount === waterGoal){
        document.getElementById("waterResult").innerText += " ✅";
    }
}

function resetWater(){

    waterCount = 0;
    document.getElementById("waterResult").innerText="0 / 8 glasses";
}

/* ===============================
   TASK MANAGER
================================= */

function addTask(){

    let input = document.getElementById("taskInput");
    let taskName = input.value.trim();

    if(!taskName) return;

    tasks.push({
        id: Date.now(),
        name: taskName,
        completed:false
    });

    input.value="";
    renderTasks();
}

function toggleTask(id){

    let task = tasks.find(t=>t.id===id);

    if(task){
        task.completed = !task.completed;
        renderTasks();
    }
}

function deleteTask(id){

    tasks = tasks.filter(t=>t.id !== id);
    renderTasks();
}

function renderTasks(){

    let list = document.getElementById("taskList");
    let emptyMsg = document.getElementById("emptyMessage");

    if(!list || !emptyMsg) return;

    let completed = tasks.filter(t=>t.completed).length;
    let pending = tasks.length - completed;

    list.innerHTML="";

    if(tasks.length===0){

        emptyMsg.style.display="block";

    }else{

        emptyMsg.style.display="none";

        tasks.forEach(task=>{

            let div = document.createElement("div");
            div.className="task-item"+(task.completed?" completed":"");

            let checkbox=document.createElement("input");
            checkbox.type="checkbox";
            checkbox.checked=task.completed;
            checkbox.onchange=()=>toggleTask(task.id);

            let label=document.createElement("label");
            label.textContent=task.name;
            label.onclick=()=>toggleTask(task.id);

            let btn=document.createElement("button");
            btn.textContent="Delete";
            btn.onclick=()=>deleteTask(task.id);

            div.appendChild(checkbox);
            div.appendChild(label);
            div.appendChild(btn);

            list.appendChild(div);
        });
    }

    document.getElementById("totalTasks").innerText = tasks.length;
    document.getElementById("completedTasks").innerText = completed;
    document.getElementById("pendingTasks").innerText = pending;

    const summary = document.getElementById("summaryTasks");
    if(summary) summary.innerText = pending;
}

/* ===============================
   RESET TASKS
================================= */

function resetTasks(){

    if(tasks.length===0) return;

    if(confirm("Are you sure you want to clear all tasks?")){
        tasks=[];
        renderTasks();
    }
}

/* ===============================
   INITIAL LOAD
================================= */

window.onload = function(){

    renderTasks();

    const toggle = document.getElementById("autoThemeToggle");

    if(toggle && toggle.checked){
        toggleAutoTheme();
    }

    if(typeof lucide !== "undefined"){
        lucide.createIcons();
    }
};
