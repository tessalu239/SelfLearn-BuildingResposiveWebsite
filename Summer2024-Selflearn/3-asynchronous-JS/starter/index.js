const fs = require("fs");
const { get } = require("http");
const superagent = require("superagent");

//Promises
const readFilePro = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) return reject("I could not find that file 🥲");
      resolve(data);
    });
  });
};

const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) return reject("Could not write to the file 🥲");
      resolve("Success");
    });
  });
};

// readFilePro(`${__dirname}/dog.txt`)
//   .then((data) => {
//     console.log(`Breed:${data}`);

//     return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
//   })
//   .then((res) => {
//     console.log(res.body.message);
//     return writeFilePro("dog-image.txt", res.body.message);
//   })
//   .then(() => {
//     console.log("Random dog image saved to the file!");
//   })
//   .catch((err) => {
//     console.log(err.message);
//   });

//Async/Await
const getDogPic = async () => {
  try {
    const data = await readFilePro(`${__dirname}/dog.txt`);
    console.log(`Breeds: ${data}`);
    const res = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    console.log(res.body.message);

    await writeFilePro("dog-image.txt", res.body.message);
    console.log("Random dog image saved to the file!");
  } catch (err) {
    console.log(err.message);
  }
};
getDogPic();
//Callback hell
// fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
//   console.log(`Breed: ${data}`);
//   superagent
//     .get(`https://dog.ceo/api/breed/${data}/images/random`)
//     .end((err, res) => {
//       if (err) return console.log(err.message);
//       console.log(res.body.message);

//       fs.writeFile("dog-image.txt", res.body.message, (err) => {
//         console.log("Random dog image saved to the file!");
//       });
//     });
// });

// //then catch
// fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
//   console.log(`Breed:${data}`);

//   superagent
//     .get(`https://dog.ceo/api/breed/${data}/images/random`)
//     .then((res) => {
//       console.log(res.body.message);
//       fs.writeFile("dog-image.txt", res.body.message)
//         .then(console.log("Random dog image saved to the file!"))
//         .catch((err) => console.log(err.message));
//     })
//     .catch((err) => console.log(err.message));
// });
