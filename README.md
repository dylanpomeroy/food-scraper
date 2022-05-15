# Food Scraper

## Description

A NextJS app that parses online food recipes selected and generates a markdown shopping list and recipe details

## Run development

```
yarn install
yarn dev
```

App will be hosted on http://localhost:3000

## Run production

### First time setup

Install nginx

```
sudo apt install nginx
```

Install curl

```
sudo apt install curl
```

Install Yarn

```
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update && sudo apt install yarn
sudo apt update && sudo apt install --no-install-recommends yarn
```

Install pm2

```
wget -qO- https://getpm2.com/install.sh | bash
```

Install packages

```
cd food-scraper
yarn install
```

Build app

```
yarn build
```

Run app via pm2

```
pm2 start yarn --name "food-scraper" --interpreter bash -- start
pm2 show food-scraper
```

Setup pm2 to run app on startup

```
pm2 startup
pm2 save
```

See source with more info: https://dev.to/reactstockholm/setup-a-next-js-project-with-pm2-nginx-and-yarn-on-ubuntu-18-04-22c9

### Updating and Monitoring

Monitor app

```
pm2 monit
```

Deploy a new version from git

```
git fetch
git pull
yarn install
yarn build
pm2 restart food-scraper
```
