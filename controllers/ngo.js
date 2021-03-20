const logger = require('../logging/logger')
const uuid4 = require('uuid4')
const Ngo = require('../models/ngo')
const jwt = require('jsonwebtoken')
const admin = require('../firebase/firebase')

class NgoController {
  static async login (idToken) {
    try {
      const decoded = await admin.auth().verifyIdToken(idToken)
      const exists = await Ngo.findOne({ where: { email: decoded.email } })
      if (exists) {
        const token = jwt.sign({
          id: exists.ngoId
        }, process.env.SECRET_KEY)
        return {
          error: false,
          code: 200,
          firstLogin: exists.ngoName === '',
          message: 'Ngo Logged In',
          data: exists,
          jwt: token
        }
      }
      const ngo = {
        ngoId: uuid4(),
        email: decoded.email,
        profileUrl: decoded.picture
      }
      const createdNgo = await Ngo.create(ngo)
      const token = jwt.sign({
        id: createdNgo.ngoId
      }, process.env.SECRET_KEY)
      return {
        error: false,
        code: 201,
        firstLogin: true,
        message: 'Ngo Created',
        data: createdNgo,
        jwt: token
      }
    } catch (err) {
      logger.error(err.toString())
      return {
        error: true,
        code: 500,
        message: err.toString()
      }
    }
  }

  static async getDetails (ngoId) {
    try {
      const ngoDetails = await Ngo.findOne({ where: { ngoId: ngoId } })
      if (!ngoDetails) {
        return {
          error: true,
          code: 404,
          message: 'No such ngo exists'
        }
      }
      return {
        error: false,
        code: 200,
        message: 'Ngo Details Fetched',
        data: ngoDetails
      }
    } catch (err) {
      logger.error(err.toString())
      return {
        error: true,
        code: 500,
        message: err.toString()
      }
    }
  }

  static async updateDetails (ngoId, ngoName, ngoDescription) {
    try {
      const exists = await Ngo.findOne({ where: { ngoId: ngoId } })
      if (!exists) {
        return {
          error: true,
          code: 404,
          message: 'No such ngo exists'
        }
      }
      await Ngo.update({
        ngoName: ngoName,
        ngoDescription: ngoDescription
      }, { where: { ngoId: ngoId } })
      return {
        error: false,
        code: 200,
        message: 'Ngo Details Updated'
      }
    } catch (err) {
      logger.error(err.toString())
      return {
        error: true,
        code: 500,
        message: err.toString()
      }
    }
  }
}

module.exports = NgoController
