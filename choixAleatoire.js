//**** Fonction choix aleatoire ****//
exports.rand = function() {
  var couleur = ['rouge', 'bleu', 'vert', 'jaune', 'violet', 'marron'];
  var rand = [];
  function shuffle(o) {
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
  };
  for (var i = 0; i < 4; i++) {
    shuffle(couleur);
    rand.push(couleur.pop());
  };
  return rand;
}
//***** fin fonction choix aleatoire ****//
