var {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // deleteMany

  // deleteOne

  // findOneAndDelete

  // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
  //   console.log(result);
  // });
  // 
  // db.collection('Users').findOneAndDelete({_id: new ObjectID('58f63953c74c791316f18624')}).then((result) => {
  //   console.log(JSON.stringify(result, undefined, 2));
  // });

  // db.close();
});
