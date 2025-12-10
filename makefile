git:
	git add .
	git commit -m "$m"

route:
	php bin/console fos:js-routing:dump --format=json --target=public/js/fos_js_routes.json

init_test_db:
	php bin/console --env=test do:sc:up -f

check_test:
	php bin/console do:fi:lo --env=test
	symfony php bin/phpunit

dev:
	git checkout dev
	git push origin dev
	git checkout master
	git pull origin dev
	git push origin master
	git checkout demo
	git pull origin master
	git push origin demo
	git checkout preprod
	git pull origin master
	git push origin preprod
	git checkout demo

build: ## Construit les conteneurs Docker
	docker-compose build

up: ## Démarre les conteneurs
	docker-compose up -d

down: ## Arrête les conteneurs
	docker-compose down

restart: down up ## Redémarre les conteneurs

composer: ## Exécute composer install
	docker-compose exec php composer install

composer-update: ## Exécute composer update
	docker-compose exec php composer update

yarn: ## Installe les dépendances yarn
	docker-compose exec node yarn install

yarn-build: ## Build les assets avec yarn
	docker-compose exec node yarn build

yarn-watch: ## Lance yarn en mode watch
	docker-compose exec node yarn watch

db-create: ## Crée la base de données
	docker-compose exec php php bin/console doctrine:database:create --if-not-exists

db-drop: ## Supprime la base de données
	docker-compose exec php php bin/console doctrine:database:drop --force

db-make-migrate: ## Exécute les migrations
	docker-compose exec php php bin/console make:migration

db-migrate: ## Exécute les migrations
	docker-compose exec php php bin/console doctrine:migrations:migrate --no-interaction

cache-clear: ## Vide le cache
	docker-compose exec php php bin/console cache:clear

permissions: ## Fixe les permissions
	docker-compose exec php chown -R www-data:www-data /var/www/html/var

install: build up composer yarn db-create db-make-migrate db-migrate ## Installation complète du projet

reset: down build up composer yarn db-drop db-create db-make-migrate db-migrate cache-clear ## Reset complet du projet

logs: ## Affiche les logs
	docker-compose logs -f

logs-php: ## Affiche les logs PHP
	docker-compose logs -f php

logs-nginx: ## Affiche les logs Nginx
	docker-compose logs -f nginx
