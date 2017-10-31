Install dependencies - `npm install`
run server:
1. Add a *.env* file
2. create database studio_test and studio
3. typings install
4. npm install
5. tsc tsc src/server/db/seeds/users.ts 
6. tsc src/server/db/migrations/user.ts 
7. tsc src/server/server.ts
8. test: npm test
9. run server: node src/server/server.js

run client:
1: ng build
2: ng server

run Studio: npm run build

Init Database

tsc src/server/db/migrations/**.ts
knex migrate:latest
tsc src/server/db/seed/seeds/**.ts
knex seed:run


Clean up Database

knex migrate:roolback
