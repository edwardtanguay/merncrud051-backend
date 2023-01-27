## CREATE ONE PROJECT FOR BOTH BACKEND AND FRONTEND

- open your terminal and go to your project directory
- create a directory for this project, e.g.
  - `mkdir et-mern-crud-site`

## INSTALL BACKEND

### set up directory and editor for backend

- enter your project directory
  - `cd et-mern-crud-site`
- create backend directory
  - `git clone git@github.com:edwardtanguay/et-mern-crud-site-backend.git et-mern-crud-site-backend`
- open VSCode in the backend directory
  - `code et-mern-crud-site-backend`
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

- in your MongoDB Atlas cluster, create a MongoDB database with the name of your project, e.g. `et-mern-crud-site`
- create a collection in it called `books`
- import the file `dev/books.json` into the collection `books` (e.g. with MongoDB Compass)

### create .env file for backend

- create a `.env` file in the root directory of your project and copy in the following content

  ``` text
  APP_NAME = Book Site API
  SECONDS_TILL_SESSION_TIMEOUT = 3600 
  PORT = 5001
  MONGODB_CONNECTION = mongodb+srv://USERNAME:PASSWORD@cluster0.ogshn.mongodb.net/DATABASENAME?retryWrites=true&w=majority
  SESSION_SECRET = RANDOMSTRING
  ADMIN_PASSWORD = ADMINPASSWORD
  FRONTEND_URL = http://localhost:5002
  NODE_ENVIRONMENT = development
  ```

- replace all capitalized variables with appropriate data
  - USERNAME
  - PASSWORD
  - DATABASENAME
  - RANDOMSTRING
  - ADMINPASSWORD
- you can also change the backend/frontend ports if you need to, e.g. to avoid conflicts


### start and test the backend

- `npm run dev`
- click on URL shown in the terminal (e.g. http://localhost:5001)
- click on `/books` link
- change data in your MongoDB database to see that the changes are reflected in the browser

## INSTALL FRONTEND

### set up directory and editor for frontend

- enter your project directory
  - `cd et-mern-crud-site`
- create frontend directory
  - `git clone git@github.com:edwardtanguay/et-mern-crud-site-frontend.git et-mern-crud-site-frontend`
- open VSCode in the frontend directory
  - `code et-mern-crud-site-frontend`
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
  VITE_BACKEND_URL = http://localhost:5001
  ```
  
### start the frontend

- `npm run dev`
- open in browser
- click url in terminal

## DEPLOY BACKEND TO LINUX CLOUD SERVER AT HETZNER

- in your npm scripts, change all references of `et-mern-crud-site` to your site name

  ``` text
  "scripts": {
    "dev": "nodemon",
    "build": "tsc",
    "setup": "pm2 start --name et-mern-crud-site-backend npm -- start",
    "start": "node dist/server.js",
    "deploy": "git pull --no-rebase && npm i && npm run build && pm2 restart et-mern-crud-site-backend --update-env --time && pm2 save"
  },
  ```

- push your backend to a repository on GitHub
- SSH into your Hetzner account
- go to your web projects directory, e.g.
  - e.g. `/var/www`
- clone your repository there
  - e.g. `git clone git@github.com:edwardtanguay/et-mern-crud-site-backend.git`
- navigate into your backend project directory
  - e.g. `cd et-mern-crud-site-backend`
- set up `.env` file
  - replace all capitalized variables with appropriate data
    - USERNAME
    - PASSWORD
    - DATABASENAME
    - RANDOMSTRING
    - ADMINPASSWORD
  - change the FRONTEND_URL appropriately

  ``` text
  APP_NAME = Book Site API
  SECONDS_TILL_SESSION_TIMEOUT = 3600 
  PORT = 5001
  MONGODB_CONNECTION = mongodb+srv://USERNAME:PASSWORD@cluster0.ogshn.mongodb.net/DATABASENAME?retryWrites=true&w=majority
  SESSION_SECRET = RANDOMSTRING
  ADMIN_PASSWORD = ADMINPASSWORD
  FRONTEND_URL = https://et-mern-crud-site.tanguay.eu
  NODE_ENVIRONMENT = production
  ```

- set up the site in pm2
  - `npm run setup`
- deploy your site
  - `npm run deploy`
- test that your application is running
  - in your firewall, add incoming rule for port 5001
  - in your browser, go to e.g. `http://tanguay.eu:5001` (not https)
  - you should see your backend running in the browser
  - in your firewall, remove the rule again
- set up a subdomain for your site, e.g. `et-mern-crud-site-backend.tanguay.eu`
- create nginx config file for your backend site
  - e.g. `/etc/nginx/conf.d/et-mern-crud-site-backend.conf`

    ``` text
    server {
            server_name et-mern-crud-site-backend.tanguay.eu;
            location / {
                    proxy_pass http://tanguay.eu:5001;
            }
    }
    ```

- register the https certificate for this subdomain
  - `sudo certbot --nginx`
  - choose the number of your site
- restart the nginx server
  - `sudo systemctl restart nginx`
- in your browser, go to your site at e.g. [https://et-mern-crud-site-backend.tanguay.eu](https://et-mern-crud-site-backend.tanguay.eu)

## DEPLOY FRONTEND TO LINUX CLOUD SERVER AT HETZNER

- in your npm scripts, change all references of `et-mern-crud-site` to your site name

  ``` text
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "cp": "node cli/cp.mjs",
    "setup": "pm2 start --name et-mern-crud-site-frontend npm -- start",
    "start": "vite preview --host --port 5002",
    "deploy": "git pull --no-rebase && npm i && npm run build && pm2 restart et-mern-crud-site-frontend --update-env --time && pm2 save"
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
  - e.g. `git clone git@github.com:edwardtanguay/et-mern-crud-site-frontend.git`
- navigate into your frontend project directory
  - e.g. `cd et-mern-crud-site-frontend`
- create a `.env` file with the URL of the backend that you just set up

  ``` text
  VITE_BACKEND_URL = https://et-mern-crud-site-backend.tanguay.eu
  ```

- set up the site in pm2
  - `npm run setup`
- deploy your site
  - `npm run deploy`
- test that your application is running
  - in your firewall, add incoming rule for port 5002
  - in your browser, go to e.g. `http://tanguay.eu:5002` (not https)
  - you should see your frontend running in the browser
  - in your firewall, remove the rule again
- set up a subdomain for your site, e.g. `et-mern-crud-site.tanguay.eu` (without `-frontend`)
- create nginx config file for your frontend site
  - e.g. `/etc/nginx/conf.d/et-mern-crud-site.conf` (without `-frontend`)

    ``` text
    server {
            server_name et-mern-crud-site.tanguay.eu;
            location / {
                    proxy_pass http://tanguay.eu:5002;
            }
    }
    ```

- register the https certificate for this subdomain
  - `sudo certbot --nginx`
  - choose the number of your site
- restart the nginx server
  - `sudo systemctl restart nginx`
- in your browser, go to your site at e.g. [https://et-mern-crud-site.tanguay.eu](https://et-mern-crud-site.tanguay.eu)
