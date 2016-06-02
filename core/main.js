(function(){

	"use strict";

	$main.game = new Phaser.Game(1200, 400, Phaser.CANVAS, 'game');

	$main.game.state.add($main.states.start.name, $main.states.start.core);

	$main.game.state.start($main.states.start.name);

}());