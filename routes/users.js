const router = require('express').Router();
const UserController = require('../controllers/users');

router.post('/login', async (req, res) => {
  const response = await UserController.login(req.body.idToken);
  res.status(response.code).send(response);
});

module.exports = router;
