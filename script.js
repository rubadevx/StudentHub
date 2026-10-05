const body = document.body;
const themeButton = document.getElementById("themeButton");
const dateElement = document.getElementById("currentDate");
const tasksList = document.getElementById("tasksList");
const addTaskButton = document.getElementById("addTaskButton");
const totalTasksElement = document.getElementById("totalTasks");
const completedTasksElement = document.getElementById("completedTasks");
const timerElement = document.getElementById("timer");
const startButton = document.getElementById("startButton");
const resetButton = document.getElementById("resetButton");

let timerSeconds = 25 * 60;
let timerInterval = null;
let isTimerRunning = false;

function formatDate() {
    const now = new Date();
    const options = { month: "short", day: "numeric", year: "numeric" };
    return now.toLocaleDateString("en-US", options);
}

function updateDate() {
    if (dateElement) {
        dateElement.textContent = formatDate();
    }
}

function updateThemeIcon() {
    if (!themeButton) return;

    const icon = themeButton.querySelector("i");
    if (!icon) return;

    const isLightMode = body.classList.contains("light-mode");
    icon.classList.toggle("fa-moon", !isLightMode);
    icon.classList.toggle("fa-sun", isLightMode);
    themeButton.setAttribute("aria-label", isLightMode ? "Switch to dark mode" : "Switch to light mode");
}

function setTheme(mode) {
    const isLightMode = mode === "light";
    body.classList.toggle("light-mode", isLightMode);
    localStorage.setItem("studenthub-theme", mode);
    updateThemeIcon();
}

function initializeTheme() {
    const savedTheme = localStorage.getItem("studenthub-theme");
    const preferredTheme = savedTheme || "dark";
    setTheme(preferredTheme);
}

function createTaskElement(taskText, taskSubject, taskTime, isCompleted = false) {
    const task = document.createElement("div");
    task.className = `task${isCompleted ? " completed" : ""}`;

    const check = document.createElement("div");
    check.className = "task-check";
    if (isCompleted) {
        check.innerHTML = '<i class="fa-solid fa-check"></i>';
    }

    const info = document.createElement("div");
    info.className = "task-info";

    const title = document.createElement("strong");
    title.textContent = taskText;

    const subtitle = document.createElement("span");
    subtitle.textContent = taskSubject;

    info.appendChild(title);
    info.appendChild(subtitle);

    const time = document.createElement("span");
    time.className = "task-time";
    time.textContent = taskTime;

    task.appendChild(check);
    task.appendChild(info);
    task.appendChild(time);

    task.addEventListener("click", () => {
        task.classList.toggle("completed");
        const taskCheck = task.querySelector(".task-check");

        if (task.classList.contains("completed")) {
            taskCheck.innerHTML = '<i class="fa-solid fa-check"></i>';
        } else {
            taskCheck.innerHTML = "";
        }

        updateTaskStats();
    });

    return task;
}

function updateTaskStats() {
    if (!tasksList) return;

    const tasks = tasksList.querySelectorAll(".task");
    const totalTasks = tasks.length;
    const completedTasks = [...tasks].filter((task) => task.classList.contains("completed")).length;

    if (totalTasksElement) totalTasksElement.textContent = totalTasks;
    if (completedTasksElement) completedTasksElement.textContent = completedTasks;
}

function addTask() {
    const taskText = window.prompt("Task name:", "New study task");
    if (!taskText || !taskText.trim()) return;

    const taskSubject = window.prompt("Subject:", "General");
    const taskTime = window.prompt("Time:", "09:00 AM");

    const safeTaskText = taskText.trim();
    const safeTaskSubject = (taskSubject && taskSubject.trim()) || "General";
    const safeTaskTime = (taskTime && taskTime.trim()) || "09:00 AM";

    const newTask = createTaskElement(safeTaskText, safeTaskSubject, safeTaskTime, false);
    tasksList.prepend(newTask);
    updateTaskStats();
}

function formatTimer(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

function updateTimerDisplay() {
    if (timerElement) {
        timerElement.textContent = formatTimer(timerSeconds);
    }
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    isTimerRunning = false;

    if (startButton) {
        startButton.innerHTML = '<i class="fa-solid fa-play"></i> Start Focus';
    }
}

function startTimer() {
    if (isTimerRunning) {
        stopTimer();
        return;
    }

    isTimerRunning = true;

    if (startButton) {
        startButton.innerHTML = '<i class="fa-solid fa-pause"></i> Pause Focus';
    }

    timerInterval = setInterval(() => {
        if (timerSeconds > 0) {
            timerSeconds -= 1;
            updateTimerDisplay();
        } else {
            stopTimer();
            window.alert("Focus session complete. Great work!");
        }
    }, 1000);
}

function resetTimer() {
    stopTimer();
    timerSeconds = 25 * 60;
    updateTimerDisplay();
}

function initializeTimer() {
    updateTimerDisplay();

    if (startButton) {
        startButton.addEventListener("click", startTimer);
    }

    if (resetButton) {
        resetButton.addEventListener("click", resetTimer);
    }
}

if (themeButton) {
    themeButton.addEventListener("click", () => {
        const nextTheme = body.classList.contains("light-mode") ? "dark" : "light";
        setTheme(nextTheme);
    });
}

if (addTaskButton) {
    addTaskButton.addEventListener("click", addTask);
}

initializeTheme();
updateDate();
updateTaskStats();
initializeTimer();
