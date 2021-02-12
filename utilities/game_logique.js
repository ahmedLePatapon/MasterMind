const shuffle = o => {
  for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x)
  return o;
};

//**** Fonction choix aleatoire ****//
exports.rand = () => {
  let couleur = ['rouge', 'bleu', 'vert', 'jaune', 'violet', 'marron'];
  var rand = [];
  for (var i = 0; i < 4; i++) {
    shuffle(couleur);
    rand.push(couleur.pop());
  }
  return rand;
};
//***** fin fonction choix aleatoire ****//

exports.compareArray = (a1, a2) => {
  var combienYaDeBoulesBonnesLorsDeLaComparaison = 0;
  var hintNoir = 0;
  let hintGrey = 0;
  if (a1.length !== a2.length) {
    return false;
  }
  for (var i = 0; i < a1.length; ++i) {
    if (a1.includes(a2[i]) && a1[i] === a2[i]) {
      hintNoir++;
      combienYaDeBoulesBonnesLorsDeLaComparaison++;
    } else if(a1.includes(a2[i])) {
      hintGrey++;
      combienYaDeBoulesBonnesLorsDeLaComparaison++;
    }
  }
  console.log('*****************');
  console.log('hintNoir',hintNoir );
  console.log('combienYaDeBoulesBonnesLorsDeLaComparaison',combienYaDeBoulesBonnesLorsDeLaComparaison );
  console.log('*****************');
  return {hintNoir, hintGrey: combienYaDeBoulesBonnesLorsDeLaComparaison};
};


// refactorisation de cette fonction cf compareArray
// function compareArray(a1, a2) {
//   var combienYaDeBoulesBonnesLorsDeLaComparaison = 0;
//   var hintNoir = 0;
//   if (a1.length !== a2.length) {
//     return false;
//   } else {
//     for (var i = 0; i < a1.length; ++i) {
//       if (a1.includes(a2[i]) && a1[i] === a2[i]) {
//         hintNoir++;
//         socket.emit('noir', combienYaDeBoulesBonnesLorsDeLaComparaison);
//         combienYaDeBoulesBonnesLorsDeLaComparaison++;
//       } else if(a1.includes(a2[i])) {
//         socket.emit('gris', combienYaDeBoulesBonnesLorsDeLaComparaison);
//         combienYaDeBoulesBonnesLorsDeLaComparaison++;
//       }
//     }
//   }
//   if (hintNoir === 4) {
//     socket.emit('victoire', true);
//   } else {
//     socket.emit('essaiEncore', true);
//   }
//   return true;
// }