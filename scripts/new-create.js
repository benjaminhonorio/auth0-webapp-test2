async function create(user, context, callback) {
  const axios = require('axios@0.22.0');
  let response;

  try {
    response = await axios.post(configuration.BASE_API_URL + '/create', user, {
      timeout: 10000,
      headers: {
        'x-api-key': configuration.API_KEY,
      },
    });
  } catch (e) {
    if (e.response.status === 409) {
      return callback(
        new ValidationError('user_exists', 'User already exists')
      );
    }
    return callback(new Error(e.message));
  }
  // Return `null` value in callback if user creation operation succeeded
  return callback(null);
}
