import Queue from "bull";
import { createTeamForUser } from "./teamService";

export const teamCreationQueue = new Queue("team creation", {
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: Number.parseInt(process.env.REDIS_PORT || "6379"),
  },
});

export const initializeQueue = async () => {
  teamCreationQueue.process("createTeam", async (job) => {
    const { userId } = job.data;
    await createTeamForUser(userId);
  });

  console.log("Queue initialized successfully");
};
