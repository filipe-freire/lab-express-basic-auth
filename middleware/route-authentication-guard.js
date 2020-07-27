const routeAuthenticationGuard = (req, res, next) => {
  if (req.user) {
    // if there's a user session, proceed to the page
    next();
  } else {
    next(new Error('User is not authenticated'));
  }
};

module.exports = routeAuthenticationGuard;
