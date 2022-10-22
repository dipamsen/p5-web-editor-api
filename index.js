import Client from "./client.js";
import dotenv from "dotenv";
import inquirer from "inquirer";

dotenv.config();

async function main() {
  const client = new Client();

  if (process.env.P5_USERNAME && process.env.P5_PASSWORD) {
    await client.login({
      username: process.env.P5_USERNAME,
      password: process.env.P5_PASSWORD,
    });
  } else {
    const { username, password } = await inquirer.prompt([
      {
        type: "input",
        name: "username",
        message: "Enter your p5.js username",
      },
      {
        type: "password",
        name: "password",
        mask: "*",
        message: "Enter your p5.js password",
      },
    ]);
    await client.login({ username, password });
  }

  const allSketches = await client.getSketch("");

  const { sketchId } = await inquirer.prompt([
    {
      type: "list",
      name: "sketchId",
      message: "Choose Sketch",
      choices: allSketches.map((s) => ({
        name: `${s.name} (${s.id})`,
        value: s.id,
        short: s.id,
      })),
      loop: false,
    },
  ]);
  const sketch = await client.getSketch(sketchId);
  const fileNames = sketch.files
    .filter((f) => f.fileType === "file" && f.content)
    .map((f) => f.name);
  const { file } = await inquirer.prompt([
    {
      type: "list",
      name: "file",
      message: "Which file do you want to edit?",
      choices: fileNames,
    },
  ]);
  const fileContent = sketch.files.find((f) => f.name === file).content;
  // console.log(fileContent);

  const { newContent } = await inquirer.prompt([
    {
      type: "editor",
      name: "newContent",
      message: "Edit the file",
      postfix: "." + file.split(".").pop(),
      default: fileContent,
    },
  ]);
  // console.log(newContent);

  const { save } = await inquirer.prompt([
    {
      type: "confirm",
      name: "save",
      message: "Do you want to update your changes to the web editor?",
    },
  ]);
  if (save) {
    const res = await client.updateSketch(sketch, file, newContent);
    console.log(res);
  }
}

main();
