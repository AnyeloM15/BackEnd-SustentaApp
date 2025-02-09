<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.
This project is being build as a back-end project to UPSRJ app, which is called "SustentaApp"
We're gonna help to the Sustentability department to get an easier way to follow the student's activities during their journeys.

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## You have to remove... and refresh your VS code

```bash
# Apply this command to avoid any problem
$ pnpm remove prettier eslint-config-prettier eslint-plugin-prettier
```

## Initialize the db...

```bash
#Docker
$ docker-compose up -d

```

## Change name from .env_template to .env

## Install dependencies for hashsed password

```bash
$ pnpm install @types/bcrypt --save-dev
$ pnpm add @nestjs/jwt @nestjs/passport passport passport-jwt bcryptjs
$ pnpm add @types/passport-jwt @types/bcryptjs --save-dev

```
