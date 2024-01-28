
"use strict";

let gorevListesi = [
    {"id": 1, "gorevAdi": "Ders notlarını oku ^^", "durum":"completed"},
    {"id": 2, "gorevAdi": "Sınavlara Çalış", "durum":"uncompleted"}
];

if (localStorage.getItem("taskList") !== null) {
    gorevListesi = JSON.parse(localStorage.getItem("taskList"));//jsona çevirdik
}

const btnAddTask = document.querySelector("#btnAddTask");
const search =  document.querySelector("#txtTaskName");
const btnClear = document.querySelector("#btnClear");
const filters = document.querySelectorAll(".filters span");
const errormsg = document.querySelector("div.errormessage");

let editId;
let isEditMode = false;
let selectedFilters = "all";

listTask("all");

btnAddTask.addEventListener("click",newTask);
btnAddTask.addEventListener("keypress",function(e){
    if(e.key == "Enter"){
        btnAddTask.click();
    }
});

function listTask(filter){ 
    let ul = document.querySelector("ul");
    ul.innerHTML="";
    
    localStorage.setItem("taskList", JSON.stringify(gorevListesi));//stringe çevirdik.
    
    let gorevListesiFilter = "";
    if(filter=="all") gorevListesiFilter = gorevListesi;
    else if(filter=="uncompleted") gorevListesiFilter = gorevListesi.filter(gorev => gorev.durum == "uncompleted");
    else gorevListesiFilter = gorevListesi.filter(gorev => gorev.durum == "completed");

    if (gorevListesiFilter.length == 0) {
        ul.innerHTML="";
        let li  = `
        <li class="task list-group-item border-0 rounded-3 p-3">
            <div class="row d-flex align-items-center">
                <div class="checkbox col-1">
                  <i class="fa-solid fa-exclamation p-1 border rounded-circle text-center"></i>
                </div>
                <div class="task-content col-9">
                    <p class='p-3 m-0'>Your To Do List is empty!</p>
                </div>
            </div>
        </li>
        `;
        ul.insertAdjacentHTML("afterbegin", li);
    }else {
            gorevListesiFilter.forEach((task) => {
                let icon = (task.durum=="completed")? "fa-check" : "fa-x";
                let li =`
                     <li class="task list-group-item border-0 rounded-3 p-3" onclick="editStatus(${task.id})" id="${task.id}">
                        <div class="row d-flex align-items-center">
                            <div class="checkbox col-1">
                              <i class="fa-solid ${icon} p-1 border rounded-circle "></i>
                            </div>
                            <div class="task-content col-9 ${task.durum}">
                                ${task.gorevAdi}
                            </div>
                            <div class="editOrDelete col-2 p-0 text-center" onclick="event.stopPropagation()" id="${task.id}">
                                <button type="button" class="btn btn-outline-pink editTask m-2" onclick='editTask(${task.id}, "${task.gorevAdi}")'>
                                 <i class="fa-solid fa-pen-to-square"></i>
                                </button>
                                <button type="button" class="btn btn-outline-pink deleteTask m-2" onclick="deleteTask(${task.id})">
                                <i class="fa-solid fa-delete-left"></i>
                                </button>
                            </div>
                        </div>
                    </li>
                `;
                ul.insertAdjacentHTML("afterbegin", li);
            });
    }
}

function newTask(e) {

    if(search.value != ""){

       if(!isEditMode) {
        errormsg.classList.add("d-visible");
        //Add
        gorevListesi.push({"id": gorevListesi.length+1, "gorevAdi": search.value , "durum":"uncompleted"});
       } else {
        //Update
           for(let gorev of gorevListesi) {

               if(gorev.id == editId) {
                   gorev.gorevAdi=search.value;
                   isEditMode=false;
                   break;
                }
           }
       }
    search.value = "";
    } else {
        errormsg.classList.remove("d-visible");
    }
    e.preventDefault();
    listTask(selectedFilters);
}

function editStatus(id){

    if(isEditMode) return;

    for(let gorev of gorevListesi){

        if(id == gorev.id) {
            gorev.durum = (gorev.durum == "completed")? "uncompleted" : "completed";
            listTask(selectedFilters);
            break;
        }
    }
}

function editTask(id ,taskname){
    editId = id;

    search.focus();
    search.value = taskname;

    let liList = document.querySelectorAll("li");
    search.addEventListener("keydown",function(e) {
        (e.key == "Escape")? outEdit(id, liList) : "";
    });
 
    if(isEditMode) outEdit(id, liList);
    else {
        for(let gorev of liList) {
            let li = gorev.children[0].children[2];

            (gorev.id == id)? li.classList.add("active"):
                li.classList.add("d-none"); 
                li.children[1].classList.add("disabled");
                btnClear.classList.add("disabled");
        }
        isEditMode = true;
    }  
}

function outEdit(id, liList){
    search.value = "";
    isEditMode = false;

    for(let gorev of liList) {
        let li = gorev.children[0].children[2];

        (gorev.id == id)? li.classList.remove("active"):  
            li.classList.remove("d-none") ; 
            li.children[1].classList.remove("disabled");
            btnClear.classList.remove("disabled");
    };
}  

function deleteTask(id){

    if(isEditMode) return;

    for(let index in gorevListesi) {

        if(gorevListesi[index].id ==id) {
            gorevListesi.splice(index,1);
            break;
        }
    }
    listTask(selectedFilters);
}

filters.forEach(filter => filter.addEventListener("click", function (){
    
    if(isEditMode) return;

    document.querySelector(".filters span.active").classList.remove("active");
    filter.classList.add("active");

    selectedFilters = filter.id;
    listTask(selectedFilters);
}));

btnClear.addEventListener("click",clearAll);

function clearAll(){
    gorevListesi.splice(0, gorevListesi.length);
    listTask(selectedFilters);  
}

