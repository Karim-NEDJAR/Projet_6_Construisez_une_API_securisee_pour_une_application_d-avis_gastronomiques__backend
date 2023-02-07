const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const space = " ";
    try {
        //permet de récupérer le token se trouvant après le mot "Bearer"
        const token = req.headers.authorization.split(space)[1];
        const decodedToken = jwt.verify(token, `${process.env.SECRET_KEY}`);
        const userId = decodedToken.userId;
        req.auth = { userId: userId };
        next();
    } catch (error) {
        res.status(401).json({ error });
    }
};