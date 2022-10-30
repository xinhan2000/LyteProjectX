<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" />
</p>

  <p align="center">Project X is used to fast verify the idea to support user's payout and deposit information as an agent. </p>

## Tech stack

Server: [Node.js](https://nodejs.org/en/) as a javaScript runtime  
Web framework: [Nest.JS](https://nestjs.com/)  
Database: MySql  
Object-Relational Mapping (ORM) framework: [TypeORM](https://typeorm.io/)  
Frontend framework: [Vue.js](https://vuejs.org/)  
Frontend UI framework: [Element Plus](https://element-plus.org/en-US/)

## Environment setup

#### 1. HTTPS support

_If deploy the project under production server, it might need add the HTTPS support. If deploy on cloud environment, it might not need to add the HTTPS support._

1. Certificate file is under cert folder, which is signed to projectx.i234.me. It needs be replaced with the certificate of production server.
2. It'd better to put them into the production environment separately rather than check in to the source code, and modify the path in main.ts

#### 2. MySql configuration

1. MySql database connection configuration is under database/database_config.ts.
2. It'd better to define the configuration settings into environment variables to avoid check in to the source code.

## Database setup

#### 1. Database initialization

1. Please follow up instructions to install MySql, depends on the server environment, it may has different instructions.
2. After setup MySql, use command tool or UI based database tools like [DBeaver](https://dbeaver.io/) or [TablePlus](https://tableplus.com/) and connect to MySql.
3. Create a new database named "projectx".
   `The database name can be changed to anything but don't forget change the database configuration settings`

#### 2. Setup database schema

1. Go to database/database_config.ts and modify "synchronize" to true.
2. Launch the debug build and start up the server, it will automatically create the necessary database table schemas.
3. Don't forget to change "synchronize" to false again.  
   :x: **DON'T CHANGE "synchronize" TO TRUE IN PRODUCTION ENVIRONMENT!!!**  
   :wrench: _[TODO] There should have another way to prepare the database schemas rather than this way_

#### 3. Prepare the initial data in the table.

```bash
node database/data_initializer.ts
```

_This will upsert the necessary data into the tables_

## Project structure

web `ProjectX root folder`  
├── cert `certification folder`  
├── database `database configuration, schema and initializer`  
├── dist `product build folder`  
├── node_modules  
├── src `backend source code`  
├── test `test folder`  
└── webapp `frontend page`

## OAuth2 integration

_Oauth2 integration is under src/oauth2_

#### 1. Youtube

[API document](https://developers.google.com/adsense/management) | [Reference](https://developers.google.com/identity/protocols/oauth2)

1. Youtube Adsense API requires the oauth2 callback server supports HTTPS
2. It requires the server verified by Google. Google will generate a verification file and it needs be put into the server. Example is under webapp/public/verify/google1517b3a990c297df.html
3. Youtube's oauth2 API only supports authorization flow.

#### 2. Patreon

[API document](https://docs.patreon.com/#introduction)

1. Patreon's oauth2 API supports both authorization and password flow.

#### 3. Shopify

[API document](https://shopify.dev/api/admin-rest/2022-07/resources/balance)

1. Shopify is speficial comparing to other platforms. The API provided is to acquire the store's information rather than customers.
2. When setup account, if needs use payment API, please setup payment information in the account firstly, otherwise, the API call will fail and no explicit information will be exposed.
3. Shopify's oauth2 flow doesn't follow the [standard oauth2 protocol](https://www.rfc-editor.org/rfc/rfc6749#section-4.1.2). For example, it [redefines state parameter](https://theunlikelydeveloper.com/shopify-oauth-flow-state-param/), the state parameter can't be used to pass the status anymore, it might need [use the session cookie to store the state](https://community.shopify.com/c/shopify-apis-and-sdks/oauth-state-parameter/td-p/144247).
4. Other than state parameter, Shopify also deviated the protocol in other areas, so in the implementation, it uses Shopify's own API to acquire the data, rather than use the standard way.
5. Shopify's oauth2 API only supports authorization flow.

## Running the server

#### 1. Visual Studio Code script

Please refer to ./vscode/launch.json

#### 2. command tool

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Running the frontend web app

#### 1. Running the web app in a separate server

```bash
$ cd webapp

$ npm run serve
# It will run a separate server under http://localhost:8080/ by default.
```

_Recommended way for debug purpose only_

#### 2. Running the web app as the static content

```bash
$ cd webapp

# Build and deploy the content under webapp/dist folder
$ npm run build

# Follow up "Running the server" section to launch the server
```

_Recommended way to test frontend and backend together_

## APIs

#### 1. Oauth2 APIs

Authorization flow:

```bash
# HTTP GET
https://[Host]/oauth2/code?company=[youtube|patreon|shopify]
```

Password flow:

```bash
# HTTP POST
https://[Host]/oauth2/password
# HTTP body
company=[patreon]&username=[a@gmail.com]&password=[123456]
```

#### 2. Web app

It's under the root path:

```bash
# HTTP GET
https://[Host]/
```

#### 3. API documents

```bash
# HTTP GET
https://[Host]/api
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
