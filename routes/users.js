const router = require('express').Router();
const UserController = require('../controllers/users');
const middlewares = require('../middlewares/auth');

router.post('/login', async (req, res) => {
  const response = await UserController.login(req.body.idToken);
  res.status(response.code).send(response);
});

router.get('/details', middlewares.isLoggedIn, async (req, res) => {
  const response = await UserController.getDetails(req.decoded.id);
  res.status(response.code).send(response);
});

module.exports = router;
