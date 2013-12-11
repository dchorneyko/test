function Scorecard() {
	// enforce new
	if (!(this instanceof Scorecard)) {
		return new Scorecard();
	}
	
	// members
	this.initialized = false;
	this.gameFinished = false;
	this.scores;

	this.onPageShow = function () {
		// single execution tasks
		if (!this.initialized) {
			// swipe event on scorecard
			$('#scorecard').on('swipeleft swiperight', function(){
				window.location = '#holes';
			});

			// record initialization
			this.initialized = true;
		}
	};
	
	this.initialize = function () {
		var i;
		var html;
		var playerScores;
		var playerTotals;
		var scoreTotals;
		var parTotal = 0;
		
		// header row
		html = '<tbody>'
			+ '<tr class="scorecard-header">'
			+ '<th class="vertical">Hole</th>'
			+ '<th class="vertical">Par</th>';
		for (i=0; i<app.options.playerCount; i++) {
			html += '<th class="vertical">' + app.options.players[i] + '</th>';
			playerScores += '<td playerId="' + i + '"> </td>';
			playerTotals += '<th playerId="' + i + '">0</th>';
		}
		html += '</tr>';
		
		// add holes
		for (i=0; i<9; i++) {
			html += '<tr holeId="' + i + '">'
				+ '<td>' + (i + 1) + '</td>'
				+ '<td>' + app.holes.hole[i].par + '</td>'
				+ playerScores	
				+ '</tr>';
			parTotal += app.holes.hole[i].par;	
		}
	
		// set score total
		html += '<tr><th></th><th id="parTotal">' + parTotal + '</th>' + playerTotals + '</tr>';
	
		// finish html and set score table
		html += '</tbody>';	
		$('#score-table').html(html);
		
		// set up the scores array
		this.scores = new Array();
		this.scores.length = app.options.playerCount;
		for (i=0; i<app.options.playerCount; i++) {
			this.scores[i] = new Array();
			this.scores[i].length = 9;
		}
	};
	
	this.updateHoleScores = function (id, hole) {
		// local variables
		var i;
		var j;
		var locator;
		var total = new Array();
		total.length = app.options.playerCount;
		
		// set hole score
		for (i=0; i<app.options.playerCount; i++) {
			this.scores[i][id] = hole.playerScore(i);
			locator = '#score-table tr[holeId=' + id + '] td[playerId=' + i + ']';
			$(locator).html(this.scores[i][id]);
			total[i] = 0;
		}
		
		// calculate and set scorecard total
		this.gameFinished = true;
		for (j=0; j<9; j++) {
			for (i=0; i<app.options.playerCount; i++) {
				if (this.scores[i][j] !== undefined) {
					total[i] += this.scores[i][j];
					this.gameFinished = this.gameFinished && (this.scores[i][j] != 0);
				} else {
					this.gameFinished = false;
				} 
			}
		}
		for (i=0; i<app.options.playerCount; i++) {
			$('#score-table tr:last-of-type th[playerId="' + i + '"]').html(total[i]);
		}	
	};
}
