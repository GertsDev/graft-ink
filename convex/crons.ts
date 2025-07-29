// convex/crons.ts
import { cronJobs } from "convex/server";
import { internal } from "./_generated/api"; // Add this import

const crons = cronJobs();
crons.interval("keep-alive", { minutes: 1 }, internal.tasks.keepAlive, {});

export default crons;
