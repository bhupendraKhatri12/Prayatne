# Prayatna App
### This is a  application built with NestJS for sending emails using the @nestjs-modules/mailer module. It includes functionality to convert HTML to PDF and send the generated PDF as an email attachment, with intercetor and response utils created to get same type of response and swagger documentation added.

* Getting Started
* Prerequisites
* Node.js (v14 or higher)
* npm (v6 or higher)

Installation
Clone the repository:




### Configuration
Create a .env file in the root of the project and add the following content with your email credentials:
NODE_ENV=development
APP_PORT=3000
APP_NAME="Pratyatna API"
API_PREFIX=api
APP_FALLBACK_LANGUAGE=en
APP_HEADER_LANGUAGE=x-custom-lang
FRONTEND_DOMAIN=http://localhost:3000
BACKEND_DOMAIN=http://localhost:3000

#Database

DATABASE_TYPE=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=qwerty
DATABASE_NAME=Api