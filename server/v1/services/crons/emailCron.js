const cron = require("node-cron")
const outlookProvider = require("../email/outlookProvider")
const { getSocketInstance } = require("../socket")


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

    const jobCompleted=await outlookProvider.monitorEmailChanges()

    if(jobCompleted){
        const socketInstance=getSocketInstance()
        
        socketInstance.emit("cron-job-complete", { message: 'Cron job has been completed!' })

        console.log("Email changes monitored and indexed successfully.")
    }


  } catch (error) {
    console.error("Error in cron job:", error)
  } finally {
    // Reset the flag to false after the run completes
    isRunning = false
  }
})
