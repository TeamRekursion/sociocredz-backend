const admin = require('../firebase/firebase')
const logger = require('../logging/logger')
const uuid4 = require('uuid4')
const User = require('../models/users')
const jwt = require('jsonwebtoken')
const Donation = require('../models/donation')
const Points = require('../models/points')

class UserController {
  static async login (idToken) {
    try {
      const decoded = await admin.auth().verifyIdToken(idToken)
      const exists = await User.findOne({ where: { email: decoded.email } })
      if (exists) {
        const token = jwt.sign({
          id: exists.userId
        }, process.env.SECRET_KEY)
        return {
          error: false,
          code: 200,
          message: 'User Logged In',
          data: exists,
          jwt: token
        }
      }
      const user = {
        userId: uuid4(),
        userName: decoded.name,
        email: decoded.email,
        userProfileUrl: decoded.picture
      }
      const createdUser = await User.create(user)
      const token = jwt.sign({
        id: createdUser.userId
      }, process.env.SECRET_KEY)
      return {
        error: false,
        code: 201,
        message: 'User Created',
        data: createdUser,
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

  static async getDetails (userId) {
    try {
      const userDetails = await User.findOne({ where: { userId: userId } })
      if (!userDetails) {
        return {
          error: true,
          code: 404,
          message: 'No such user exists'
        }
      }
      return {
        error: false,
        code: 200,
        message: 'User Details Fetched',
        data: userDetails
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

  static async getTransactions (userId) {
    try {
      const donations = await Donation.findAll({ where: { userId: userId } })
      const points = await Points.findAll({ where: { userId: userId }, include: [{ model: 'Shop', attributes: ['shopName'] }] })
      return {
        code: 200,
        error: false,
        donations,
        points
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

module.exports = UserController
