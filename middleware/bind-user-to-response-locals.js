const bindUserToResponseLocals = (req, res, next) => {
  // Make the user object available to every single view so it doesn't load up every single time
  res.locals.user = req.user;
  next();
};

module.exports = bindUserToResponseLocals;
