const Joi = require("joi")
const { ValidationException } = require("../../exceptions/httpsExceptions")

//Queries
const PageQueries = require("../../queries/pages")
const PageFeatureQueries = require("../../queries/page_features")
const { sequelize } = require("../../models")

/**
 * @api {get} /v1/admin/pages Get All pages
 * @apiName GetAll
 * @apiGroup Pages
 * @apiDescription Get All pages with child table
 *
 *
 * @apiParamExample {json} Request Example:
 * {
 *    "pages": PagePayload
 * }
 *
 * @apiSuccess {Object} Success message
 *
 * @apiSuccessExample {json} Success Response:
 * HTTP/1.1 200 OK
 * {
 *    "pages": PagePayload
 * }
 *
 * @apiError {Object} error Error object if the update process fails.
 *
 * @apiErrorExample {json} Error Response:
 * HTTP/1.1 500 Internal Server Error
 * {
 *    "error": "Error message"
 * }
 */

const getAll = async (req, res, next) => {
  try {
    // Get All Pages with child table data
    const getAllPages = await PageQueries.getAll(
      {
        include:{
          all:true,
          separate: true
        }
      }
    )

      
    res.status(200).json(getAllPages)
  } catch (err) {
    next(err)
  }
}

/**
 * @api {post} /v1/admin/pages/create Pages
 * @apiName CreatePages
 * @apiGroup Pages
 * @apiDescription Create Pages and Features
 *
 * @apiParam {String} page_url Name of feature
 * @apiParam {object} extracted_data Extracted Data
 *
 * @apiParamExample {json} Request Example:
 * {
 *    "success": true
 * }
 *
 * @apiSuccess {Object} Success message
 *
 * @apiSuccessExample {json} Success Response:
 * HTTP/1.1 200 OK
 * {
 *    "success": true,
 * }
 *
 * @apiError {Object} error Error object if the update process fails.
 *
 * @apiErrorExample {json} Error Response:
 * HTTP/1.1 500 Internal Server Error
 * {
 *    "error": "Error message"
 * }
 */
const create = async (req, res, next) => {
  // get payload
  const data = req.body
  let t;

  // Joi validations
  const schema = Joi.object({
    page_url: Joi.string().required(),
    extracted_data: Joi.array().items(Joi.object({
      type:Joi.string().required(),
      value:Joi.string().required(),
    }
    )).required(),
  })

  const validationResult = schema.validate(data, { abortEarly: false })
  try {
    // First, we start a transaction from your connection and save it into a variable
    t = await sequelize.transaction()
    if (validationResult && validationResult.error)
      throw new ValidationException(null, validationResult.error)

    // Check if page already exists
    let getPage = await PageQueries.getPage({
      url: data?.page_url,
    })

    if (getPage){
      // Delete all prev features
      await PageFeatureQueries.delete({
        where:{
          page_id:getPage?.id
        }
      },t)
    }else{
      // Create new page if page was not available
      getPage=await PageQueries.createPage({
        url:data?.page_url
      },t)
    }

    // Add all new features
    for(const extractedElement of data?.extracted_data){
        await PageFeatureQueries.create({
          type:extractedElement?.type,
          value:extractedElement?.value,
          page_id:getPage?.id
        },t)
      
    }

    await t.commit()

    res.status(200).json({
      success: true,
    })
  } catch (err) {
    await t.rollback()
    next(err)
  }
}


/**
 * @api {delete} /v1/admin/pages/:page_id/delete Delete Page
 * @apiName deleteOne
 * @apiGroup Pages
 * @apiDescription Delete Pages and its child datas
 *
 * @apiParam {number} page_id Page Id
 *
 * @apiSuccess {Object} Returns the JSON object representing the success message.
 *
 * @apiSuccessExample {json} Success Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true
 *     }
 *
 * @apiError {Object} error Error object if the deletion process fails.
 *
 * @apiErrorExample {json} Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "Err message."
 *     }
 */
const deleteOne = async (req, res, next) => {
  // get payload
  const data = req.params
  let t
  try {
    // First, we start a transaction from your connection and save it into a variable
    t = await sequelize.transaction()

    // Check if Pages exists in our DB
    const checkFeatures = await PageQueries.getPage({ id: data?.page_id })

    if (!checkFeatures) throw new ValidationException(null, "Page not found!")

    // Delete Pages
    await PageFeatureQueries.delete({
      where:{page_id:data?.page_id}
    },t)

    await PageQueries.delete(data?.page_id,t)

    const payload = {
      success: true,
    }

    await t.commit()

    res.status(200).json(payload)
  } catch (err) {
    await t.rollback()
    next(err)
  }
}

module.exports = {
  create,
  getAll,
  deleteOne,
}
