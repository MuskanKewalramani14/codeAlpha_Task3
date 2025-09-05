// LocalStorage key
const STORAGE_KEY = "kanbanTasks";

// Load tasks
let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

const taskTitle = document.getElementById("taskTitle");
const taskAssignee = document.getElementById("taskAssignee");
const taskDue = document.getElementById("taskDue");
const addTaskBtn = document.getElementById("addTaskBtn");

const modalBackdrop = document.getElementById("modalBackdrop");
const mTitle = document.getElementById("mTitle");
const mAssignee = document.getElementById("mAssignee");
const mDue = document.getElementById("mDue");
const mStatus = document.getElementById("mStatus");
const mDesc = document.getElementById("mDesc");
const commentsDiv = document.getElementById("comments");
const cAuthor = document.getElementById("cAuthor");
const cText = document.getElementById("cText");
const addCommentBtn = document.getElementById("addComment");

const saveBtn = document.getElementById("saveTask");
const deleteBtn = document.getElementById("deleteTask");
const closeBtn = document.getElementById("closeModal");

let editingId = null;

// Render tasks to columns
function render() {
  ["todo","doing","done"].forEach(st => {
    document.getElementById("col-" + st).innerHTML = "";
    document.getElementById("count-" + st).textContent = 
      tasks.filter(t => t.status === st).length;
  });

  tasks.forEach(t => {
    const div = document.createElement("div");
    div.className = "task";
    div.draggable = true;
    div.textContent = `${t.title} (${t.assignee || "Unassigned"})`;

    div.addEventListener("dragstart", e => {
      e.dataTransfer.setData("id", t.id);
    });

    div.addEventListener("click", () => openModal(t.id));

    document.getElementById("col-" + t.status).appendChild(div);
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Add Task
addTaskBtn.addEventListener("click", () => {
  if (!taskTitle.value.trim()) {
    alert("Enter a task title!");
    return;
  }
  tasks.push({
    id: Date.now(),
    title: taskTitle.value,
    assignee: taskAssignee.value,
    due: taskDue.value,
    status: "todo",
    desc: "",
    comments: []
  });
  taskTitle.value = "";
  taskAssignee.value = "";
  taskDue.value = "";
  render();
});

// Dropzones
document.querySelectorAll(".dropzone").forEach(zone => {
  zone.addEventListener("dragover", e => e.preventDefault());
  zone.addEventListener("drop", e => {
    const id = e.dataTransfer.getData("id");
    const task = tasks.find(t => t.id == id);
    const newStatus = zone.id.replace("dz-","");
    task.status = newStatus;
    render();
  });
});

// Modal
function openModal(id) {
  const task = tasks.find(t => t.id == id);
  editingId = id;
  mTitle.value = task.title;
  mAssignee.value = task.assignee;
  mDue.value = task.due;
  mStatus.value = task.status;
  mDesc.value = task.desc;
  renderComments(task);
  modalBackdrop.classList.add("active");
}
closeBtn.onclick = () => modalBackdrop.classList.remove("active");

saveBtn.onclick = () => {
  const t = tasks.find(t => t.id == editingId);
  t.title = mTitle.value;
  t.assignee = mAssignee.value;
  t.due = mDue.value;
  t.status = mStatus.value;
  t.desc = mDesc.value;
  render();
  modalBackdrop.classList.remove("active");
};

deleteBtn.onclick = () => {
  tasks = tasks.filter(t => t.id != editingId);
  render();
  modalBackdrop.classList.remove("active");
};

// Comments
function renderComments(task) {
  commentsDiv.innerHTML = "";
  task.comments.forEach(c => {
    const d = document.createElement("div");
    d.textContent = `${c.author}: ${c.text}`;
    commentsDiv.appendChild(d);
  });
}
addCommentBtn.onclick = () => {
  const t = tasks.find(t => t.id == editingId);
  if (cAuthor.value && cText.value) {
    t.comments.push({author:cAuthor.value, text:cText.value});
    cAuthor.value = ""; cText.value = "";
    renderComments(t);
    render();
  }
};

// Initial render
render();
