async function getByEmail(email, context, callback) {
  const axios = require('axios@0.22.0');
  let response;

  try {
    response = await axios.post(
      configuration.BASE_API_URL + '/get',
      {
        email,
      },
      {
        timeout: 10000,
        headers: {
          'x-api-key': configuration.API_KEY,
        },
      }
    );
  } catch (e) {
    if (e.response.status === 404) {
      return callback(new ValidationError('user_not_found', 'User not found'));
    }
    return callback(new Error(e.message));
  }

  try {
    let user = response.data.data;
    return callback(null, {
      user_id: user.id,
      nickname: user.username,
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
  } catch (e) {
    return callback(new Error(e.message));
  }
}
