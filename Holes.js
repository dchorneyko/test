function Hole(id, par) {
	// enforce new
	if (!(this instanceof Hole)) {
		return new Hole(id, par);
	}
	
	// initialize members
	this.id = id;
	this.par = par;
	this.image = 'images/Rack_' + id + '.png';
	this.score = [0,0,0,0];
	this.isComplete = false;
	
	// score handling
	this.playerScore = function (playerId, playerScore) {
		// invalid params
		if ((playerId === undefined) || (playerId < 0) || (playerId >= app.options.playerCount)) {
			return;
		}
		
		// update
		if ((playerScore !== undefined) && (playerScore >= 0) && (playerScore <= 9)) {
			this.score[playerId] = playerScore;
			
			// check if all scores entered
			if (playerScore == 0) {
				this.isComplete = false;
			}
			else {
				var i;
				this.isComplete = true;
				for (i=0; i<app.options.playerCount; i++) {
					this.isComplete = this.isComplete && (this.score[i] > 0);
				}
			}
		}
		
		// done
		return this.score[playerId];
	};

	this.incrementScore = function (playerId, increment) {
		if ((playerId !== undefined) && (playerId >= 0) && (playerId < app.options.playerCount)) {
			return this.playerScore(playerId, (this.score[playerId] + increment));
		}
	};
}


function Holes() {
	// enforce new
	if (!(this instanceof Holes)) {
		return new Holes();
	}

	// members
	this.curPlayer = 1;
	this.curHole = 0;
	this.holeCount = 9;
	this.initialized = false;
	this.hole = [];

	this.onPageShow = function () {
		if (!this.initialized) {
			// local variables
			var i, playerId;
			
			// swipe event
			$('#holes').on('swipeleft swiperight', function(){
				window.location = '#scorecard';
			});
		
			// hide the hole navigation buttons
			$('#holes-prev').hide();
			$('#holes-next').hide();
			
			// control positioning
			$(window).resize(app.holes.resize);
			this.resize();
			
			// set click handler for players
			for (i=1; i<=app.options.playerCount; i++) {
				playerId = '#holes-player-' + i;
				$(playerId).on('click', i, app.holes.selectPlayerEvent);
			}
			$('#holes-player-1').addClass('player-selected');

			// go to hole
			this.goToHole(this.curHole);
			
			// record initialization
			this.initialized = true;
		}
	};
	
	this.initialize = function () {
		// local variables
		var par = [4,3,5,4,3,4,3,5,5];
		var i;
		var html;
		
		// set up holes
		for (i=0; i<9; i++) {
			this.hole.push(new Hole((i+1), par[i]));
		}
		this.holeCount = 9;
		
		// set up players
		$('#holes-score tr').remove();
		for (i=1; i<=app.options.playerCount; i++) {
			html = '<tr id="holes-player-' + i 
				+ '"><td>' + app.options.players[i-1] 
				+ '</td><td></td></tr>';
			$('#holes-score').append($.parseHTML(html));
		}
	};
	
	this.resize = function () {
		// next hole button
		$('#holes-next').css({left: $('#holes-number-panel').width()-38});
		
		// submit button
		$('#holes-submit').closest('.ui-btn').css({left: ($('#holes-submit-panel').width()-24)/2});
		
		// adjust score buttona
		var adjScore = $('.adjustScore');
		adjScore.css({left: (adjScore.width()-72)/2});

		// score column
		$('#holes-score tr:first td:last').attr('width',$('#holes-submit-panel').width());
	};
	
	this.goToHole = function (id)
	{
		if ((id<0) || (id>(this.holeCount-1))) {
			return;
		}
		
		// local variables
		var i;
		var score;
		
		// record current hole
		this.curHole = id;
		
		// set hole description
		$('#holes-num').html(this.hole[id].id);
		$('#holes-par').html(this.hole[id].par);
		$('#holes-rack').attr({src: this.hole[id].image});
	
		// enable/disable submit button
		if ($('#holes').css('display') == 'block') {
			$('#holes-submit').button(this.hole[this.curHole].isComplete ? 'enable' : 'disable');
		}
		
		// enable/disable hole navigation buttons
		if (id == 0) {
			$('#holes-prev').hide();
		}
		else {
			$('#holes-prev').show();
		}
		if ((id == (this.holeCount-1)) || !this.hole[id].isComplete) {
			$('#holes-next').hide();
		}
		else {
			$('#holes-next').show();
		}
		
		// display recorded score
		for (i=1; i<=app.options.playerCount; i++) {
			score = this.hole[id].playerScore(i-1);
			if (score != 0) {
				$('#holes-player-' + i + ' td:last').html(score);
			}
			else {
				$('#holes-player-' + i + ' td:last').html('');
			}
		}
		
		// select first player
		this.selectPlayer(1);
	};
	
	this.selectPlayerEvent = function (event) {
		app.holes.selectPlayer(event.data);
	};
	
	this.selectPlayer = function (id) {
		// return if same player
		if (id == this.curPlayer) {
			return;
		}
		
		// deselect current player
		$('#holes-player-' + this.curPlayer).removeClass('player-selected');
		$('#holes-player-' + this.curPlayer).addClass('player-unselected');
		
		// select new player
		this.curPlayer = id;
		$('#holes-player-' + this.curPlayer).removeClass('player-unselected');
		$('#holes-player-' + this.curPlayer).addClass('player-selected');
	};
	
	this.incrementScore = function (increment) {
		// modify the score
		var score = this.hole[this.curHole].incrementScore(this.curPlayer-1, increment);
		
		// update the display
		if (score > 0) {
			$('#holes-player-' + this.curPlayer + ' td:last').html(score);
		}
		else {
			$('#holes-player-' + this.curPlayer + ' td:last').html('');
		}
		
		// enable/disable buttons
		if ((increment>0) && (this.hole[this.curHole].isComplete))
		{
			$('#holes-submit').button('enable');
		}
		else if ((increment<0) && (!this.hole[this.curHole].isComplete))
		{
			$('#holes-submit').button('disable');
			$('#holes-next').hide();
		}
	};

	this.submitHoleScores = function () {
		// submit to scorecard
		app.scorecard.updateHoleScores(this.curHole, this.hole[this.curHole]);
		
		// go to the scorecard or next hole
		if (this.curHole == 8) {
				window.location = '#scorecard';
		}
		else {
			this.goToHole(this.curHole+1);
		}
	};
}
