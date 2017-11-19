var opac = anime({
  targets: '.letter',
  opacity:1,
  scale:1,
  easing:'easeInBounce',
  delay: function(el, index) {
  return index * 100;
  }
});


var letter = document.getElementsByClassName('letter');
for (var i = 0; i < letter.length; i++) {
  letter[i].addEventListener("mouseover", function(event) {
    event.target.style.color = 'rgba(' + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ',1)';
    setTimeout(function(){
      event.target.style.color = '';
    }, 500);
  }, false);
};
