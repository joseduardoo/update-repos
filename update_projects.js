
const fs = require("fs");
const {exec} = require("child_process");
const { stderr } = require("process");

var data = fs.readFileSync("./rush.json");
var projects = JSON.parse(data).projects;

function deleteDir(file) {
    fs.rmSync(file, {recursive: true, force: true});
};

function execCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            resolve({stdout, stderr});
        });
    });
};

function sleep1(ms) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > ms) {
            break;
        }
    };
};

function sleep2(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

async function cloneRepo(repo,file) {
    let command = `git clone ${repo} ${file}`;
    //deleteDir(file);
    //console.log(` ---> Project: ${file} has been removed`);
    try {
        const result = await execCommand(command);
        console.log(result.stdout);
        console.log(result.stderr);
        console.log(` ---> Repository: "${repo}" has been cloned in: ${file}`);
    } catch (error) {
        console.error("Error: ", error);
    }

    //deleteDir(`${file}/.git`);
    //console.log(` ---> Dir: ${file}/.git has been removed`);
};

async function updateRepos() {
    for (var projectInRush = 0; projectInRush < projects.length; projectInRush++) {
        let dir = projects[projectInRush].projectFolder;
        let repo = projects[projectInRush].git;

        deleteDir(dir);
        console.log(` ---> Project: "${dir}" has been removed`);
        await sleep2(2000);
        
        await cloneRepo(repo, dir)

        deleteDir(`${dir}/.git`);
        console.log(` ---> Dir: "${dir}/.git" has been removed`);

        console.log(` ---> Proyect: "${dir}" has been updated <---`);
    }
};

updateRepos();

/*
for (var projectInRush = 0; projectInRush < projects.length; projectInRush++) {
    deleteDir(projects[projectInRush].projectFolder);
    console.log(` ---> Project: ${projects[projectInRush].projectFolder} has been removed`);
    updateRepo(projects[projectInRush].git, projects[projectInRush].projectFolder);
};
*/
