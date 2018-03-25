# 2. Install dependencies and fill in Remote Map IDs

Install brew

`/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`

Install Mongo

`brew install mongodb --with-openssl`

Install NGINX

`brew install nginx`

Install node

https://nodejs.org/en/download/

Install yarn

`brew install yarn`

Edit your host file:\

`sudo nano /etc/hosts`

`127.0.0.1               lifescope.io www.lifescope.io app.lifescope.io`

Navigate to the Lifescope-Core directory, and in the config folder
create a local.json and production.json copy of config/default.json
Do not commit the production keys to GitHub under penalty of death!


From the top level of the Lifescope-Core directory run:

`yarn install`

to install all of the project-wide dependencies, then go to each sub-directory in the 'lambda' folder ('consumer', 'generator', 'migrations', and 'worker') and run

`yarn install`

to install the dependencies for each Lambda function that we will be setting up shortly.

`sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout devel.key -out devel.crt`

Run NGINX

`sudo nginx -p . -c nginx.conf`


### Migrations

#### Install MongoDB Compass

```
mkdir -p /data/db
sudo chmod -R go+w /data/db
cd /data/db
mongod
```

Run mongo from /data/db

`mongod`

Add remote_map_id for each map to /fixtures/providers folders

Update both scripts in /migrations with your mongodb address

`mongodb://localhost:27017`

Run the migrations

```
node migrations/0001_create_indices.js
node migrations/0002_insert_providers.js
```

gulp devel


Next, go to lambda/migrations/fixtures/providers and open up each JSON file.
You will need to copy the ID of the API Map you made for each service into the 'remote_provider_id' field in the corresponding provider file.
