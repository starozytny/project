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


