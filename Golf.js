// global variables
var app = new App();

// global object
function App() {
	// enforce new
	if (!(this instanceof App)) {
		return new App();
	}

	// members
	this.options = new Options();
	this.holes = undefined;
	this.scorecard = undefined;
	
	this.startGame = function () {
		// initialize options
		this.options.recordOptions();
		
		// initialize holes
		this.holes = new Holes();
		this.holes.initialize();
		
		// initialize scorecard
		this.scorecard = new Scorecard();
		this.scorecard.initialize();
		
		// navigate to holes page
		window.location = '#holes';
	};
}

// document ready
$(function(){
});
