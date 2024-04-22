const sessionChecker = (req, res, next) => {
  if (req.session.user) {
      next();
  } else {
      res.redirect('/');
  }
};

const adminChecker = (req, res, next) => {
  sessionChecker(req, res, () => {
    if (req.session.user.isAdmin) {
      next();
    } else {
      res.redirect('/');
    }
  });
};

  const storeChecker = (req, res, next) => {
    sessionChecker(req, res, () => {
      if (req.session.user.controlsStore !== 0 || req.session.user.isAdmin) {
        next();
      } else {
        res.redirect('/');
      }
    });
  };

module.exports = {
  sessionChecker,
  adminChecker,
  storeChecker
};
