
const fs = require("fs");
const {exec} = require("child_process");
const { stderr } = require("process");

//Aqui se obtiene la informacion del arcgivo .json
var data = fs.readFileSync("./rush.json");
var projects = JSON.parse(data).projects;
console.log(projects[1].projectFolder);

//var file1 = "SDK/Juego-memorama";
//var repo = "https://github.com/joseduardoo/Juego-memorama.git"
//var command = `git clone ${repo} ${file1}`;

// Ciclo que recorre los elementos del arreglo proyects dentro del archivo rush.json
for (var i = 0; i < projects.length; i++) {
    deleteRepo(projects[i].projectFolder);
    updateRepo(projects[i].git, projects[i].projectFolder);
};

//funcion que elimina un repo, o cualquier carpeta
function deleteRepo(file) {
    fs.rm(file, {recursive: true},(error) => {
        if (error) {
            console.log("No se pudo eliminar el directorio, probablemente no exista");
        } else {
            console.log(`Se elimino el directorio: ${file}`);
        }
    });
};

//Funcion que clona un repo de github en la ubicacion señalada (file)
function updateRepo(repo,file) {
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
