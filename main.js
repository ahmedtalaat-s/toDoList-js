var newTaskbtn = document.getElementById("newTask");
var form = document.getElementById('modal');
var body = document.body;
var root = document.querySelector(':root');

//  input elements

var statusInput = document.getElementById("status"),
  categoryInput = document.getElementById("category"),
  titleInput = document.getElementById("title"),
  descInput = document.getElementById("description");
    

//  sections 
var nextUpsection = document.getElementById('nextUp'),
    inProgressSection = document.getElementById('inProgress'),
    doneSection= document.getElementById('done')

//  add btn
var addBtn = document.getElementById("addBtn");
//search bar
var shearchBar = document.getElementById("searchInput");
// counter 
var nextUpcounter = document.getElementById("nextUpCount"),
    inProgresscounter = document.getElementById("inProgressCount"),
    donecounter = document.getElementById("doneCount");
//containers
var sections = document.querySelectorAll("section");
var tasksContainer = document.querySelectorAll(".tasks");

var gridBtn = document.getElementById("gridBtn");
var barsBtn = document.getElementById("barsBtn");

var remainingCounterElement = document.getElementById("remainingCounter");

var modeBtn = document.getElementById("mode");


function showform() {
    form.classList.replace('d-none', 'd-flex')
    body.style.overflow = 'hidden';
}
function hideform() {
    form.classList.replace("d-flex", "d-none");
    body.style.overflow = "scroll";
}
var tasks;
if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'))
    displayAll()
}
else tasks = []

function addTask() {
    if (
        validate(titleRegex, titleInput) &&
        validate(descriptionRegex, descriptionInput)
    ) {
        if (addBtn.innerHTML.trim() == 'Add Task') {
            var task = {
                status: statusInput.value,
                categorey: categoryInput.value,
                title: titleInput.value,
                descreption: descInput.value
            };
            tasks.push(task);
            saveLocal();
            displayItem(tasks.length - 1)
            clearInput()
            hideform()
        }
        else {
            update();
        }
    }
}

var taskHTML;
function displayItem(index) {
    taskHTML = `
      <div class="task" data-index="${index}">
        <h3 class="text-capitalize">${tasks[index].title}</h3>
        <p class="description text-capitalize">${tasks[index].descreption}</p>
        <h4 class="category ${tasks[index].categorey} text-capitalize">${tasks[index].categorey}</h4>
        <ul class="task-options list-unstyled d-flex gap-3 fs-5 m-0">
          <li><i class="bi bi-pencil-square" onclick="getInfo(${index})"></i></li>
          <li><i class="bi bi-trash-fill" onclick="deleteTask(${index})"></i></li>
          <li><i class="bi bi-palette-fill" onclick="changeColor(event)"></i></li>
        </ul>
    </div>
    `;
    setLocation(tasks[index].status);
    counter()
}

function displayAll() {
    clearContainer()
    for (var i = 0; i < tasks.length; i++){
        displayItem(i)
    }
    counter()
}
function clearContainer() {
    nextUpsection.innerHTML =''
    inProgressSection.innerHTML =''
    doneSection.innerHTML =''
}

function setLocation(cat) {
    if (cat === 'nextUp') {
        nextUpsection.innerHTML += taskHTML;
     }
    else {
        if (cat == "inProgress") {
            inProgressSection.innerHTML += taskHTML;
        } else {
            doneSection.innerHTML += taskHTML;
        }
    }
}
function saveLocal() {
    localStorage.setItem('tasks',JSON.stringify(tasks))
}
function deleteTask(index) {
    tasks.splice(index, 1);
    saveLocal()
    displayAll()
}
var updateIndex;
function getInfo(index) {
    showform()  

    statusInput.value = tasks[index].status;
    categoryInput.value = tasks[index].categorey;
    titleInput.value = tasks[index].title;
    descInput.value = tasks[index].descreption;

    addBtn.innerHTML = 'Update Task'
    addBtn.classList.replace("btn-new-task", 'btn-update');
    updateIndex = index
    
}

function update() {
    tasks[updateIndex].status = statusInput.value;
    tasks[updateIndex].categorey = categoryInput.value;
    tasks[updateIndex].title = titleInput.value;
    tasks[updateIndex].descreption = descInput.value;

    saveLocal()
    displayAll()

    clearInput()
    hideform()
    addBtn.innerHTML = "Add Task";
    addBtn.classList.replace( "btn-update","btn-new-task");
}

