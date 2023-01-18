const config = require('../config');
const jwt = require('jsonwebtoken');

const isAuth = () => {
    return (req, res, next) => {
        // je lis les headers
        const header = req.headers.authorization;
        console.log(header);

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
// Cette fonction vérifie si l'utilisateur est administrateur ou non.
// Elle renvoie une fonction middleware qui vérifie si l'utilisateur est autorisé à effectuer une action donnée
const isAdmin = () => {
    return (req, res, next) => {
// On récupère l'en-tête "Authorization" de la requête.
const header = req.headers.authorization;
    // Si l'en-tête "Authorization" n'est pas présent, on renvoie une erreur 401 (non autorisé).
        if (!header) {
            res.status(401).json({message: "You need to be connected to do this"});
        }
        // On récupère le token d'accès contenu dans l'en-tête "Authorization".
        const access_token =  header.split(" ")[1];
        // On utilise la fonction "verify" de l'objet JWT pour vérifier la validité du token.
        jwt.verify(access_token, config.jwtPass, (err, decodedToken) => {
        // Si le token est invalide, on renvoie une erreur 401 (non autorisé).
            if (err) {
                res.status(401).json({message: "Invalid JWT"});
            // Si le token est valide, on vérifie si l'utilisateur a le rôle "admin" dans son token.
            } else if (decodedToken.role == 'admin') {
            // Si oui, on ajoute le token décodé avec les données de l'utilisateur dans l'objet "req".
            req.auth = decodedToken,
                // On appelle la fonction "next" pour passer à la prochaine étape du middleware.
                // je verifie que le user a le role "admin" dans son token pour permettre cet activité
                next();
            } else {
                // Si l'utilisateur n'a pas le rôle "admin", on renvoie une erreur 401 (non autorisé).
                res.status(401).json({message: "You need to be admin to do this"});
            }
        });
    }
};

module.exports = {
    isAuth,
    isAdmin
};