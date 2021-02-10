const { User } = require("../models/Users");
const { encryptPassword, checkPassword } = require("../utilities");

const accueil = (req, res) => res.render('accueil');

const inscription = (req, res) => res.render('inscription');

const connexion = (req, res) => res.render('connexion');

const deconnexion = (req, res) => {
    // req.session.connected = false;
    res.redirect('connexion');
};

const wrongConnexion = (res, msg) => res.render('connexion', {msg});

const postInscription = async (req, res) => {
    const { email, pseudo, password } = req.body;
    const user = await User.findOne({email, pseudo});

    if (user !== null) {
        var habon ='pseudo ou mail deja existant';
        wrongConnexion(res, habon);
        // res.render('inscription', {habon:habon});
        return;
    }

    let passwordEncrypted = encryptPassword(password);

    const addUser = await new User({
        pseudo,
        email,
        password: passwordEncrypted
    }).save();
    if (addUser && addUser.id !== undefined) {
        var title = 'connecté';
        // var msg = 'Vous êtes inscrit et connecté';
        res.render('jeu', {
            pseudo: req.body.pseudo,
            password: req.body.password,
            connected: req.session.connected
        });
    }
};

const postConnexion = async (req, res) => {
    const { pseudo, password } = req.body;
    let msg = 'Pseudo inéxistant ou mot de passe incorrect. Merci de reéssayer ou bien de vous inscrire pour pouvoir jouer.';

    // interrogation de la base de données si l'utilisateur existe
    const user = await User.findOne({pseudo});

    // si aucun utilisateur trouvé
    if (user === null) {
        // req.session.connected = false;
        console.log('pas bon!');
        wrongConnexion(res, msg);
        return;
    }

    // comparaison du passaword recu et de celui encrypté en base 
    if (!checkPassword(password, user.password)) {
        wrongConnexion(res, msg);
        return;
    }

    // req.session.connected = true;
    // var avatar = user.avatar;
    var bjr = 'Bonjour ' + user.pseudo;
    res.render('jeu', {
        pseudo,
        bjr,
        connected: true
    });
};

module.exports = {
    accueil,
    inscription,
    connexion,
    deconnexion,
    postInscription,
    postConnexion
};