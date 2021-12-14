const jwt = require("jsonwebtoken");

module.exports = {
    isStudentLoggedIn: (req, res, next) => {
        try {
          const token = req.cookies.jwt;
          const decoded = jwt.verify(
            token,
            'SECRETKEY'
          );
          req.userData = decoded;
          next();
        } catch (err) {
          return res.redirect('/login');
        }
      }
}

