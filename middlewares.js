const checkAccess = type => (req, res, next) => {
  if (req.user.type !== type) {
    return res.status(403).json({message: 'Unauthorized'})
  }
  return next()
}

module.exports = {checkAccess}
