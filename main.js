const prompt = require("prompt");
const promptsync = require("prompt-sync")();
const table = require("cli-table");
const fs = require("fs");
const util = require("util");
const appendFileAsync = util.promisify(fs.appendFile);
const readFile = util.promisify(fs.readFile);
const path = "./students.json";

const details = [];

const getStudentDetails = async () => {
  try {
    return ({ name, registrationNumber, form, yearOfBirth } = await prompt.get([
      "name",
      "registrationNumber",
      "form",
      "yearOfBirth",
    ]));
  } catch (e) {
    console.log("Error", e.message);
    return false;
  }
};
//save student to a file
const saveStudent = async () => {
  const details = [];
  const studentDetails = await getStudentDetails();
  try {
    if (fs.existsSync(path)) {
      //file exists
      fs.readFile("students.json", "utf8", function (err, data) {
        if (data) {
          const json = JSON.parse(data);
          json.push(studentDetails);
          fs.writeFile("students.json", JSON.stringify(json), function (err) {
            if (err) throw err;
          });
          console.log("The data was appended to file!");
        }
      });
    } else {
      await details.push(studentDetails);

      await appendFileAsync("students.json", JSON.stringify(details), "utf8");
    }

    // console.log(" details ", studentDetails);
    // console.log(details);
  } catch (error) {
    console.error("ERROR: ", error);
    return false;
  }
};
//readfile
const readData = async () => {
  return await fs.readFile("./students.json", "utf8", function (err, data) {
    const json = JSON.parse(data);
    if (err) {
      console.log("Failed to read ", err);
      return err;
    } else {
      // instantiate
      // var table = new Table({
      //   head: ["TH 1 label", "TH 2 label"],
      //   colWidths: [100, 200],
      // });

      // table is an Array, so you can `push`, `unshift`, `splice` and friends
      //     table.push(
      //       ["First value", "Second value"],
      //       ["First value", "Second value"]
      //     );

      //     console.log(table.toString());

      console.log(" Read: ", json);
      return data;
    }
  });
};

// search student by name
const searchName = async () => {
  const data = await fs.promises.readFile(path, "utf8");
  const jsonData = JSON.parse(data);

  // console.log(" data from readFile ", jsonData);

  try {
    let name = await promptsync("Enter the name:");
    nameData = await jsonData.filter((search) => {
      return search.name === `${name}`;
    });
    console.log(nameData);
    // index = jsonData.findIndex((x) => x.name === name);
    // console.log(index);
  } catch (error) {
    console.error("ERROR: ", error);
  }
};
//search by registration number
const searchReg = async () => {
  const data = await fs.promises.readFile(path, "utf8");
  const jsonData = JSON.parse(data);

  // console.log(" data from readFile ", jsonData);

  try {
    let reg = await promptsync("Enter the Registration number:");
    regData = await jsonData.filter((search) => {
      return search.registrationNumber === `${reg}`;
    });
    console.log(regData);
    menu();
  } catch (error) {
    console.error("ERROR: ", error);
  }
};
//search specific form
const searchForm = async () => {
  const data = await fs.promises.readFile(path, "utf8");
  const jsonData = JSON.parse(data);

  // console.log(" data from readFile ", jsonData);

  try {
    let form = await promptsync("Enter the Form:");
    formData = await jsonData.filter((search) => {
      return search.form === `${form}`;
    });
    console.log(formData);
    menu();
  } catch (error) {
    console.error("ERROR: ", error);
  }
};
// remove student
const removeStudent = async () => {
  const data = await fs.promises.readFile(path, "utf8");
  const jsonData = JSON.parse(data);

  console.log(" data from readFile ", jsonData);

  try {
    let name = await promptsync("Enter the name:");
    nameData = await jsonData.filter((search) => {
      return search.name === `${name}`;
    });
    console.log(nameData);
    index = jsonData.findIndex((x) => x.name === name);
    jsonData.splice(index, 1);
    console.log(jsonData);
    //remove un updated file
    fs.unlink("students.json", (err) => {
      if (err) {
        throw err;
      }

      console.log("File is deleted.");
    });
    fs.writeFile("students.json", JSON.stringify(jsonData), function (err) {
      if (err) throw err;
    });
    console.log("The data was appended to file!");
  } catch (error) {
    console.error("ERROR: ", error);
  }
};

function menu() {
  const menu_action = promptsync(
    `Choose Action you want to complete: add,displaystudents,searchbyname,searchbyreg,searchbyform,removestudent,0 - to exit.`
  );

  switch (menu_action) {
    case "add":
      console.log(`This is your choice: ${menu_action}`);
      saveStudent();

      break;
    case "update":
      console.log(`This is your choice: ${menu_action}`);
      update();
      break;
    case "displaystudents":
      console.log(`This is your choice: ${menu_action}`);
      readData();
      break;
    case "searchbyname":
      console.log(`This is your choice: ${menu_action}`);
      searchName();
      break;
    case "searchbyreg":
      console.log(`This is your choice: ${menu_action}`);
      searchReg();
      break;
    case "searchbyform":
      console.log(`This is your choice: ${menu_action}`);
      searchForm();
      break;
    case "removestudent":
      console.log(`This is your choice: ${menu_action}`);
      removeStudent();
      break;
    case "0":
      process.exit();
      break;

    default:
      console.log(
        `You cannot provide this option  ${menu_action} refer to this menu as your options; add, update, ...`
      );
      break;
  }
}

menu();
