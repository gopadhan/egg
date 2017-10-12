vEgg.Game = function(vGame){
	// define needed variables for vEgg.Game
	this._egg = null;
	this._eggs = [];
	this._eggGroup = null;
	this._eggScale = 0.4;
	this._eggHitAreaXOffset = 0;
	this._eggHitAreaYOffset = 50;
	this._eggHitAreaDiameter = 300;
	this._placevalue = [];
	
	
	
	this._spawnCandyTimer = 0;
	this._fontStyle = null;
	this.particleSprite = ['star', 'present', 'ring'];
	this.alleggSprites = ['egg100place', 'egg10place', 'egg1place'];
	

	// define vEgg variables to reuse them in vEgg.item functions
	vEgg._scoreText = null;
	vEgg._score = 0;
	vEgg._health = 0;
};
vEgg.Game.prototype = {
	create: function(){
		// start the physics engine
		this.physics.startSystem(Phaser.Physics.ARCADE);
		// set the global gravity
		this.physics.arcade.gravity.y = 0;
		// display images: background, floor and score
        var vBackground = this.add.sprite(0, 0, 'background');
        vBackground.height = GAME_HEIGHT;
        vBackground.width = GAME_WIDTH;        

		// create a group for eggs
		this._eggGroup = this.add.group();

		//  This will automatically inputEnable all children added to the Group
		this._eggGroup.inputEnableChildren = true;

		// create the egg
		//  Create a egg inside of the 'eggGroup' group
		
		for (var i = 0; i < 3; i++) {
			

			this._egg = this.add.sprite(GAME_WIDTH*0.10 * (i+1)/this._eggScale, GAME_HEIGHT*0.8, this.alleggSprites[i]);
			
			//// make the hit area circle - note you can also use negative figures for the first two params (x and y) 
			//to offset it from the sprite, 3rd parameter is the diameter of the circle
			this._egg.hitArea = new Phaser.Circle(this._eggHitAreaXOffset, this._eggHitAreaYOffset, this._eggHitAreaDiameter);

			this._egg.anchor.set(0.5);
			this._egg.scale.set(this._eggScale);
			//setting up the sprite name so we could identify which child is clicked
			this._egg.name = i;
			
			this._egg.alpha = 0.4;
			this.add.tween(this._egg).to({ alpha: 1}, 1000, Phaser.Easing.Linear.InOut, true, 0, Infinity, true);	
			
			this._eggGroup.add(this._egg);
			//Add egg to the array
			this._eggs.push(this._egg);

			

			
			this._egg.input.useHandCursor = true;			
			this._egg.events.onInputDown.add(this.clickEgg, this);

		};


	},

	update: function(){
		// update timer every frame
		this._spawnCandyTimer += this.time.elapsed;


	},

	render: function(){
		
					//following works only when the physics is enabled on the object
					vGame.debug.bodyInfo(this._eggs[1], 32, 32);
				
					vGame.debug.body(this._eggs[1]);

		},

	clickEgg: function(sprite, pointer){
		//changing the frame to open egg
		sprite.frame = 1;
		//to Tint egg after click
		sprite.tint = Math.random() * 0xffffff;	

        vGame.tweens.removeFrom(this._eggs[sprite.name]);
		this._eggs[sprite.name].alpha = 1;	
		this._eggs[sprite.name].inputEnabled = false;	
		this._placevalue[sprite.name] = vGame.rnd.integerInRange(0, 9);
		console.log('this._placevalue[sprite.name] ', this._placevalue[sprite.name]);
		this.emitItems(pointer.x, pointer.y, vGame, this.particleSprite[sprite.name], this._placevalue[sprite.name]);	

	},	

	emitItems: function(x, y, game, spriteName, maxParticles){
		    //  Position the emitter where the mouse/touch event was
		    emitter = game.add.emitter(x, y, maxParticles);
			
			//makeParticles(keys, frames, quantity, collide, collideWorldBounds)		
			emitter.makeParticles(spriteName, [0,1,2,3,4,5,6], maxParticles, true, true);
		
			emitter.minParticleSpeed.setTo(0, -100);
			emitter.maxParticleSpeed.setTo(0, -200);
			emitter.minParticleScale = 0.1;
			emitter.maxParticleScale = 0.1;
			emitter.gravity = 0;
			emitter.bounce.setTo(0.1, 0.1);
			emitter.angularDrag = 30;
		
			//start(explode, lifespan, frequency, quantity, forceQuantity)
			//  The first parameter sets the effect to "explode" which means all particles are emitted at once
			//  The second gives each particle a lifespan in millisec, 0 means forever
			//  The third is ignored when using burst/explode mode, is the timespan between 2 particles
			//  The fourth parameter  is how many particles will be emitted in this single burst				
			emitter.start(false, 0, 500);
	}
};