window.addEventListener('DOMContentLoaded', function(){
  var webSocketclient = io();
  //************tableau des choix. **************//
  var choix = [
    document.getElementById('champDejeu').children[0].children[0].children[1],
    document.getElementById('champDejeu').children[0].children[0].children[2],
    document.getElementById('champDejeu').children[0].children[0].children[3],
    document.getElementById('champDejeu').children[0].children[0].children[4]
  ];
  //******* fin tableau des choix. ******//
  choixAdverse = [
    document.getElementById('adversaire').children[0].children[0].children[1],
    document.getElementById('adversaire').children[0].children[0].children[2],
    document.getElementById('adversaire').children[0].children[0].children[3],
    document.getElementById('adversaire').children[0].children[0].children[4]
  ];
  //******** tableau des indices ********//
  var hints = [
    document.getElementById('champDejeu').children[0].children[1].children[0].children[0].children[1],
    document.getElementById('champDejeu').children[0].children[1].children[0].children[1].children[1],
    document.getElementById('champDejeu').children[0].children[1].children[0].children[1].children[0],
    document.getElementById('champDejeu').children[0].children[1].children[0].children[0].children[0]
  ];
  //*********** Tableau à verifier ****************//
  var verif = [];
  var z = 0;
  var divAnimated = [document.getElementById('champDejeu').children[0]];
  var divAdverseAnimated =  [document.getElementById('adversaire').children[0].children[0]];
  //*****function qui rajoute une ligne de choix.*****//
  var id = 2; // numero de ligne

  function addRow() {
    var div = document.createElement('div');
    $(div).addClass("line-adverse");
    div.innerHTML = '<div class="mind"><div class="num">' + id + '</div><div class="rond white choix1"></div><div class="rond white choix2"></div><div class="rond white choix3"></div><div class="rond white choix4"></div></div><div class="hint"><div class="centrage"><div class="hint1"><div class="rond1 "></div><div class="rond1"></div></div><div class="hint2"><div class="rond1"></div><div class="rond1"></div></div></div></div>';
    divAnimated.push(div);

    $('#champDejeu').prepend(div);
    $(div).hide().slideDown('normal');
    id++;
    choix = [
      document.getElementById('champDejeu').children[0].children[0].children[1],
      document.getElementById('champDejeu').children[0].children[0].children[2],
      document.getElementById('champDejeu').children[0].children[0].children[3],
      document.getElementById('champDejeu').children[0].children[0].children[4]
    ];
    hints = [
      document.getElementById('champDejeu').children[0].children[1].children[0].children[0].children[0],
      document.getElementById('champDejeu').children[0].children[1].children[0].children[0].children[1],
      document.getElementById('champDejeu').children[0].children[1].children[0].children[1].children[0],
      document.getElementById('champDejeu').children[0].children[1].children[0].children[1].children[1]
    ];

    webSocketclient.emit('hints', hints);
    z = 0;
  }
  //********function qui rajoute une ligne de choix.******//


  //***** function qui rajoute une ligne de choix adverse. *****//
  var ligneChoixAdverse = 2; // numero de ligne

  function addRowAdverse() {
    console.log('ligneChoixAdverse ' + ligneChoixAdverse);

    var div = document.createElement('div');
    $(div).addClass("line-adverse");
    div.innerHTML = '<div class="mind2"><div class="num">' + ligneChoixAdverse + '</div><div class="rond white choix1"></div><div class="rond white choix2"></div><div class="rond white choix3"></div><div class="rond white choix4"></div></div>';
    divAdverseAnimated.push(div);

    $('#adversaire').prepend(div);
    $(div).hide().slideDown('normal');
    ligneChoixAdverse++;

    choixAdverse = [
      document.getElementById('adversaire').children[0].children[0].children[1],
      document.getElementById('adversaire').children[0].children[0].children[2],
      document.getElementById('adversaire').children[0].children[0].children[3],
      document.getElementById('adversaire').children[0].children[0].children[4]
    ];
    z = 0;
  }

  //******** fin function qui rajoute une ligne de choix adverse.******//

  //************* Sprite avatar **************//
//   var avatar1 = new Image(128, 128);
//   avatar1.src = '/src_static/css/avatar1.png'
//   avatar1.style.top = 0;
//   avatar1.style.left = 0;
//   avatar1.className = 'avatar1';
// console.log(avatar1);
  //*********** Fin Sprite avatar ************//


  //************ ajout popup ************************//
  // function popup() {
  //   var popup = document.createElement('div');
  //   $(popup).addClass("popup");
  //   popup.innerHTML = 'deja selectionné';
  //   this.element.prepend(popup);
  //   var el = document.getElementById('recherche')
  //   el.addEventListener('click').prepend(popup);
  // }
  //******** fin ajout popup ***************//

  //******** function qui rajoute une ligne de victoire ******//
  function addVictoire() {
    var vic = document.getElementById('recherche');
    vic.innerHTML = '<div class="mind"><p class="animated jackInTheBox" id="victoire">Victoire</p></div><div class="btn-val" id="rejouer"><p class="validation" >Rejouer</p></div>';
  }
  //******** fin function qui rajoute une ligne de victoire *****//




  // ***** retrait de la barre de scroll pour un mmeilleur rendu.
  $(function() {
    $(".boxscroll").niceScroll().hide();
  });
  //****** fin retrait de la barre de scroll pour un mmeilleur rendu.


  //*************** constructeur Boule ****************//
  var Boule = function(id, color) {
    this.element = document.getElementById(id);
    this.color = color;
    this.selected = false;
    this.init = function() {
      this.element.addEventListener('click', this.handleClick.bind(this));
    };

    this.handleClick = function() {

      if (z >= 4) { z = 0; }
      if (!verif.includes(this.color) && verif.length < 4) {
        choix[z].classList.add(this.color);
        webSocketclient.emit('choixAdverse', this.color); // envoi du choix de la couleur de m'adversaire.
        verif.push(this.color);
        z++;
        if (!this.selected) {
          this.element.classList.toggle(this.color);
          this.selected = !this.selected;
        }
      } else {
        console.log('Deja selectionné');
      }
    };
    this.init();
  };
  //************ fin constructeur Boule *************//


  //**************** tableau des boule. *********************//
  var boules = [
    new Boule('boule1', 'rouge'),
    new Boule('boule2', 'vert'),
    new Boule('boule3', 'jaune'),
    new Boule('boule4', 'bleu'),
    new Boule('boule5', 'violet'),
    new Boule('boule6', 'marron')
  ];
  //*********** fin function constructeur Boule *************//


  //****** a faire *********//
  // possibilité de modifier son choix apres selection.
  // popup lorsqu'une couleur est deja selectionné
  // si possible faire cintiller les div avec les numeros genre une vague.
  //*********************************//


  //********* function jeu ***********//
  $('.btn-val').click(function() {
    console.log('id ' +id);
    console.log('coupAdverse ' + ligneChoixAdverse );
    webSocketclient.emit('coup', id - 1);
    webSocketclient.emit('coupAdverse', ligneChoixAdverse - 1);
    if (verif.length === 4) {
      console.log(verif.length);
      webSocketclient.emit('finChoix', true);

      webSocketclient.emit('verif', verif);
      verif = [];
      for (var i = 0; i < boules.length; i++) {
        if (boules[i].selected){
          boules[i].element.classList.toggle(boules[i].color);
          boules[i].selected = !boules[i].selected;
        }
      }
    } else {
      //popup "merci de faire votre choix"
      console.log("terminer vos choix");
    }
  });

  webSocketclient.on('essaiEncore', function(data) {
    if(data){
      addRow();
    }
  });


  webSocketclient.on('attente', function(data) {
    if(data) {
      var addAttente = function() {
        var vic = document.getElementById('adversaire');
        vic.innerHTML = '<div class="mind2"><p class="animated fadeIn infinite" id="victoire">En attente</p></div>';
      };
      addAttente();
    }
  });
  webSocketclient.on('reChoixAdverse', function(data) {
    if (z >= 4) { z = 0; }
      choixAdverse[z].classList.add(data);
      z++;
  });

  webSocketclient.on('victoire', function(data) {
    if(data) {
      var timeAdd = 0;
      var i = 0;
      window.setInterval(function() {
        if (i<divAnimated.length - 1) {
          divAnimated[i].style.opacity = 0;
          i++;
          timeAdd += 1000;
        }
      }, 100);
      window.setTimeout(addVictoire, timeAdd);
    }
  });
  webSocketclient.on('noir', function(hintNoir) {
    hints[hintNoir].classList.add("black");
  });

  webSocketclient.on('gris', function(hintGris) {
    hints[hintGris].classList.add("gray");
  });

  webSocketclient.on('reFinChoix', function(data) {
    if (data) {
      addRowAdverse();
    }
  });

  //*********************************//
});
