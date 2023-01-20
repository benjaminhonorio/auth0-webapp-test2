function login(email, encodedPassword, context, callback) {
  const bcrypt = require('bcrypt');
  const [password, country, lang] = encodedPassword.split('|');
  // no difference between decoding encodedPassword with password in base64
  let decodedPassword = Buffer.from(password, 'base64').toString();
  //let decodedPassword = encodedPassword;
  console.log(password, encodedPassword, decodedPassword);
  const MongoClient = require('mongodb@3.1.4').MongoClient;
  const client = new MongoClient(
    'mongodb+srv://<user>:' +
      configuration.MONGO_PASSWORD +
      '@<cluster>.mongodb.net/?retryWrites=true&w=majority'
  );
  client.connect(function (err) {
    if (err) return callback(err);

    const db = client.db('db-name');
    const users = db.collection('users');

    users.findOne({ email: email }, function (err, user) {
      if (err || !user) {
        client.close();
        return callback(err || new WrongUsernameOrPasswordError(email));
      }
      if (email === '407@latam.com') {
        return callback({
          code: 407,
          description: 'This is wrong',
        });
      }
      bcrypt.compare(decodedPassword, user.password, function (err, isValid) {
        client.close();

        if (err || !isValid)
          return callback(err || new WrongUsernameOrPasswordError(email));

        return callback(null, {
          user_id: user._id.toString(),
          nickname: user.nickname,
          email: user.email,
          mfa_factors: user.phone
            ? [
                {
                  phone: {
                    value: user.phone,
                  },
                },
              ]
            : [],
          user_metadata: {
            age: user.age || '',
            phone: user.phone,
          },
        });
      });
    });
  });
}
