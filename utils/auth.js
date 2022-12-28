const config = require('../config');
const jwt = require('jsonwebtoken');

const isAuth = () => {
    return (req, res, next) => {
        // je lis les headers
        const header = req.headers.authorization;

        if (!header) {
            res.status(401).json({message: "You need to be logged in to see this page"});
        }
    const access_token = header.split(" ")[1];

    // le header doit être de la form "Authorization: Bearer {token}""
// je verifie que le token soit tjs valide, et aussi que c'est signé par mon serveur, 
// en utilisant le mot de pass jwt dans le config.json
        jwt.verify(access_token, config.jwtPass, (err, decodedToken) => {
            if (err) {
                res.status(401).json({message: "Invalid JWT"});
            } else {
                //je rajoute les données utilisateurs du token décode dans le request
                req.auth = decodedToken;
// next = je permet de passer à la suite de la requete
                next();
            }
        });
    }
};

const isAdmin = () => {
    return (req, res, next) => {
        const header = req.headers.authorization;

        if (!header) {
            res.status(401).json({message: "You need to be connected to do this"});
        }

        const access_token =  header.split(" ")[1];

        jwt.varify(access_token, config.jwtPass, (err, decodedToken) => {
            if (err) {
                res.status(401).json({message: "Invalid JWT"});
            } else if (decodedToken.roles == 'admin') {
                // je rajoute le token décodé avec les données de l'utilisateur
                req.auth = decodedToken,
                // je verifie que le user a le role "admin" dans son token pour permettre cet activité
                next();
            } else {
                res.status(401).json({message: "You need to be admin to do this"});
            }
        });
    }
};

module.exports = {
    isAuth,
    isAdmin
};