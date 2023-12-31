# Tickete Backend Assignment Submission

## Technologies used

- Fastify
- Prisma (Schema file available under `prisma/schema.prisma`)
- PostgreSQL
- TypeScript

Deployed in Render - https://chanakya-tickete-test.onrender.com (deployed server can take a while to wake up)

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

## API Created

Type Definitions are available in `types/slotsResponse.d.ts`

- `/api/v1/experience/<id>/slots?date=<date>` ([sample api](https://chanakya-tickete-test.onrender.com/api/v1/experience/14/slots?date=2023-11-28))
- `/api/v1/experience/<id>/dates` ([sample api](https://chanakya-tickete-test.onrender.com/api/v1/experience/14/dates))
- `/api/v1/sync/resume`
- `/api/v1/sync/pause`
- `/api/v1/sync/status`
- `/test`

## Additional Notes/Reasoning

### Platform

- Initially, I had planned to use `fastify` and migrate the project to `Nestjs` as its been a while since I used Nestjs. but decided to stick with Fastify as I need extra bit of time to relearn it.
- I initially planned to Deploy in Vercel but due to it being only "Serverless" thus app loses state and has only 10secs runtime and vercel cron jobs are only limited to 2 runs per day as per docs in free plan. I had to look into Render very later on, which uses traditional servers that runs on, found that it is better suited for this.
- One MAJOR LIMITATION of Render is the server falls sleep after 15mins of idle time ([Spinning down](https://render.com/docs/free#spinning-down-on-idle)) because of this the periodic inventory fetching is halted. since I am also not storing any state related to inventory fetching, fetching after waking the server up starts from zero.

### Code

- I have also tried to **handle the errors** as much as possible, but I am sure there are some edge cases that I have missed - like there is an occasional issue related to race conditions when pushing data to db, which throws **Unique Constraint Violation** error, which I fixed in most cases and also took most of my time in debugging (like 60-70% of assignment time).
- For Normalization of database schema, I took inspiration out of give sample apis (the holdup-api.tickete ones), managed to acheive the similar while handling the duplicate values during syncing.

### Performance

- The current implementation of Inventory Syncing may not be ideal, but I tried my best in making it bit **scalable**. it uses **chunking and batching** to reduce the load on RAM. Thus, effictively reducing the rate of failure. (like I have noticed before using this technique)
- I have also managed to achieve effective time which can make syncing with 450products every 15mins possible. I have found this with during one of the benchmarks where I was able make 62requests (for 2 product Ids over a month) in 127secs. I have made the source code available under `/others/months.ts` that did this - runnable with `npx ts-node ./others/month.ts`

### Other

- I have **learnt** the existence of some library functions like - [sturturedClone](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone) and [Prisma's Upsert](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#upsert) while working on this assignment.
