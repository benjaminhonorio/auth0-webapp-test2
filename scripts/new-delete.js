async function deleteUser(id, context, callback) {
  const axios = require('axios@0.22.0');

  try {
    await axios.delete(
      configuration.BASE_API_URL + '/delete',
      {
        id,
      },
      {
        timeout: 10000,
        headers: {
          'x-api-key': configuration.API_KEY,
        },
      }
    );
  } catch (e) {
    return callback(new Error(e.message));
  }
  return callback(null);
}
