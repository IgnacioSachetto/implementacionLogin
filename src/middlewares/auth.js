export function checkUser(req, res, next) {
    if (req.session.email) {
      return next();
    }
    return res.status(401).render('error-page', { msg: 'Please log in' });
  }
  
  export function checkAdmin(req, res, next) {
    if (req.session.email && req.session.admin == true) {
      return next();
    }
    return res.status(401).render('error-page', { msg: 'Please log in as ADMIN!' });
  }