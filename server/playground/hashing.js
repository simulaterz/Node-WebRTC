const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc';

// bcrypt.genSalt(10, (err, salt) => {
//   bcrypt.hash(password, salt, (err, hash) => {
//     console.log(hash);
//   });
// });

var hashPassword = '$2a$10$6E8OusImb1SqIMWnKp52GuEGoSczGgJXjGvKz.Yq9sScbmOpqx.ka';

bcrypt.compare(password, hashPassword, (err, res) => {
  console.log(res);
});

// var data = {
//   id: 10
// };
//
// var token = jwt.sign(data, '123abc');
// console.log(token);
//
// var decoded = jwt.verify(token, '123abc');
// console.log('decoded', decoded);

// var message = 'I am user number 3';
// var hash = SHA256(message).toString();
//
// console.log('hash is ', hash);
//
// var data = {
//   id: 4
// }
//
// var token = {
//   data: data,
//   hash: SHA256(JSON.stringify(data) + 'secret').toString()
// }
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'secret').toString();
//
// if (resultHash === token.hash) {
//   console.log('Data was not changed');
// } else {
//   console.log('Not trust!');
// }
