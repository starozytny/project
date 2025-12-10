FROM php:8.1-fpm

# Installation des dépendances système
RUN apt-get update && apt-get install -y \
    make \
    git \
    unzip \
    libicu-dev \
    libzip-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    curl \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install \
    pdo_mysql \
    intl \
    zip \
    gd \
    exif \
    opcache \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Installation de Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Configuration Git pour résoudre le problème de propriété
RUN git config --global --add safe.directory /var/www/project

# Configuration du répertoire de travail
WORKDIR /var/www/project

# Copie uniquement composer.json et composer.lock d'abord
COPY composer.json composer.lock ./

# Installation des dépendances PHP (sans les scripts)
RUN composer install --no-interaction --no-scripts --no-autoloader --prefer-dist

# Copie de tous les fichiers du projet
COPY . .

# Finalisation de l'installation Composer
RUN composer dump-autoload --optimize && \
    composer run-script --no-interaction post-install-cmd || true

# Permissions
RUN chown -R www-data:www-data /var/www/project

# Exposition du port
EXPOSE 9000

CMD ["php-fpm"]
