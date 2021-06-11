// Variables.
const form = document.querySelector("#form");
const taskName = document.querySelector("#taskName");
const taskContainer = document.querySelector("#taskContainer");
const btnGuardar = document.querySelector("#btnGuardar");
const pantallaEdicion = document.querySelector(".full");

let editando = false;
let DB; //Alnmacena la indexedDB.

const tareasObj = {
    tarea: "",
};

class AdmTarea {
    constructor() {
        this.tareas = [];
    }
    agregarTarea(tarea) {
        this.tareas = [...this.tareas, tarea];
    }
    deleteTarea(id) {
        this.tareas = this.tareas.filter((task) => task.id !== id);
    }
    editTarea(tareaNew) {
        this.tareas = this.tareas.map((task) =>
            task.id === tareaNew.id ? tareaNew : task
        );
    }
}

class UI {
    imprimirtareas({ tareas }) {
        //const { tarea } = tareas;

        limpiarHTML();
        tareas.forEach((task) => {
            // Contenedor de la tarea.
            const div = document.createElement("div");
            div.classList.add("divTarea");
            div.innerHTML = `<p class="tarea" > <span>${task.tarea}</span>  </p>`;

            // Icono check
            const checkButton = document.createElement("span");
            checkButton.innerHTML = `<svg width="25px" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>`;
            checkButton.classList.add("check");

            // Checkbox
            const checkBox = document.createElement("input");
            checkBox.type = "checkbox";
            checkBox.classList.add("checkBox");
            checkBox.addEventListener("click", () => {
                if (checkBox.checked) {
                    checkButton.style.color = "#00af91";
                } else {
                    checkButton.style.color = "lightslategray";
                }
            });
            //Contenedor de botones.
            const divBotones = document.createElement("div");

            //Boton para borrar.
            const btnDelete = document.createElement("button");
            btnDelete.innerHTML = `&times Borrar`;
            btnDelete.classList.add("btnDelete");
            btnDelete.setAttribute("id", "btnDelete");
            divBotones.appendChild(btnDelete);
            btnDelete.onclick = () => {
                eliminarTarea(task.id);
            };

            const btnEditar = document.createElement("button");
            btnEditar.innerHTML = `<svg width="14" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg> Editar`;
            btnEditar.classList.add("btnEditar");
            btnEditar.setAttribute("id", "btnEditar");
            divBotones.appendChild(btnEditar);
            btnEditar.onclick = () => {
                editarTarea(task);
            };

            div.appendChild(divBotones);
            div.appendChild(checkButton);
            div.appendChild(checkBox);

            taskContainer.appendChild(div);
        });
    }
    mostrarAlerta(mensaje, tipo) {
        const alerta = document.querySelector("#alerta"); // Se selecciona el contenedor del mensaje.

        alerta.innerHTML = `
            <p class="mensaje">${mensaje}</p>
        `; // seinserta el mensaje.

        if (tipo === "error") {
            alerta.style.backgroundColor = "lightcoral";
        } else if (tipo === "success") {
            alerta.style.backgroundColor = "#00af91";
        }

        alerta.style.top = "0";

        setTimeout(() => {
            alerta.style.top = "-70px";
        }, 3000);
    }
    irAEdicion(tarea) {
        const pantallaEdicion = document.querySelector(".full");
        const cerrarIcon = document.querySelector(".cerrarIcon");

        pantallaEdicion.style.display = "flex";

        cerrarIcon.addEventListener("click", () => {
            pantallaEdicion.style.display = "none";
        });

        const taskArea = document.querySelector("#taskArea");

        taskArea.value = tarea;

        const btnGuardar = document.querySelector(".btnGuardar");
        btnGuardar.addEventListener("click", (e) => {
            return taskArea;
        });
    }
}
const ui = new UI();
const admTarea = new AdmTarea();

// Al cargar la pagina se ejecutan las funciones.
document.addEventListener("DOMContentLoaded", () => {
    //crearDB();
    taskName.addEventListener("input", llenarObj);
    taskArea.addEventListener("input", llenarObj);

    form.addEventListener("submit", nuevaTarea);
    btnGuardar.addEventListener("click", nuevaTarea);
});

function limpiarHTML() {
    while (taskContainer.firstChild) {
        taskContainer.removeChild(taskContainer.firstChild);
    }
}

function llenarObj(e) {
    tareasObj[e.target.name] = e.target.value.trim();
}

function nuevaTarea(e) {
    e.preventDefault();
    const { tarea } = tareasObj;
    if (tarea === "") {
        ui.mostrarAlerta("No puedes agregar una tarea vacia", "error");
        return;
    }
    if (editando) {
        admTarea.editTarea({ ...tareasObj });
        ui.mostrarAlerta("Tarea actualizada.", "success");
        pantallaEdicion.style.display = "none";
        editando = false;
    } else {
        tareasObj.id = Date.now();
        admTarea.agregarTarea({ ...tareasObj });
        ui.mostrarAlerta("Tarea Creada", "success");
    }

    form.reset();
    ui.imprimirtareas(admTarea);

    reiniciarObjeto();
}

function reiniciarObjeto() {
    tareasObj.tarea = "";
}

function eliminarTarea(id) {
    admTarea.deleteTarea(id);
    ui.imprimirtareas(admTarea);
    ui.mostrarAlerta("Tarea Eliminada", "error");
}
function editarTarea(task) {
    const { tarea, id } = task;

    const cerrarIcon = document.querySelector(".cerrarIcon");
    const taskArea = document.querySelector("#taskArea");

    pantallaEdicion.style.display = "flex";
    cerrarIcon.addEventListener("click", () => {
        pantallaEdicion.style.display = "none";
    });

    taskArea.value = tarea;

    tareasObj.tarea = tarea;
    tareasObj.id = id;

    editando = true;
}
/* function crearDB() {
    let taskDB = window.indexedDB.open("tasks", 1);

    taskDB.onerror = () => {
        console.log("Hubo un error.");
    };
    taskDB.onsuccess = () => {
        console.log("La DB se creo correctamente");
        DB = taskDB;
        /getDB(); 
    };
    taskDB.onupgradeneeded = (e) => {
        const data = e.target.result;

        const objectStore = data.createObjectStore("tasks", {
            keyPath: "tasks",
            autoIncrement: true,
        });
        objectStore.createIndex("tarea", "tarea", { unique: false });
        objectStore.createIndex("id", "id", { unique: true });
    };
} */
/* 
function postDB() {
    let transaction = DB.result.transaction(["tasks"], "readwrite");

    transaction.oncomplete = function () {
        console.log("Conexion con  la base de datos exitosa.");
    };
    transaction.onerror = function () {
        console.log("Error al conectar con la Base de datos.");
    };
    const objectStore = transaction.objectStore("tasks");

    const tareasObj = { ...tareaObj };

    peticion = objectStore.add(tareasObj);

    ui.imprimirtarea(tareasObj);
} */

/* function getDB() {
    const transaction = DB.result.transaction(["tasks"], "readonly");

    const objectStore = transaction.objectStore("tasks");

    const request = objectStore.openCursor();

    request.onsuccess = (e) => {
        const cursor = e.target.result;
        if (cursor) {
            ui.imprimirtarea(cursor.value);
            cursor.continue();
        } else {
            console.log("Sin datos");
        }
    };
} */

/*
function guardarEdicion(tarea) {
    const btnGuardar = document.querySelector(".btnGuardar");
    btnGuardar.addEventListener("click", (e) => {
        console.log(e.target);
    });
}
 */
