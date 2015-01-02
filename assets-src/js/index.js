var helpers = require('./helpers')

helpers.helloWorld()
console.log('test')


var tagBtn = $('[data-target="#tag-wrap"]')
var sortBtn = $('[data-target="#sort-wrap"]')
var tagWrap = $('#tag-wrap')
var sortWrap = $('#sort-wrap')

$('.toggleOpen').on('click', function(e) {
  e.preventDefault()
  var $this = $(this)

  if ((tagWrap.hasClass('open') || sortWrap.hasClass('open')) && !$this.parent().hasClass('active')) {
    if (tagWrap.hasClass('open')) {
      // Remove
      tagWrap.removeClass('open')
      tagBtn.parent().removeClass('active')
      // Add
      sortWrap.addClass('open')
      sortBtn.parent().addClass('active')
    } else if (sortWrap.hasClass('open')) {
      // Remove
      sortWrap.removeClass('open')
      sortBtn.parent().removeClass('active')
      // Add
      tagWrap.addClass('open')
      tagBtn.parent().addClass('active')
    }  
  } else {
    $($this.data('target')).toggleClass('open')
    $this.parent($this).toggleClass('active')
  }
})



function removeActive() {$('.bar-iso').removeClass('active')}


$('#toggleSb').on('click', function(e) {
  e.preventDefault()
  
  if ($('#sort-wrap').hasClass('open')) {
    $('#barLeft, #sort-wrap').toggleClass('open')
    removeActive()
  } else if ($('#tag-wrap').hasClass('open')) {
    $('#barLeft, #tag-wrap').toggleClass('open')
    removeActive()
  } else {
    $('#barLeft').toggleClass('open')
  }
})



// close if click main body
$("main.content, .style-widget--toggle").click(function(e) {
  e.stopPropagation()
  $('#barLeft, #sort-wrap').removeClass('open')
  $('#barLeft, #tag-wrap').removeClass('open')
  removeActive()
})



// Toggle closed class
$('.toggleClosed').on('click', function() {
  $this.data('target').toggleClass('closed')
  $(this).parent($(this)).toggleClass('active')
})



// Hover remove .hidden-div
$('.hoverToggleHidden').click(function() {
  target = $($(this).data('target'))
  target.toggleClass('hidden-div')
  $(this).parent($(this)).toggleClass('active')
})



// Toggle left sb
$('.bar-left-expander').on('click', function() {

  $('.bar-left, .container-wrap').toggleClass('closed')

  if ( $('.bar-left').hasClass('closed') ) {
    $(this).find('.icon').removeClass('icon-angle-left').addClass('icon-angle-right')
  } else {
    $(this).find('.icon').removeClass('icon-angle-right').addClass('icon-angle-left')
  }
})



// ADD CLASS TO LINKED IMAGES
!function() {
  var linkedImg = $('article a').has('img')
  if ( linkedImg ) {
    linkedImg.addClass('imgLink')
  }
}()
