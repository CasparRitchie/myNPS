
// Je définis un module d'exportation qui prend un schéma en paramètre
module.exports = (schema) => {
    // Je retourne une fonction asynchrone qui prend en paramètres les objets req, res et next
    return async (req, res, next) => {
        try {
            // J'essaye de valider les données de la requête (req.body) avec le schéma passé en paramètre
            const valid = await schema.validateAsync(req.body);
            // Si la validation est réussie, je remplace les données de la requête par les données validées
            req.body = valid;
            // Je passe à la prochaine étape du middleware
            next();
        } catch (err) {
            // Si la validation échoue, je renvoie une erreur HTTP 400 avec les détails de l'erreur
            res.status(400).json(err.details);
        }
    }
}
