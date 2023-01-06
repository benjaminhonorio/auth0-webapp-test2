## Auth0 authentication with regular webapp

Based on [this example](https://auth0.com/blog/complete-guide-to-nodejs-express-user-authentication/)

Simple webapp with basic frontend and nodejs server running on https://<domain_name>:3000

Protected routes:

- https://<domain_name>:3000/user

### Features:

- Frontend with pug template engine (from original with few additional pages, later to be changed)
- Classic web server with nodejs running on node runtime v12.14.0 (I will test it with lts at least just to use latest react or nextjs)
- Https enabled for custom domain localhost with [mkcert](https://dev.to/aschmelyun/using-the-magic-of-mkcert-to-enable-valid-https-on-local-dev-sites-3a3c)
- Authentication with auth0 + passport
- Session management with express-session + redis store
- SMS api service with Twilio (to be integrated in mfa flow)

### Work in Progress

- Add custom mfa/verify page with sms functionality (silly version done)
- Add examples of login/mfa pages for auth0 (Universal Login Page customization)
- Add examples of Actions, Rules and Hooks for extending auth0 flows
- Add examples of Custom Scripts used for auth0 custom database connections

### Todo:

- Build users api to connect with database and query it from auth0 customs scripts (as of now I'm using mongodb database just because MongoAtlas, I can as easily use any db).
- Build frontend with react for webapp or change for nextjs with default server or express server
- Build login page with react (for auth0 login page)
- Build mfa page with react (for auth0 mfa page)
- Configure auth0-deploy-cli
- Add github actions pipeline and deploy the pages, actions, rules, etc., to auth0 with it

### Ideas

- Probably will need ngrok when running the users, sms-api if for some reason I need to hit it from auth0, or deploy the api in some free hosting
- I should build this as a monorepo to include all the apps. But that requires working with later node version since npm supports workspaces from v7 minimum.

### Running the webapp

Create auth0 account, go to dashboard and create Regular Web Application. Copy the credentials into .env file based on .env.example

```
AUTH0_DOMAIN=<your_auth0_domain>
AUTH0_CLIENT_ID=<your_application_client_id>
AUTH0_CLIENT_SECRET=<your_application_client_secret>
AUTH0_CALLBACK_URL=https://<your_custom_domain>:<port>/callback (port for local development e.g https://localhost:3000/callback)
```

Add session secret (any random string) and domain name if needed or just use localhost for that domain

```
SESSION_SECRET=<some_random_string>
AUTH0_CALLBACK_URL=https://<your_custom_domain>:<port>/callback (port for local dev)
DOMAIN=YOUR_APP_DOMAIN
```

Run redis-server (required) and redis-cli (optional for debugging)

```
> redis-server
> redis-cli monitor
> npm run dev
```

Sms api server with Twilio to send and verify sms code (to be used for mfa with auth0)
