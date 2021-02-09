const { Router } = require('express');
const { accueil, inscription, connexion, deconnexion, postConnexion, postInscription} = require('../controllers');

const router = Router();

router.get(['/', '/accueil'], accueil);

router.get('/inscription', inscription);

router.get('/connexion', connexion);

router.get('/deconnexion', deconnexion);

router.post('/connexion', postConnexion);
  
router.post('/inscription', postInscription);

module.exports = router;