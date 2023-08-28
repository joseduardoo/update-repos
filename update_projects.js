
const fs = require("fs");
const {exec} = require("child_process");
const { stderr } = require("process");

var data = fs.readFileSync("./rush.json");
var projects = JSON.parse(data).projects;

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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

async function updateRepos() {
    try {
        for (const project of projects) {                
            let dir = project.projectFolder;
            let repo = project.git;
            let command = `git clone ${repo} ${dir}`;

            // delete dir
            fs.rmSync(dir, {recursive: true, force: true});
            console.log(` ---> Project: "${dir}" has been removed`);
        
            await sleep(2000);
            
            // Clone Repo 
            let result = await execCommand(command);
            console.log(result.stdout);
            console.log(result.stderr);
            console.log(` ---> Repository: "${repo}" has been cloned in: ${dir}`);

            // delete dir .git in repo
            fs.rmSync(`${dir}/.git`, {recursive: true, force: true});
            console.log(` ---> Dir: "${dir}/.git" has been removed`);

            console.log(` ---> Proyect: "${dir}" has been updated <---`);
        }
    } catch (error) {
        console.error(error);
    }
};

updateRepos();
