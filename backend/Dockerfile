# Use an official Ubuntu base image
FROM ubuntu:22.04

# Set environment variables to prevent interactive prompts during apt-get
ENV DEBIAN_FRONTEND=noninteractive

# Install common system dependencies, PHP, PHP-FPM, Nginx, and Supervisor
RUN apt-get update && apt-get install -y --no-install-recommends \
    software-properties-common \
    gnupg \
    && add-apt-repository -y ppa:ondrej/php \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
    nginx \
    supervisor \
    php8.2-fpm \
    php8.2-common \
    php8.2-mysql \
    php8.2-pgsql \
    php8.2-gd \
    php8.2-curl \
    php8.2-mbstring \
    php8.2-xml \
    php8.2-zip \
    php8.2-tokenizer \
    php8.2-bcmath \
    php8.2-gmp \
    php8.2-soap \
    php8.2-xdebug \
    curl \
    git \
    unzip \
    libpng-dev \
    libjpeg-dev \
    libwebp-dev \
    libfreetype6-dev \
    libzip-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Set the working directory inside the container
WORKDIR /app

# Copy the Laravel application code from the backend directory
# Since Render is building from the 'backend' root directory, '.' is correct here
COPY . /app

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Configure Nginx
# Remove the default nginx config
RUN rm /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default
# Copy your custom nginx config
COPY ./nginx.conf /etc/nginx/sites-available/default
RUN ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/

# Configure PHP-FPM
# Update listen socket path to a tcp port for easier management by Supervisor
RUN sed -i 's/listen = \/run\/php\/php8.2-fpm.sock/listen = 127.0.0.1:9000/' /etc/php/8.2/fpm/pool.d/www.conf

# Configure Supervisor
COPY ./supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Adjust permissions
RUN chown -R www-data:www-data /app/storage \
    && chown -R www-data:www-data /app/bootstrap/cache \
    && chmod -R 775 /app/storage \
    && chmod -R 775 /app/bootstrap/cache \
    && chmod -R 755 /app

# Expose port 80 (Nginx default)
EXPOSE 80

# Use supervisord as the entrypoint
ENTRYPOINT ["/usr/sbin/supervisord"]

# Pass the configuration file argument to supervisord
CMD ["-c", "/etc/supervisor/conf.d/supervisord.conf"]