var avatar = '';
$(document).ready(function() {
  $('.image').click(function(e) {
    e.preventDefault();
    $('.image').removeClass('active');
    $(this).addClass('active')
    // console.log(this.id);
    avatar = this.id;
    console.log(avatar);
  });
});
