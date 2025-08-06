cd /Volumes/BrainFuck/42_ToolBox/homebrew

mkdir -p heroku
cd heroku

curl https://cli-assets.heroku.com/heroku-darwin-x64.tar.gz -o heroku.tar.gz
tar xvf heroku.tar.gz

export ZSH_DISABLE_COMPFIX=true

export PATH="/Volumes/BrainFuck/42_ToolBox/homebrew/heroku/heroku/bin:$PATH"

source ~/.zshrc

echo $PATH
which heroku

# Login to your Heroku account
heroku login

# Create a new app
heroku create

# Deploy your application
git push heroku main


heroku addons:plans heroku-postgresql
heroku addons:create heroku-postgresql:essential-0
heroku config

heroku git:remote -a <app-name>

git push heroku main




heroku ps
heroku logs --tail
heroku run python manage.py createsuperuser