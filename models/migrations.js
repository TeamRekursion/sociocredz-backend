exports.migrations = async () => {
  try {
    await require('./users').sync({ alter: true })
    await require('./ngo').sync({ alter: true })
    await require('./shop').sync({ alter: true })
    await require('./post').sync({ alter: true })
    await require('./campaign').sync({ alter: true })
    await require('./points').sync({ alter: true })
    await require('./donation').sync({ alter: true })
  } catch (err) {
    throw new Error(err)
  }
}
