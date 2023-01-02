function (user, context, callback) {
    const namespace = 'https://example.com/';
    if (user) {
      context.idToken[namespace + '_age'] = user.user_metadata.age;
      context.idToken[namespace + '_phone'] = user.user_metadata.phone;
    }
    callback(null, user, context);
  }
