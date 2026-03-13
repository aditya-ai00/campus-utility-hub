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
function calculatePI(){
let c1 = document.getElementById("credit1").value;
let g1 = document.getElementById("gpa1").value;
let c2 = document.getElementById("credit2").value;
let g2 = document.getElementById("gpa2").value;

let pi = ((c1*g1)+(c2*g2))/(Number(c1)+Number(c2));

document.getElementById("piResult").innerText = "PI: " + pi.toFixed(2);
}

function resetPI(){
document.getElementById("credit1").value="";
document.getElementById("gpa1").value="";
document.getElementById("credit2").value="";
document.getElementById("gpa2").value="";
document.getElementById("piResult").innerText="";
}
/* ===============================
   SMART ATTENDANCE PREDICTOR
================================= */

function calculateAttendance() {

    let semesterTotal = Number(document.getElementById("total").value);
    let attended = Number(document.getElementById("attended").value);
    let remaining = Number(document.getElementById("remaining").value);

    /* classes missed so far */

    let missed = semesterTotal - attended - remaining;

    if (
        semesterTotal <= 0 ||
        attended < 0 ||
        remaining < 0 ||
        missed < 0
    ) {

        result("attendanceResult", "Invalid input");

        document.getElementById("attendanceAdvice").innerText = "";
        document.getElementById("attendanceFuture").innerText = "";

        return;
    }

    /* current attendance */

    let classesCompleted = attended + missed;

    let percent = (attended / classesCompleted) * 100;

    let status = percent >= 75 ? "Safe ✅" : "Shortage ⚠️";

    result("attendanceResult", percent.toFixed(2) + "% — " + status);

    /* update dashboard */

    const summary = document.getElementById("summaryAttendance");

    if (summary) summary.innerText = percent.toFixed(1) + "%";

    const required = 0.75;

    /* maximum possible attendance */

    let maxAttendance =
        ((attended + remaining) / semesterTotal) * 100;

    /* CASE 1 — impossible to reach 75 */

    if (maxAttendance < 75) {

        document.getElementById("attendanceAdvice").innerText =
        "⚠️ It is NOT possible to reach 75% attendance this semester.";

    }

    /* CASE 2 — recovery possible */

    else {

        let classesNeeded = Math.ceil(
            (required * semesterTotal) - attended
        );

        document.getElementById("attendanceAdvice").innerText =
        "Attend next " + classesNeeded +
        " classes to reach 75% attendance.";
    }

    /* future prediction */

    document.getElementById("attendanceFuture").innerText =
    "Maximum possible attendance this semester: " +
    maxAttendance.toFixed(2) + "%";
}


/* ===============================
   RESET ATTENDANCE
================================= */

function resetAttendance() {

    document.getElementById("total").value = "";
    document.getElementById("attended").value = "";
    document.getElementById("remaining").value = "";

    document.getElementById("attendanceResult").innerText = "";
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

    if(!minutes || minutes <= 0) minutes = 25;

    /* activate glow animation */

    const display = document.querySelector(".timer-display");
    if(display) display.classList.add("timer-running");

    /* convert minutes → hundredth seconds */

    let time = minutes * 60 * 100;

    timerInterval = setInterval(()=>{

        let min = Math.floor(time / 6000);
        let sec = Math.floor((time % 6000) / 100);
        let ms  = time % 100;

        document.getElementById("timerMinutesDisplay").innerText =
            min < 10 ? "0"+min : min;

        document.getElementById("timerSecondsDisplay").innerText =
            sec < 10 ? "0"+sec : sec;

        document.getElementById("timerMsDisplay").innerText =
            ms < 10 ? "0"+ms : ms;

        time--;

        if(time < 0){

            clearInterval(timerInterval);

            document.getElementById("timerMinutesDisplay").innerText = "00";
            document.getElementById("timerSecondsDisplay").innerText = "00";
            document.getElementById("timerMsDisplay").innerText = "00";

            if(display) display.classList.remove("timer-running");

            alert("Break Time ☕");

        }

    },10); // update every 10ms
}


function resetTimer(){

    clearInterval(timerInterval);

    document.getElementById("timerMinutes").value = "";

    document.getElementById("timerMinutesDisplay").innerText = "25";
    document.getElementById("timerSecondsDisplay").innerText = "00";
    document.getElementById("timerMsDisplay").innerText = "00";

    const display = document.querySelector(".timer-display");
    if(display) display.classList.remove("timer-running");
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
   STUDY NOTEPAD
================================= */

function saveNotes() {

    let notes = document.getElementById("studyNotes").value;

    localStorage.setItem("studyNotes", notes);

    alert("Notes saved successfully!");
}

function clearNotes() {

    document.getElementById("studyNotes").value = "";

    localStorage.removeItem("studyNotes");
}

/* Load notes on page load */

function loadNotes() {

    let saved = localStorage.getItem("studyNotes");

    if (saved) {
        document.getElementById("studyNotes").value = saved;
    }
}

/* ===============================
   STUDY PROGRESS TRACKER
================================= */

function updateProgress(){

let value = Number(document.getElementById("progressInput").value);

if(value < 0 || value > 100){
alert("Enter a value between 0 and 100");
return;
}

/* CARD PROGRESS */

const bar = document.getElementById("progressBar");

bar.style.width = value + "%";

document.getElementById("progressText").innerText = value + "%";

/* DASHBOARD TIMELINE */

const fill = document.getElementById("dashboardProgressFill");
const dot = document.getElementById("dashboardProgressDot");

if(fill) fill.style.width = value + "%";
if(dot) dot.style.left = value + "%";

/* LABEL */

const summary = document.getElementById("summaryProgress");
if(summary) summary.innerText = value + "% Study Progress";

localStorage.setItem("studyProgress", value);
}


function resetProgress() {

    document.getElementById("progressInput").value = "";

    document.getElementById("progressBar").style.width = "0%";

    document.getElementById("progressText").innerText = "0%";

    /* RESET DASHBOARD SUMMARY */

    const summary = document.getElementById("summaryProgress");

    if (summary) summary.innerText = "0%";

    localStorage.removeItem("studyProgress");
}


function loadProgress() {

    let saved = localStorage.getItem("studyProgress");

    if (saved) {

        document.getElementById("progressBar").style.width =
            saved + "%";

        document.getElementById("progressText").innerText =
            saved + "%";

        /* LOAD DASHBOARD SUMMARY */

        const summary = document.getElementById("summaryProgress");

        if (summary) summary.innerText = saved + "%";
    }
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
    loadNotes();
    loadProgress();

    const toggle = document.getElementById("autoThemeToggle");

    if(toggle && toggle.checked){
        toggleAutoTheme();
    }

    if(typeof lucide !== "undefined"){
        lucide.createIcons();
    }
};
