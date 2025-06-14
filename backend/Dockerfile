# Use an official Ubuntu base image
FROM ubuntu:22.04

# Set locale to prevent issues with some commands
RUN apt-get update && apt-get install -y locales \
    && locale-gen en_US.UTF-8 \
    && update-locale LC_ALL=en_US.UTF-8 LANG=en_US.UTF-8
ENV LANG=en_US.UTF-8
ENV LC_ALL=en_US.UTF-8

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

# Verify supervisord executable path
RUN which supervisord

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Set the working directory inside the container
WORKDIR /app

# Copy the Laravel application code from the backend directory
# Since Render is building from the 'backend' root directory, '.' is correct here
COPY . /app

# Explicitly set LOG_CHANNEL to stderr for Render logging
ENV LOG_CHANNEL=stderr

# Allow Composer to run plugins as root during build
ENV COMPOSER_ALLOW_SUPERUSER=1

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Configure Nginx
# Remove the default nginx config
RUN rm /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default
# Copy your custom nginx config
COPY ./nginx.conf /etc/nginx/sites-available/default
RUN ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/

# Configure PHP-FPM
# Create directory for PHP-FPM PID and socket files and set permissions
RUN mkdir -p /run/php && chown -R www-data:www-data /run/php

# Update listen socket path to a tcp port for easier management by Supervisor
RUN sed -i 's/listen = \/run\/php\/php8.2-fpm.sock/listen = 127.0.0.1:9000/' /etc/php/8.2/fpm/pool.d/www.conf \
    && echo "clear_env = no" >> /etc/php/8.2/fpm/pool.d/www.conf

# Direct PHP-FPM's error log to stderr and enable aggressive logging
RUN echo "php_admin_value[error_log] = /dev/stderr" >> /etc/php/8.2/fpm/pool.d/www.conf \
    && echo "php_admin_flag[log_errors] = on" >> /etc/php/8.2/fpm/pool.d/www.conf \
    && echo "catch_workers_output = yes" >> /etc/php/8.2/fpm/pool.d/www.conf

# Add custom php.ini for FPM to ensure errors are displayed in logs
RUN echo "display_errors = On" >> /etc/php/8.2/fpm/php.ini \
    && echo "display_startup_errors = On" >> /etc/php/8.2/fpm/php.ini \
    && echo "error_reporting = E_ALL" >> /etc/php/8.2/fpm/php.ini

# Explicitly disable OPCache for debugging early boot issues
RUN echo "opcache.enable = 0" >> /etc/php/8.2/fpm/php.ini \
    && echo "opcache.enable_cli = 0" >> /etc/php/8.2/fpm/php.ini

# Set PHP-FPM memory limit for application processes
RUN echo "memory_limit = 512M" >> /etc/php/8.2/fpm/php.ini

# Configure Supervisor
# Create directory for supervisor log files
RUN mkdir -p /var/log/supervisor && chown -R root:root /var/log/supervisor

COPY ./supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Adjust permissions
RUN chown -R www-data:www-data /app/storage \
    && chown -R www-data:www-data /app/bootstrap/cache \
    && chmod -R 775 /app/storage \
    && chmod -R 775 /app/bootstrap/cache \
    && chmod -R 755 /app

# Expose port 80 (Nginx default)
EXPOSE 80

# Copy the startup script into the container
COPY ./start.sh /usr/local/bin/start.sh
# Make the startup script executable
RUN chmod +x /usr/local/bin/start.sh

# Use the startup script as the entrypoint
ENTRYPOINT ["/usr/local/bin/start.sh"]