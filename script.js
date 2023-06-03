const toDoInput = document.querySelector(".todo-input");
const toDoRemove = document.querySelector(".todo-remove");
const toDOListContainer = document.querySelector(".todo-list-container");
const todoForm = document.querySelector(".form-todo");
const toDoCheck = document.querySelector(".todo-check");
const editPage = document.querySelector(".edit-page");
const editText = document.querySelector(".edit-text");
const saveEditBtn = document.querySelector(".save-btn");
const alermEdit = document.querySelector(".alarm-edit");
const canselEditBtn = document.querySelector(".cansel-btn");
const back = document.querySelector(".back-todo");
const list = document.querySelector(".todo-list-container");
const optionSelect = document.querySelector(".todo-select");

let toDos = [];
class ToDoList {
  formSubmit() {
    todoForm.addEventListener("submit", (event) => {
      this.createNewToDo();
      event.preventDefault();
    });
  }

  createNewToDo() {
    console.log(optionSelect.value);

    const newToDo = {
      title: toDoInput.value.trim().slice(0, 20),
      id: new Date().getTime(),
      completed: "completed",
      createdAt: new Date().toLocaleDateString("en-US"),
    };
    // get toDos from Storage
    toDos = Storage.getToDos();

    //add new to do to todos
    toDos.push(newToDo);

    console.log("hiii");

    //show todolist with new update
    if (optionSelect.value == "all") {
      console.log("mmm");
      this.updateToDolist(toDos);
    } else {
      console.log("nnn");
      if (optionSelect.value == "completed") {
        const updateToDos = toDos.filter(
          (toDo) => toDo.completed == optionSelect.value
        );
        this.updateToDolist(updateToDos);
      } else if (optionSelect.value == "uncompleted") {
        console.log("n2");
        newToDo.completed = "uncompleted";

        const updateToDos = toDos.filter(
          (toDo) => toDo.completed == optionSelect.value
        );
        console.log(toDos);
        this.updateToDolist(updateToDos);
      }
    }

    // save on localStorage
    Storage.saveToDos(toDos);
    toDoInput.value = "";
  }

  removeToDo() {
    const listRemoved = [...document.querySelectorAll(".todo-remove")] || [];
    listRemoved.forEach((toDo) => {
      toDo.addEventListener("click", (e) => {
        toDos = toDos.filter((toDo) => toDo.id != e.target.dataset.id);
        Storage.saveToDos(toDos);
        if (optionSelect.value == "all") {
          this.updateToDolist(toDos);
        } else {
          const updateToDos = toDos.filter(
            (toDo) => toDo.completed == optionSelect.value
          );
          this.updateToDolist(updateToDos);
        }
      });
    });
  }
  checkToDo() {
    const listChecked = [...document.querySelectorAll(".todo-check")];
    listChecked.forEach((item) => {
      item.addEventListener("click", (e) => {
        //add style
        e.target.firstElementChild.classList.toggle("fa-check");
        e.target.parentElement.parentElement.classList.toggle(
          "to-check-uncompleted"
        );
        //update state of completed
        const findToDo = toDos.find((toDos) => toDos.id == e.target.dataset.id);
        findToDo.completed =
          findToDo.completed == "uncompleted" ? "completed" : "uncompleted";

        //update Showing listtoDos
        if (optionSelect.value == "all") {
          this.updateToDolist(toDos);
        } else {
          const updateToDos = toDos.filter(
            (toDo) => toDo.completed !== findToDo.completed
          );
          this.updateToDolist(updateToDos);
        }

        //save on Storage
        Storage.saveToDos(toDos);
      });
    });
  }
  editToDo() {
    const listEdit = [...document.querySelectorAll(".todo-edit")];
    listEdit.forEach((toDoEdit) => {
      toDoEdit.addEventListener("click", (e) => {
        editPage.style.opacity = "1";
        editPage.style.transform = "translateY(20vh)";
        back.style.display = "block";
        const findToDo = toDos.find((toDo) => toDo.id == e.target.dataset.id);
        editText.value = findToDo.title;
        editText.dataset.id = toDoEdit.dataset.id;
        console.log(editText.dataset.id);
      });
    });
  }

  saveEditBtn() {
    saveEditBtn.addEventListener("click", (e) => {
      console.log(toDos);
      const findToDo = toDos.find((toDo) => toDo.title == editText.value);

      if (findToDo) {
        alermEdit.style.display = "block";
      } else {
        alermEdit.style.display = "none";
        const findToDo = toDos.find((toDo) => toDo.id == editText.dataset.id);
        findToDo.title = editText.value;
        Storage.saveToDos(toDos);
        //show toDolist according to category
        if (optionSelect.value == "all") {
          this.updateToDolist(toDos);
        } else {
          const updateToDos = toDos.filter(
            (toDo) => toDo.completed == optionSelect.value
          );
          this.updateToDolist(updateToDos);
        }

        editPage.style.opacity = "0";
        editPage.style.transform = "translateY(-200vh)";
        back.style.display = "none";
        this.editToDo();
      }
    });
  }

  canselTitleToDo() {
    canselEditBtn.addEventListener("click", () => {
      alermEdit.style.display = "none";
      editPage.style.opacity = "0";
      editPage.style.transform = "translateY(-200vh)";
      back.style.display = "none";
    });
  }
  updateToDolist(toDos) {
    let newToDoList = "";
    toDos.forEach((toDo) => {
      newToDoList += `<li class="todo  ${
        toDo.completed == "uncompleted" ? "to-check-uncompleted" : ""
      }">
      <p class="todo-title">${toDo.title}</p>
      <div class="todo-info">
        <p class="todo-createdAt">${toDo.createdAt}</p>
        <button class="todo-edit" data-id=${
          toDo.id
        }><i class="fa-sharp fa-regular fa-pen-to-square"></i></button>
        <button class="todo-check" data-id=${toDo.id}><i class="fas ${
        toDo.completed == "completed" ? "fa-check" : ""
      }"></i></button>
        <button class="todo-remove" data-id=${toDo.id}>
          <i class="fa fa-trash-alt"></i>
        </button>
      </div>
    </li>`;
    });
    toDOListContainer.innerHTML = newToDoList;
    this.removeToDo();
    this.checkToDo();
    this.editToDo();
  }

  selectGroup() {
    optionSelect.addEventListener("change", (e) => {
      if (optionSelect.value == "all") {
        this.updateToDolist(toDos);
      } else {
        const updateToDos = toDos.filter(
          (toDo) => toDo.completed == optionSelect.value
        );
        this.updateToDolist(updateToDos);
      }
    });
  }
}
class Storage {
  static saveToDos(toDos) {
    localStorage.setItem("toDos", JSON.stringify(toDos));
  }
  static getToDos() {
    return JSON.parse(localStorage.getItem("toDos")) || [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  toDos = Storage.getToDos();
  const toDoList = new ToDoList();
  toDoList.updateToDolist(toDos);
  toDoList.formSubmit();
  toDoList.removeToDo();
  toDoList.selectGroup();
  toDoList.editToDo();
  toDoList.canselTitleToDo();
  toDoList.saveEditBtn();
});
