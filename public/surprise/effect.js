$(window).load(function(){
	$('.loading').fadeOut('fast');
	$('.container').fadeIn('fast');
});
$('document').ready(function(){
		var vw;
		$(window).resize(function(){
			 var width = $(window).width();
			 var balloonWidth = width > 768 ? 100 : (width / 7.5);
			 var totalWidth = balloonWidth * 7;
			 var offset = (width - totalWidth) / 2;
			 if (offset < 0) offset = 0;
			$('#b1,#b2,#b3,#b4,#b5,#b6,#b7').stop();
			$('#b11').animate({top:240, left: offset + balloonWidth*0},500);
			$('#b22').animate({top:240, left: offset + balloonWidth*1},500);
			$('#b33').animate({top:240, left: offset + balloonWidth*2},500);
			$('#b44').animate({top:240, left: offset + balloonWidth*3},500);
			$('#b55').animate({top:240, left: offset + balloonWidth*4},500);
			$('#b66').animate({top:240, left: offset + balloonWidth*5},500);
			$('#b77').animate({top:240, left: offset + balloonWidth*6},500);
		});

	$('#turn_on').click(function(){
		$('#bulb_yellow').addClass('bulb-glow-yellow');
		$('#bulb_red').addClass('bulb-glow-red');
		$('#bulb_blue').addClass('bulb-glow-blue');
		$('#bulb_green').addClass('bulb-glow-green');
		$('#bulb_pink').addClass('bulb-glow-pink');
		$('#bulb_orange').addClass('bulb-glow-orange');
		$('body').addClass('peach');
		$(this).fadeOut('slow').delay(5000).promise().done(function(){
			$('#play').fadeIn('slow');
		});
	});
	$('#play').click(function(){
		var audio = $('.song')[0];
        audio.play();
        $('#bulb_yellow').addClass('bulb-glow-yellow-after');
		$('#bulb_red').addClass('bulb-glow-red-after');
		$('#bulb_blue').addClass('bulb-glow-blue-after');
		$('#bulb_green').addClass('bulb-glow-green-after');
		$('#bulb_pink').addClass('bulb-glow-pink-after');
		$('#bulb_orange').addClass('bulb-glow-orange-after');
		$('body').css('backgroud-color','#FFF');
		$('body').addClass('peach-after');
		$(this).fadeOut('slow').delay(6000).promise().done(function(){
			$('#bannar_coming').fadeIn('slow');
		});
	});

	$('#bannar_coming').click(function(){
		$('.bannar').addClass('bannar-come');
		$(this).fadeOut('slow').delay(6000).promise().done(function(){
			$('#balloons_flying').fadeIn('slow');
		});
	});

	function loopOne() {
		var randleft = $(window).width()*Math.random();
		var randtop = $(window).height()*Math.random();
		$('#b1').animate({left:randleft,bottom:randtop},10000,function(){
			loopOne();
		});
	}
	function loopTwo() {
		var randleft = $(window).width()*Math.random();
		var randtop = $(window).height()*Math.random();
		$('#b2').animate({left:randleft,bottom:randtop},10000,function(){
			loopTwo();
		});
	}
	function loopThree() {
		var randleft = $(window).width()*Math.random();
		var randtop = $(window).height()*Math.random();
		$('#b3').animate({left:randleft,bottom:randtop},10000,function(){
			loopThree();
		});
	}
	function loopFour() {
		var randleft = $(window).width()*Math.random();
		var randtop = $(window).height()*Math.random();
		$('#b4').animate({left:randleft,bottom:randtop},10000,function(){
			loopFour();
		});
	}
	function loopFive() {
		var randleft = $(window).width()*Math.random();
		var randtop = $(window).height()*Math.random();
		$('#b5').animate({left:randleft,bottom:randtop},10000,function(){
			loopFive();
		});
	}

	function loopSix() {
		var randleft = $(window).width()*Math.random();
		var randtop = $(window).height()*Math.random();
		$('#b6').animate({left:randleft,bottom:randtop},10000,function(){
			loopSix();
		});
	}
	function loopSeven() {
		var randleft = $(window).width()*Math.random();
		var randtop = $(window).height()*Math.random();
		$('#b7').animate({left:randleft,bottom:randtop},10000,function(){
			loopSeven();
		});
	}

	$('#balloons_flying').click(function(){
		$('.balloon-border').animate({top:-500},8000);
		$('#b1,#b4,#b5,#b7').addClass('balloons-rotate-behaviour-one');
		$('#b2,#b3,#b6').addClass('balloons-rotate-behaviour-two');
		// $('#b3').addClass('balloons-rotate-behaviour-two');
		// $('#b4').addClass('balloons-rotate-behaviour-one');
		// $('#b5').addClass('balloons-rotate-behaviour-one');
		// $('#b6').addClass('balloons-rotate-behaviour-two');
		// $('#b7').addClass('balloons-rotate-behaviour-one');
		loopOne();
		loopTwo();
		loopThree();
		loopFour();
		loopFive();
		loopSix();
		loopSeven();
		
		$(this).fadeOut('slow').delay(5000).promise().done(function(){
			$('#cake_fadein').fadeIn('slow');
		});
	});	

	$('#cake_fadein').click(function(){
		$('.cake').fadeIn('slow');
		$(this).fadeOut('slow').delay(3000).promise().done(function(){
			$('#light_candle').fadeIn('slow');
		});
	});

	$('#light_candle').click(function(){
		$('.fuego').fadeIn('slow');
		$(this).fadeOut('slow').promise().done(function(){
			$('#wish_message').fadeIn('slow');
		});
	});

		
	$('#wish_message').click(function(){
		 var width = $(window).width();
		 var balloonWidth = width > 768 ? 100 : (width / 7.5);
		 var totalWidth = balloonWidth * 7;
		 var offset = (width - totalWidth) / 2;
		 if (offset < 0) offset = 0;
		 var balloonTop = width > 768 ? 210 : 170;

		$('#b1,#b2,#b3,#b4,#b5,#b6,#b7').stop();
		$('#b1').attr('id','b11');
		$('#b2').attr('id','b22')
		$('#b3').attr('id','b33')
		$('#b4').attr('id','b44')
		$('#b5').attr('id','b55')
		$('#b6').attr('id','b66')
		$('#b7').attr('id','b77')
		$('#b11').animate({top:balloonTop, left: offset + balloonWidth*0},500);
		$('#b22').animate({top:balloonTop, left: offset + balloonWidth*1},500);
		$('#b33').animate({top:balloonTop, left: offset + balloonWidth*2},500);
		$('#b44').animate({top:balloonTop, left: offset + balloonWidth*3},500);
		$('#b55').animate({top:balloonTop, left: offset + balloonWidth*4},500);
		$('#b66').animate({top:balloonTop, left: offset + balloonWidth*5},500);
		$('#b77').animate({top:balloonTop, left: offset + balloonWidth*6},500);
		$('.balloons').css('opacity','0.9');
		$('.balloons h2').fadeIn(3000);
		$(this).fadeOut('slow').delay(3000).promise().done(function(){
			$('#story').fadeIn('slow');
		});
	});
	
	$('#story').click(function(){
		$(this).fadeOut('slow');
		$('.cake').fadeOut('fast').promise().done(function(){
			$('.message').fadeIn('slow');
		});
		
		var $msgs = $("#dynamic-message-container p");
		var msgCount = $msgs.length;

		function msgLoop (i) {
			// i is 0-based index of our message elements
			if (i > 0) {
				$msgs.eq(i - 1).fadeOut('slow').delay(800).promise().done(function(){
					if (i < msgCount) {
						$msgs.eq(i).fadeIn('slow').delay(4000).promise().done(function(){
							msgLoop(i + 1);
						});
					} else {
						// Completed the beautiful story!
						$('.cake').fadeIn('fast');
						$('.balloons').fadeIn('fast');
						if (window.albumData && window.albumData.length > 0) {
							$('#memories-cta-container').fadeIn('slow');
						}
					}
				});
			} else {
				// Start with the first greeting message
				$msgs.eq(0).fadeIn('slow').delay(4000).promise().done(function(){
					msgLoop(1);
				});
			}
		}
		
		msgLoop(0);
		
	});
});




//alert('hello');