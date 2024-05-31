const { esclient } = require("../config/config")
const { ESIndices } = require("../constants")
const { BadRequestException } = require("../exceptions/httpsExceptions")

exports.schemaMapper = async () => {
  try {
    const userSchema = {
      id: { type: "keyword" },
      email: {
        type: "text",
      },
      name: {
        type: "text",
      },
      role: {
        type: "text",
      },
    }

    await esclient.indices.putMapping({
      index: ESIndices.User,

      body: {
        properties: userSchema,
      },
    })
  } catch (err) {
    throw new BadRequestException(null, err)
  }
}

exports.responseMapper=(response)=>{
    return  response?.body?.hits?.hits?.map(hit => ({
        id: hit?._id,
        ...hit?._source
    }));
}