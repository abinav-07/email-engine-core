const { esclient } = require("../config/config")
const { ESIndices } = require("../enums")
const { BadRequestException } = require("../exceptions/httpsExceptions")

const init = async () => {
  try {
    // Ensure indices exist
    await ensureIndices()

    // Seed initial data
    await seedInitialData()

    console.log("Initialization completed successfully")
  } catch (err) {
    console.error("Initialization failed:", err)
    throw new BadRequestException(null, err)
  }
}

const ensureIndices = async () => {
  try {
    for (const key in ESIndices) {
      let index = ESIndices[key]
      const indexExists = await esclient.indices.exists({ index })
      if (indexExists?.body) {
        console.log(`Index '${index}' already exists`)
      } else {
        await esclient.indices.create({ index })
        console.log(`Index '${index}' created successfully`)
      }
    }
  } catch (err) {
    throw new Error(`Failed to ensure indices: ${err.message}`)
  }
}

const seedInitialData = async () => {
  try {
    const userIndex = ESIndices.User
    const userExists = await esclient.exists({
      index: userIndex,
      type: "_doc",
      id: "1",
    })

    if (!userExists?.body) {
      await esclient.index({
        index: userIndex,
        type: "_doc",
        id: "1",
        body: {
          name: "John Don ho",
          email: "admin@gmail.com",
          role: "Admin",
          password: "$2a$12$rEp6m9wsUklwdoVhrQ7gnOW1RtfbzGj/Eme2XVrfJbiwjFk/H6oMa",
          created_at: new Date(),
        },
      })
      console.log("User seeded successfully")
    } else {
      console.log("User already exists, skipping seeding")
    }
  } catch (err) {
    throw new Error(`Failed to seed initial data: ${err.message}`)
  }
}

module.exports = init
