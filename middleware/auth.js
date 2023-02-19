const jwt = require("jsonwebtoken");
//permet de récupérer du header de la requête le token se trouvant après le mot "Bearer" (indice [1])

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, `${process.env.SECRET_KEY}`);
    const userId = decodedToken.userId;
    req.auth = { userId: userId };
    if (req.body.userId && req.body.userId !== userId) {
      throw "Echec d'authentification";
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error });
  }
};
