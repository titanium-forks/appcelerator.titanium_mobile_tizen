define(['Ti/_/declare', 'Ti/_/dom', 'Ti/_/event', 'Ti/_/Evented'],
	function(declare, dom, event, Evented) {
	
	var on = require.on,
		mimeTypes = {
			'mp3': 'audio/mpeg',
			'ogg': 'audio/ogg',
			'wav': 'audio/wav'
		},
		urlRegExp = /.+\.([^\/\.]+?)$/,
		INITIALIZED = 1,
		PAUSED = 2,
		PLAYING = 3,
		STARTING = 4,
		STOPPED = 5,
		STOPPING = 6;
		
	return declare('Ti._.Media.Audio', Evented, {
		
		constructor: function() {
			this._handles = [];
		},
		
		_currentState: STOPPED,
		
		_pause: function() {
			this._currentState === STOPPING ? this._stop() : this._changeState(PAUSED, 'paused');
		},
		
		_timeupdate: function() {
			this._currentState === STOPPING && this.pause();
		},
		
		_init: function() {
			this._beforeInit && this._beforeInit();
			this._initialized = 1;
			this._changeState(INITIALIZED, 'initialized');
			this._afterInit && this._afterInit();
		},
	
		_changeState: function(newState) {
			this._currentState = newState;
			this.constants.__values__.playing = PLAYING === newState;
			this.properties.__values__.paused = PAUSED === newState;
		},
		
		_createAudio: function(url) {
			var self = this,
				audio = self._audio = dom.create('audio'),
				i = 0, attr, match;
			
			// Handlers of events generated by the <audio> tag. 
			// These events are handled here and do not propagate outside.
			self._handles = [
				on(audio, 'playing', self, function() {
                    self._changeState(PLAYING, 'playing');
                }),
				on(audio, 'play', self, function() {
                    self._changeState(STARTING, 'starting');
                }),
				on(audio, 'pause', self, '_pause'),
				on(audio, 'ended', self, function() {
                    self._ended && self._ended(); 
                }),
				on(audio, 'abort', self, function() {
                    self._abort && self._abort();
                }),
				on(audio, 'timeupdate', self, '_timeupdate'),
				on(audio, 'error', self, function() {
                    self._error && self._error();
                }),
				on(audio, 'loadedmetadata', self, function() {
                    self._loadedmetadata && self._loadedmetadata();
                }),
				on(audio, 'durationchange', self, function() {
                    self._durationChange && self._durationChange();
                }),
				on(audio, 'canplay', self, '_init')				
			];
			
			document.body.appendChild(audio);
			
			//Set 'url' into tag <source> of tag <audio>
			require.is(url, 'Array') || (url = [url]);
			
			for (; i < url.length; i++) {
				attr = { src: url[i] };
				match = url[i].match(urlRegExp);
				match && mimeTypes[match[1]] && (attr.type = mimeTypes[match[1]]);
				dom.create('source', attr, audio);
			}

			return audio;
		},
		
		// Methods
		
		// Remove the <audio> tag from the DOM tree
		release: function() {
			var audio = this._audio,
				parent = audio && audio.parentNode,
				p = this.properties.__values__;
				
			this._currentState = STOPPED;
			this.constants.__values__.playing = p.paused = false;
			p.url = this._initialized = this._nextCmd = 0;
			
			if (parent) {
				event.off(this._handles);
				parent.removeChild(audio);
			}
			this._audio = 0;
		},
		
		pause: function() {
			this._nextCmd = this.pause;
			this._initialized && this._currentState === PLAYING && this._audio.pause();
		},
		
		start: function() {
			this._nextCmd = this.start;
			this._initialized && this._currentState !== PLAYING && this._audio.play();
		},
		
		play: function() {
			this.start();
		},
		
		_stop: function(description) {
			var a = this._audio;
				
			a.currentTime = 0;
			this._changeState(STOPPED, description || 'stopped');

			// Some versions of Webkit has a bug: if <audio>'s current time is non-zero and we try to 
			// stop it by setting time to 0 and pausing, it won't work: music is paused, but time is 
			// not reset. This is a work around.
			a.currentTime === 0 || a.load();
		},
        
   		stop: function() {
            this._nextCmd = 0;

			if (!this._initialized) {
				return;
			}
            	
			if (this._currentState === PAUSED) {
				this._stop();
			} else {
				this._changeState(STOPPING, 'stopping');
				this._audio.pause();
			}
		},
		
		isPaused: function() {
				return this.paused; 
		},
		
		isPlaying: function() {
				return this.playing;
		},
		
		constants: {
			playing: false,
		},
		
		properties: {
		
			url: {
				set: function(value, oldValue) {
					if (!value || value === oldValue) {
						return oldValue;
					}
					this.release();
					this._createAudio(value);
					return value;
				}
			},

			// The property 'volume' mirrors (cache) the according property of the <audio> tag
			// Reason: if the <audio> tag is not initialized, direct referencing of the tag's properties
			// leads to exception. To prevent this situation, we mirror the property 'volume' and use this
			// if the tag's property cannot be accessed at the moment.

			volume: {
				value: 1.0,
				set: function(value) {
					value = Math.max(0, Math.min(1, value));
					this._initialized && (this._audio.volume = value);
					return value;
				}
			},

			paused: {
				value: false,
				set: function(value, oldValue) {
				    if (value !== oldValue) {
                        value ? this.pause() : this.start();
                    }
					
                    return oldValue;
				}
			}
		}
	});

});
