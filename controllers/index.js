const accueil = (req, res) => res.render('accueil');

const inscription = (req, res) => res.render('inscription');

const connexion = (req, res) => res.render('connexion');

const deconnexion = (req, res) => {
    req.session.connected = false;
    res.render('connexion');
};

const postInscription = (req, res) => {
    myDb.collection('users').findOne({email : req.body.email, pseudo: req.body.pseudo}, function(err,data) {    
        if (data) {
            console.log(data);
            var habon ='pseudo ou mail deja existant';
            res.render('inscription', {habon:habon});
        } else {
            myDb.collection('users').insertOne({
            // nom: req.body.nom,
            // prenom: req.body.prenom,
            pseudo: req.body.pseudo,
            email: req.body.email,
            password: req.body.password,
            status: 1,
            date: new Date()
            }, function(err, result){
            req.session.email = req.body.email;
            req.session.connected = true;
            if(!err && result.insertedCount === 1){
                var title = 'connecté';
                var msg = 'Vous êtes inscrit et connecté';
            }else{
                var title = 'inscription';
                var msg = 'L\'inscription n\'a pas pu se faire';
            };
            res.render('jeu', {
                pseudo: req.body.pseudo,
                password: req.body.password,
                connected: req.session.connected
            })
            });
        };
    });
};

const postConnexion = (req, res) => {
    myDb.collection('users').findOne({pseudo: req.body.pseudo, password : req.body.password} || req.session.connected, function(err,data) {
      if(err || !data) {
        req.session.connected = false;
        console.log('pas bon!');
        var msg = 'Pseudo inéxistant ou mot de passe incorrect. Merci de reéssayer ou bien de vous inscrire pour pouvoir jouer.'
        res.render('connexion', {msg:msg});
      } else{
        req.session.connected = true;
        console.log(data);
        var pseudo = data.pseudo || '';
        var password = data.password || '';
        var avatar = data.avatar;
        var bjr = 'Bonjour ' + data.pseudo;
        res.render('jeu', {
          pseudo: req.body.pseudo,
          password: req.body.password,
          connected: req.session.connected
        });
      }
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