function search() {
    clearContainer()
    for (var i = 0; i < tasks.length; i++){
        if (tasks[i].title.toLowerCase().includes(shearchBar.value.toLowerCase()) ||
            (tasks[i].categorey.toLowerCase().includes(shearchBar.value.toLowerCase()))) {
            displayItem(i);
        }
    }
}

function counter() {
    var next = 0, inProgress = 0, done = 0;
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].status == 'nextUp') {
            next++;
        }
        else {
            if (tasks[i].status == "inProgress") {
                inProgress++;
            } if (tasks[i].status == "done") {
                done++;
            }
        }
    }
    nextUpcounter.innerHTML = next;
    inProgresscounter.innerHTML = inProgress;
    donecounter.innerHTML = done;
}
function clearInput() {
    statusInput.value = '';
    categoryInput.value = 0;
    titleInput.value = '';
     descInput.value='';
}

function generateColor() {
    char = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'];
    var color='#'
    for (var i = 0; i < 6; i++){
        var randomIndex = Math.floor(Math.random() * 16);
        color+=char[randomIndex]
    }
    return color + 'aa';
}

function changeColor(event) {
    var task = event.target.parentElement.parentElement.parentElement;
    
    task.style.backgroundColor = generateColor();
}

function changeToBars() {
  gridBtn.classList.remove("active");
  barsBtn.classList.add("active");

  for (var i = 0; i < sections.length; i++) {
    sections[i].classList.remove("col-md-6", "col-lg-4");
    sections[i].style.overflow = "auto";
  }

  for (var j = 0; j < tasksContainer.length; j++) {
    tasksContainer[j].setAttribute("data-view", "bars");
  }
}

function changeToGrid() {
  barsBtn.classList.remove("active");
  gridBtn.classList.add("active");

  for (var i = 0; i < sections.length; i++) {
    sections[i].classList.add("col-md-6", "col-lg-4");
  }

  for (var j = 0; j < tasksContainer.length; j++) {
    tasksContainer[j].removeAttribute("data-view");
  }
}

var titleRegex = /^\w{3,}(\s\w+)*$/;
var descriptionRegex = /^(?=.{5,100}$)\w{1,}(\s\w*)*$/;

function validate(regex, element) {
  if (regex.test(element.value)) {
    element.classList.remove("is-invalid");
    element.classList.add("is-valid");
    element.parentElement.nextElementSibling.classList.replace(
      "d-block",
      "d-none"
    );
  } else {
    element.classList.remove("is-valid");
    element.classList.add("is-invalid");
    element.parentElement.nextElementSibling.classList.replace(
      "d-none",
      "d-block"
    );
  }
  return regex.test(element.value);
}

function changeMode() {
    if (modeBtn.dataset.mode == "night") {
    root.style.setProperty("--main-black", "#f1f1f1");
    root.style.setProperty("--sec-black", "#ddd");
    root.style.setProperty("--text-color", "#222");
    root.style.setProperty("--gray-color", "#333");
    root.style.setProperty("--mid-gray", "#f1f1f1");
    modeBtn.classList.replace("bi-brightness-high-fill", "bi-moon-stars-fill");
    modeBtn.dataset.mode = "light";
    } else if (modeBtn.dataset.mode == "light") {
    root.style.setProperty("--main-black", "#0d1117");
    root.style.setProperty("--sec-black", "#161b22");
    root.style.setProperty("--text-color", "#a5a6a7");
    root.style.setProperty("--gray-color", "#dadada");
    root.style.setProperty("--mid-gray", "#474a4e");
    modeBtn.classList.replace("bi-moon-stars-fill", "bi-brightness-high-fill");
    modeBtn.dataset.mode = "night";
  }
}




newTaskbtn.addEventListener('click',showform)
form.addEventListener('click', (event) => {
    if (event.target === form) {
        hideform()
        addBtn.innerHTML = "Add Task";
        addBtn.classList.replace("btn-update", "btn-new-task");
    }
})
addBtn.addEventListener('click', addTask)

shearchBar.addEventListener('input', search)

barsBtn.addEventListener("click", changeToBars);
gridBtn.addEventListener("click", changeToGrid);

titleInput.addEventListener("input", function () {
  validate(titleRegex, titleInput);
});

var remainingCounter = 100;

descInput.addEventListener("input", function () {
  validate(descriptionRegex, descInput);
  remainingCounter = 100 - descInput.value.split("").length;
  remainingCounterElement.innerHTML = remainingCounter;
});


modeBtn.addEventListener("click", changeMode);