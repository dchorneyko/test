function Options() {
	// enforce new
	if (!(this instanceof Options)) {
		return new Options();
	}
	
	// members
	this.initialized = false;
	this.started = false;
	this.playerCount = 0;
	this.players = [];

	this.onPageShow = function () {
		// single execution tasks
		if (!this.initialized) {
			// hide the start and continue buttons
			$('#opt-start').closest('.ui-btn').hide();
			$('#opt-continue').closest('.ui-btn').hide();
			
			// check if clear to start events	
			$('#opt-names input').keyup(function() {
				app.options.toggleStart();
			});
			$('#opt-names .ui-input-clear').click(function() {
				app.options.toggleStart();
			});

			// record initialization
			this.initialized = true;
		}
		else {
			$('#opt-start span:last').text('Restart');
			$('#opt-continue').closest('.ui-btn').show();
		}
	};

	this.toggleStart = function () {
		// local variables
		var i;
		var pname;
		var count;

		// count registered players
		for(i=0, count=0; i<4; i++) {
			pname = $('#opt-names input:eq(' + i + ')').val().trim();
			if (pname.length != 0) {
				count += 1;	
			}
		}
		
		// if count has changed
		if (count != this.playerCount) {
			// if first player added
			if (this.playerCount == 0) {
				// enable start
				$('#opt-warn-panel').fadeToggle();
				$('#opt-start').closest('.ui-btn').fadeToggle();
				$('#opt-start').attr('disabled', false);
			}
			else if (count == 0) {
				// disable start
				$('#opt-warn-panel').fadeToggle();
				$('#opt-start').closest('.ui-btn').fadeToggle();
				$('#opt-start').attr('disabled', true);
			}
			
			// update player count
			this.playerCount = count;
		}
	};

	this.recordOptions = function () {
		// local variables
		var i;
		var pname;
		
		// record settings
		this.started = true;
		this.players = [];
		this.playerCount = 0;
		for (i=0; i<4; i++) {
			pname = $('#opt-names input:eq(' + i + ')').val().trim();
			if (pname.length != 0) {
				// html encode
				this.players[this.playerCount] = $('<div/>').text(pname).html();
				this.playerCount += 1;
			}
		}
	};
}

