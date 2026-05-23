const mongoose = require('mongoose');

const uri = 'mongodb+srv://srilunagulapalli396:Srilu396@cluster0.lfaau.mongodb.net/taskmanager_db?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(uri)
  .then(() => {
    console.log('SUCCESS: Connected to MongoDB!');
    process.exit(0);
  })
  .catch(err => {
    console.error('FAILED:', err.message);
    process.exit(1);
  });
