Install dependencies - `npm install`
run server:
1. Add a *.env* file
2. create database studio_test and studio
3. tsc tsc src/server/db/seeds/users.ts 
4. tsc src/server/db/migrations/user.ts 
5. tsc src/server/server.ts
6. test: npm test
7. run server: node src/server/server.js

run client:
1: ng build
2: ng server
