/**
* Handler that will be called during the execution of a PostLogin flow.
*
* @param {Event} event - Details about the user and the context in which they are logging in.
* @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
*/
exports.onExecutePostLogin = async (event, api) => {
  console.log('redirect event', event)
    const YOUR_AUTH0_DOMAIN = event.secrets.YOUR_AUTH0_DOMAIN || event.request.hostname
  // Craft a signed session token
  // Podria hacer la solicitud del challenge aqui
  // pasar el password del usuario como propiedad desde el login script, usarlo aqui, eliminarlo luego
    const token = api.redirect.encodeToken({
        secret: event.secrets.MY_REDIRECT_SECRET,
        expiresInSeconds: 60,
        payload: {
          phone: event.user.user_metadata.phone,
          continue_uri: `https://${YOUR_AUTH0_DOMAIN}/continue`
    }});
    api.redirect.sendUserTo("https://myapp.example:3000/mfa",{
      query: { session_token: token }
    });
};

/**
* Handler that will be invoked when this action is resuming after an external redirect. If your
* onExecutePostLogin function does not perform a redirect, this function can be safely ignored.
*
* @param {Event} event - Details about the user and the context in which they are logging in.
* @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
*/
exports.onContinuePostLogin = async (event, api) => {

  if (event.request.query.sms_code !== '123456') {
    return api.access.deny("Unauthorized");
  }
}
