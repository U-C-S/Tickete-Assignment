# Tickete Backend Assignment Submission

## Technologies used

- Fastify
- Prisma
- PostgreSQL
- TypeScript

Deployed in Render - https://chanakya-tickete-test.onrender.com

## How to run the project

1. Clone the repository
2. Run `npm install` to install all the dependencies
3. create a postgres database (hosted or local)
4. create `.env` file in the root directory and add the following variables

```env
TICKETE_API_KEY=xxxx

POSTGRES_PRISMA_URL="postgresql://postgres:user@db.something.com:5432/postgres"
```

5. use `npx prisma generate` to generate the prisma client bindings and types
6. use `npm run dev` to run the project in development mode, while `npm build` and `npm start:prod` to run in production mode

## Additional Notes/Reasoning

- Initially, I had planned to use `fastify` and migrate the project to `Nestjs` as I am more comfortable with Fastify, while its been a while since I used Nestjs. but decided to stick with Fastify as I was running out of time, with focus on writing quality code.
- I underestimated certain aspects of the assignment, like Deploying Vercel (which is Serverless thus stateless, needs additional setup to persist some state related to Inventory Syncing). I had to switch to Render later on, which uses traditional servers that runs on (despite having step down after 15mins of idle time).
- while vercel supports cron jobs they are only limited to 2 runs per day and Render needs a pro account/payment to run cron jobs. Thus, __cron jobs are out of scope__.
- I have __learnt__ the existence of some library functions like - [sturturedClone](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone) and [Prisma's Upsert](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#upsert) while working on this assignment.
- The current implementation of Inventory Syncing may not be ideal, but I tried my best in making it bit __scalable__. it uses __chunking and batching__ to reduce the load on RAM. Thus, effictively reducing the rate of failure. (like I have noticed before using this technique)
- I have also tried to __handle the errors__ as much as possible, but I am sure there are some edge cases that I have missed - like there is an occasional issue related to race conditions when pushing data to db, which throws __Unique Constraint Violation__ error, which I fixed in most cases and also took most of my time in debugging (like 60% of assignment time).

## API Created

- `/api/v1/experience/<id>/slots?date=<date>`
- `/api/v1/experience/<id>/dates`
- `/api/v1/sync/resume`
- `/api/v1/sync/pause`
- `/api/v1/sync/status`
- `/test`
