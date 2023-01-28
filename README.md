# Fullstack MERN site which allows multiple users to add/edit/delete items via CRUD API using MongoDB and TypeScript/ES6-Modules on frontend/backend

This starter is a base fullstack MERN site that allows you to have multiple users who can log into the site and see different pages (using React Router) and accomplish different tasks (e.g. admins can delete, edit and addd items). The backend is an API built on Node/Express saving data to a MongoDB database using Mongoose. ES6 modules and TypeScript are used on both backend and frontend (a React site created with Vite). Passwords are saved as hashes in the database with bcrypt. The app is simplified for learning purposes but is ready to use as a basis for any site that needs to have multiple users log in, view various data, and change data.

![grafik](https://starters.tanguay.eu/images/starters/fullstackMernCrudWithMultipleUsersAndSessions.png)

## features

- **frontend:** 
	- Vite/React
	- Sass
	- TypeScript / ES6 modules
	- React Router
	- useContext
	- multiuser login with password
	- react-helmet
	- axios 
  - lodash (cloneDeep)

- **backend:** 
	- Node/Express 
	- TypeScript / ES6 modules
	- simple MVC structure (`server.ts`/`model.ts`)
	- cookie/session authentication
	- MongoDB (local or Atlas)
	- Mongoose
	- bcrypt for hasing passwords
  - CLI command to create bcrypt hashes
  - authorization pattern: accessGroups with anonymousUser

## CREATE ONE PROJECT FOR BOTH BACKEND AND FRONTEND

- open your terminal and go to your project directory
- create a directory for this project, e.g.
  - `mkdir merncrudmulti`

## INSTALL BACKEND

### set up directory and editor for backend

- enter your project directory
  - `cd merncrudmulti`
- create backend directory
  - `git clone git@github.com:edwardtanguay/merncrud051-backend.git merncrudmulti-backend`
- open VSCode in the backend directory
  - `code merncrudmulti-backend`
- open VSCode terminal
- install node_modules
  - `npm i`
- delete old and create new Git repository
  - `rm -rf .git`
  - `git init -b main`
  - make initial commit
- to distinguish your backend VSCode from your frontend VSCode, set the frame color
  - you need the [VSCode Peacock extension](https://marketplace.visualstudio.com/items?itemName=johnpapa.vscode-peacock)
  - **F1**
  - "Peacock: Enter a Color"
  - `navy` (**b**lue for **b**ackend)

### create database

- in your MongoDB Atlas cluster, create a MongoDB database with the name of your project, e.g. `merncrudmulti`
- create a collection in it called `books`
- with MongoDB Compass, import the file `dev/books.json` into the collection `books`
- create a collection in it called `users`
- with MongoDB Compass, import the file `dev/users.json` into the collection `users`

### create .env file for backend

- create a `.env` file in the root directory of your project and copy in the following content

  ``` text
  APP_NAME = Book Site API
  SECONDS_TILL_SESSION_TIMEOUT = 3600
  PORT = 3210
  MONGODB_CONNECTION = mongodb://localhost:27017/merncrudmulti
  SESSION_SECRET = 8234skdfj2834
  FRONTEND_URL = http://localhost:3211
  NODE_ENVIRONMENT = development
  ```

- you can also change the backend/frontend ports if you need to, e.g. to avoid conflicts


### start and test the backend

- `npm run dev`
- click on URL shown in the terminal (e.g. http://localhost:3210)
- click on `/books` link
- change data in your MongoDB database to see that the changes are reflected in the browser
- to test individual routes, see the `test.rest` file (you need the VSCode extension [Rest Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client))

## INSTALL FRONTEND

### set up directory and editor for frontend

- enter your project directory
  - `cd merncrudmulti`
- create frontend directory
  - `git clone git@github.com:edwardtanguay/merncrud051-frontend.git merncrudmulti-frontend`
- open VSCode in the frontend directory
  - `code merncrudmulti-frontend`
- open VSCode terminal
- install node_modules
  - `npm i`
- delete old and create new Git repository
  - `rm -rf .git`
  - `git init -b main`
  - make initial commit
- to distinguish your frontend VSCode from your backend VSCode, set the frame color
  - you need the [VSCode Peacock extension](https://marketplace.visualstudio.com/items?itemName=johnpapa.vscode-peacock)
  - **F1**
  - "Peacock: Enter a Color"
  - `purple` (**f**uchsia for **f**rontend)

### create .env file for frontend

- create an `.env` file in the root directory of your project
- copy in the following content and change backend port if necessary

  ``` text
  VITE_BACKEND_URL = http://localhost:3210
  ```
  
### start the frontend

- `npm run dev`
- open in browser
- click url in terminal

## DEPLOY BACKEND TO LINUX CLOUD SERVER AT HETZNER

- in your npm scripts, change all references of `merncrudmulti` to your site name

  ``` text
  "scripts": {
    "dev": "nodemon",
    "build": "tsc",
    "setup": "pm2 start --name merncrudmulti-backend npm -- start",
    "start": "node dist/server.js",
    "deploy": "git pull --no-rebase && npm i && npm run build && pm2 restart merncrudmulti-backend --update-env --time && pm2 save"
  },
  ```

- push your backend to a repository on GitHub
- SSH into your Hetzner account
- go to your web projects directory, e.g.
  - e.g. `/var/www`
- clone your repository there
  - e.g. `git clone git@github.com:edwardtanguay/merncrudmulti-backend.git`
- navigate into your backend project directory
  - e.g. `cd merncrudmulti-backend`
- set up `.env` file
  - replace all capitalized variables with appropriate data
    - USERNAME
    - PASSWORD
	- CLUSTERNAME
    - DATABASENAME
    - RANDOMSTRING
  - change the FRONTEND_URL appropriately

  ``` text
  APP_NAME = Book Site API
  SECONDS_TILL_SESSION_TIMEOUT = 3600 
  PORT = 3210
  MONGODB_CONNECTION = mongodb+srv://USERNAME:PASSWORD@cluster0.CLUSTERNAME.mongodb.net/DATABASENAME?retryWrites=true&w=majority
  SESSION_SECRET = RANDOMSTRING
  FRONTEND_URL = https://merncrudmulti.tanguay.eu
  NODE_ENVIRONMENT = production
  ```

- set up the site in pm2
  - `npm run setup`
- deploy your site
  - `npm run deploy`
- test that your application is running
  - in your firewall, add incoming rule for port 3210
  - in your browser, go to e.g. `http://tanguay.eu:3210` (not https)
  - you should see your backend running in the browser
  - in your firewall, remove the rule again
- set up a subdomain for your site, e.g. `merncrudmulti-backend.tanguay.eu`
- create nginx config file for your backend site
  - e.g. `/etc/nginx/conf.d/merncrudmulti-backend.conf`

    ``` text
    server {
            server_name merncrudmulti-backend.tanguay.eu;
            location / {
                    proxy_pass http://tanguay.eu:3210;
            }
    }
    ```

- register the https certificate for this subdomain
  - `sudo certbot --nginx`
  - choose the number of your site
- restart the nginx server
  - `sudo systemctl restart nginx`
- in your browser, go to your site at e.g. [https://merncrudmulti-backend.tanguay.eu](https://merncrudmulti-backend.tanguay.eu)

## DEPLOY FRONTEND TO LINUX CLOUD SERVER AT HETZNER

- in your npm scripts, change all references of `merncrudmulti` to your site name

  ``` text
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "cp": "node cli/cp.mjs",
    "setup": "pm2 start --name merncrudmulti-frontend npm -- start",
    "start": "vite preview --host --port 3211",
    "deploy": "git pull --no-rebase && npm i && npm run build && pm2 restart merncrudmulti-frontend --update-env --time && pm2 save"
  },
  ```
  
- note: if you want to change your port in the **start** command, e.g. if 5002 is being used by other site:
  - 1. change it in the start command above
  - 2.  also change it in the `vite.config.ts` file

- push your frontend to a repository on GitHub
- SSH into your Hetzner account
- go to your web projects directory, e.g.
  - e.g. `/var/www`
- clone your repository there
  - e.g. `git clone git@github.com:edwardtanguay/merncrudmulti-frontend.git`
- navigate into your frontend project directory
  - e.g. `cd merncrudmulti-frontend`
- create a `.env` file with the URL of the backend that you just set up

  ``` text
  VITE_BACKEND_URL = https://merncrudmulti-backend.tanguay.eu
  ```

- set up the site in pm2
  - `npm run setup`
- deploy your site
  - `npm run deploy`
- test that your application is running
  - in your firewall, add incoming rule for port 3211
  - in your browser, go to e.g. `http://tanguay.eu:3211` (not https)
  - you should see your frontend running in the browser
  - in your firewall, remove the rule again
- set up a subdomain for your site, e.g. `merncrudmulti.tanguay.eu` (without `-frontend`)
- create nginx config file for your frontend site
  - e.g. `/etc/nginx/conf.d/merncrudmulti-frontend.conf`

    ``` text
    server {
            server_name merncrudmulti.tanguay.eu;
            location / {
                    proxy_pass http://tanguay.eu:3211;
            }
    }
    ```

- register the https certificate for this subdomain
  - `sudo certbot --nginx`
  - choose the number of your site
- restart the nginx server
  - `sudo systemctl restart nginx`
- in your browser, go to your site at e.g. [https://merncrudmulti.tanguay.eu](https://merncrudmulti.tanguay.eu)


## more starters, templates and frameworks

https://starters.tanguay.eu
