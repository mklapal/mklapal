//document load function
$( document ).ready(function() {

  var _debug = true,
      _user = {
        username: 'user',
        user_ip: '127.0.0.1',
      },
      appPath = 'app/';

  _getUser();
  _init();
  _bindEvents();

  //public functions
  function getHelp(){
    _loadContent(appPath + 'help.html');
  }

  function getWelcome(){
    _loadContent(appPath + 'welcome.html');
  }
  
  function getMenu(){
    _loadContent(appPath + 'menu.html');
  }
  
  function getExit(){
    _loadContent(appPath + 'exit.html');
  }
  
  function getAbout(){
    _loadContent(appPath + 'about.html');
  }
  
  function getCv(){
    _loadContent(appPath + 'cv.html');
  }

  function getProjects(){
    _loadContent(appPath + 'projects.html');
  }
  
  function getContact(){
    _loadContent(appPath + 'contact.html');
  }

  function getConfirmation(){
    var jqxhr = $.get(appPath + 'su.html', function() {})
      .done(function(data) {
        _updateUser();
        _appendToEl(data);
        _scrollToEl();
      })
      .fail(function() {
       
      })
      .always(function() {
      
      });
  }

  // private functions

  function _init(){
    //move cursor to textfield
    $('.js-textfield-hide').focus();
    
    _emulateCaret();
    _typing();
    _welcome();
  }

  function _bindEvents(){
    $('.js-textfield-hide').keypress(function(event) {
      var keycode = (event.keyCode ? event.keyCode : event.which);
      var command = $('.js-textfield-hide').val();
      if(keycode == '13') {
        $('.js-textfield-hide').val('');
        $('.js-terminal-text').empty();
        _showContent(command);
      }
    });

    $(window).click(function(){
      $('.js-textfield-hide').focus();
    });
  }

  function _loadContent(content){
    var jqxhr = $.get(content, function() {})
      .done(function(data) {
        _appendToEl(data);
        _scrollToEl();
        _initCharts();
      })
      .fail(function() {
        
      })
      .always(function() {
        
      });
  }

  function _showContent(content){
    
    $('.js-content').append('<div class="terminal-text">[' + _user.username + '@' + _user.user_ip + '] > ' + content + '</div>');
    switch(content) {
      case 'intro':
        getWelcome();
        break;
      case 'menu':
        getMenu();
        break;
      case 'help':
        getHelp();
        break;

      // content pages
      case 'cv':
        getCv();
        break;
      case 'projects':
        getProjects();
        break;
      case 'contact':
        getContact();
        break;
      
      // extra
      case 'clear':
        _clearTerminal();
        break;
      case 'su':
        _setName('admin');
        getConfirmation();
        break;
      case 'exit':
        getExit();
        break;
        
      default:
        $( '.js-content' ).append('<p>' + content + ' is unknown command. Please type "help" for all supported commands.</p>');
    }
  }

  function _getUser() {
    var that = this;
    var jqxhr = $.get('app/ajax_user.php', function() {})
      .done(function(data) {
        _User = data;
        //update terminal prefix
        _updateUser();
      })
      .fail(function() {
       
      })
      .always(function() {
      
      });
    return jqxhr;
  }

  function _setName(name){
    _user.username = name;
  }

  function _updateUser(){
    $('.js-terminal-prefix').contents().remove();
    $('.js-terminal-prefix').append('[' + _user.username + '@' + _user.user_ip + '] >');
  }

  function _appendToEl(data){
    $('.js-content').append(data);
  }

  function _scrollToEl(){
    $(window).scrollTop($('.js-terminal-prefix').offset().top);
  }

  function _clearTerminal(){
    $('.js-content').contents().remove();
  }

  function _emulateCaret(){
    window.setInterval(function () {
      var style = $('.caret').css('display');
      if (style === 'inline'){
        $('.caret').css('display', 'none');
      } else {
        $('.caret').css('display', 'inline');
      }
    }, 500);
  }

  function _typing(){
    window.setInterval(function () {
      var text = $('.js-textfield-hide').val();
      $('.js-terminal-text').empty();
      $('.js-terminal-text').append(text);
    }, 10);
  }

  function _welcome(){
    var timer = setInterval(function () {
      $( '.js-content' ).append('<div class="terminal-text">[' + _user.username + '@' + _user.user_ip + '] > intro</div>');
      getWelcome();
      //getMenu();
      clearInterval(timer);
    }, 3000);
  }

  function _initCharts(){
    var width = 100,
        height = 100,
        radius = Math.min(width, height) / 2;

    var colors = [
      d3.rgb('grey'),
      d3.rgb('white')
      ];
    
    var pie = d3.layout.pie()
      .sort(null);

    var arc = d3.svg.arc()
      .innerRadius(radius - 100)
      .outerRadius(radius - 80);

    //init
    $('.js-chart').empty();

    $('.js-chart').each(function() {
      var dataset = $( this ).data('set');

      var svg = d3.select(this)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

      var path = svg.selectAll('path')
        .data(pie([dataset, 100-dataset]))
        .enter().append('path')
        .attr('fill', function(d, i) { return colors[i]; })
        .attr('d', arc);

      var text = d3.select(this)
        .select('svg')
        .append('text');
      
      var textLabels = text
        .attr('x', function(d) { return 50; })
        .attr('y', function(d) { return 56; })
        .text( function (d) { return dataset + '%'; })
    });
  }
});