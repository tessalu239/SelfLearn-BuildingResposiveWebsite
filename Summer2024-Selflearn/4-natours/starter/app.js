const express = require('express');
const fs = require('fs');
const app = express();

// app.get('/', (req, res) => {
//   //Basic send method
//   //res.status(200).send('Hello World');

//   //Using send json method
//   res.status(200).json({ message: 'Hello World', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.send('You can post to this URL...');
// });
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      tours: tours,
    },
  });
});
const port = 3000;
app.listen(port, () => {
  console.log(`Listening on the port ${port}...`);
});
