function getByEmail(email, context, callback) {
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
      client.close();

      if (err) return callback(err);
      if (!user) return callback(null, null);

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
        user_medatada: {
          age: user.age || '',
        },
      });
    });
  });
}
