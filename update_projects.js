
const fs = require("fs");
const {exec} = require("child_process");
const { stderr } = require("process");

//Aqui se obtiene la informacion del arcgivo .json
var data = fs.readFileSync("./rush.json");
var projects = JSON.parse(data).projects;

//var file1 = "SDK/Juego-memorama";
//var repo = "https://github.com/joseduardoo/Juego-memorama.git"
//var command = `git clone ${repo} ${file1}`;

//funcion que elimina un repo, o cualquier carpeta:
function deleteDir(file) {
    fs.rm(file, {recursive: true},(error) => {
        if (error) {
            console.log("No se pudo eliminar el directorio, probablemente no exista");
        } else {
            console.log(`Se elimino el directorio: ${file}`);
        }
    });
};

// Funcion que ejecuta el comando "git clone":
function ejecutarComando(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            resolve({stdout, stderr});
        });
    });
}

// Funcion que elimina el repo actual, clona el nuevo repo y elimina la capeta .git:
async function updateRepo(repo,file) {
    let command = `git clone ${repo} ${file}`;
    deleteDir(file);
    try {
        const result = await ejecutarComando(command);
        console.log(result.stdout);
        console.log(result.stderr);
        console.log(`Se clono el repositorio: ${repo} en la carperta: ${file}`);
    } catch (error) {
        console.error("Error al ejecutar el comando nuevo", error);
    }
    deleteDir(`${file}/.git`);
};

// Ciclo que recorre la informacion de rush para actualizar los repos:
for (var i = 0; i < projects.length; i++) {
    updateRepo(projects[i].git, projects[i].projectFolder);
};

/*----------------------   Funciona bien para actualizar repo     ----------------------

//Funcion que clona un repo de github en la ubicacion señalada (file)
function cloneRepo(repo,file) {
    let command = `git clone ${repo} ${file}`;
    exec(command, (error,stdout, stderr) => {
        if  (error) {
            console.error("Ocurrio un error al clonar el repositorio: " + repo);
            return;
        } else {
            console.log(`Se clono el repositorio: ${repo} en la carperta: ${file}`);
        };
        console.log(stdout);
        console.log(stderr);
    });
};

// Ciclo que recorre los elementos del arreglo proyects dentro del archivo rush.json
for (var i = 0; i < projects.length; i++) {
    deleteDir(projects[i].projectFolder);
    cloneRepo(projects[i].git, projects[i].projectFolder);
};
-----------------------------------------------------------------------------------------
*/

/*
// Instruccion para borrar cualquier carpeta (contenga o no archivos)
fs.rm(file1, {recursive: true},(error) => {
    if (error) {
        console.log(error);
    } else {
        console.log(`Se elimino el directorio: ${file1}`);
    }
});

// Instruccion para clonar un nuevo repositorio 
exec(command, (error,stdout, stderr) => {
    if  (error) {
        console.error("Ocurrio un error al clonar el repositorio: " + repo);
        return;
    } else {
        console.log(`Se clono el repositorio: ${repo} en la carperta: ${file1}`);
    };
    console.log(stdout);
    console.log(stderr);
});
*/

/*
Esta opcion no funciona porque solo permite borrar una carpeta que contiene archivos, si contiene 
otra(s) carpeta(s) manda error

fs.readdirSync(file1).forEach((fileName)=>{
    fs.unlinkSync(file1+"/"+fileName);
});

fs.rmdir(file1, (error)=>{
    if (error) {
        throw error;
    }
});
*/
