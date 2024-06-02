const cron = require("node-cron")
const outlookProvider = require("../email/outlookProvider")

/**
 *  NOTE:
 * SETTING UP CRON JOB BECAUSE DELTA LINKS NEED NGROK SETUP,
 * THIS SETUP IS NOT APPLICABLE WITH THAT WAY OF MONITORING CHANGES.
 * CHANGES ARE DOABLE IN THE FUTURe
 */

// Ensuring crons is running one at a time
let isCronRunning = false

cron.schedule("*/10 * * * * *", async () => {
  if (isCronRunning) {
    console.log("Previous cron job is still running. Skipping...")
    return
  }

  try {
    // Setting the cron to run
    isRunning = true

    await outlookProvider.monitorEmailChanges()
  } catch (error) {
    console.error("Error in cron job:", error)
  } finally {
    // Reset the flag to false after the run completes
    isRunning = false
  }
})
