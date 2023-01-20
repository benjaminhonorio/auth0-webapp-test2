async function login(email, password, context, callback) {
  const axios = require('axios@0.22.0');
  let response;

  try {
    response = await axios.post(
      //store API url in connection settings to better support SDLC environments
      configuration.BASE_API_URL + '/authenticate',
      //user credentials passed as request body
      {
        email: email,
        password: password,
      },
      {
        timeout: 10000, //end call gracefully if request times out so script can do necessary callback
        headers: {
          'x-api-key': configuration.API_KEY,
        },
      }
    );
  } catch (e) {
    if (e.response.status === 404 || e.response.status === 401) {
      return callback(
        new WrongUsernameOrPasswordError(email, 'Invalid credentials provided.')
      );
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
