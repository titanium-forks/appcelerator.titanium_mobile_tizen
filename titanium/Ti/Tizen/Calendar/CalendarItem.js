define(['Ti/_/declare', 'Ti/Tizen/Calendar/CalendarEventId', 'Ti/Tizen/Time/TimeDuration'], function(declare, CalendarEventId, TimeDuration) {

	function createTZDate(dateObj) {
		return new tizen.TZDate(dateObj.getUTCFullYear(), dateObj.getUTCMonth(), dateObj.getUTCDate(), dateObj.getUTCHours(), dateObj.getUTCMinutes())
	}
	function createDate(tzDateObj){
		return new Date(tzDateObj.getUTCFullYear(), tzDateObj.getUTCMonth(), tzDateObj.getUTCDate(), tzDateObj.getUTCHours(), tzDateObj.getUTCMinutes());
	}

	return declare('Ti.Tizen.Calendar.CalendarItem', null, {
		constructor: function(args) {
			this._obj = args;
			this._obj.duration && (this.properties.__values__.duration = new TimeDuration(this._obj.duration));
		},

		constants: {
			id: {
				get: function() {
					return (this._obj == '[object CalendarEvent]') ? (new Ti.Tizen.Calendar.CalendarEventId(this._obj.id)) : this._obj.id;
				}
			},
			lastModificationDate: {
				get: function() {
					return this._obj.lastModificationDate;
				}
			}
		},

		properties: {
			description: {
				get: function() {
					return this._obj.description;
				},
				set: function(value) {
					this._obj.description = value;
				}
			},
			summary: {
				get: function() {
					return this._obj.summary;
				},
				set: function(value) {
					this._obj.summary = value;
				}
			},
			isAllDay: {
				get: function() {
					return this._obj.isAllDay;
				},
				set: function(value) {
					this._obj.isAllDay = value;
				}
			},
			startDate: {
				set: function(value) {
					if (value instanceof tizen.TZDate) {
						this._obj.startDate = value;
					} else {
						this._obj.startDate = createTZDate(value);
					}
				},
				get: function() {
					var startDate = this._obj.startDate;
					return createDate(startDate);
				}
			},
			duration: {
				set: function(value) {
					if (value.toString() == '[object TiTizenTimeTimeDuration]') {
						this._obj.duration = value._obj;
					} else {
						this._obj.duration = value;
					}

					return new TimeDuration(this._obj.duration);
				}
			},
			location: {
				get: function() {
					return this._obj.location;
				},
				set: function(value) {
					this._obj.location = value;
				}
			},
			geolocation: {
				get: function() {
					return this._obj.geolocation;
				},
				set: function(value) {
					this._obj.geolocation = value;
				}
			},
			organizer: {
				get: function() {
					return this._obj.organizer;
				},
				set: function(value) {
					this._obj.organizer = value;
				}
			},
			visibility: {
				get: function() {
					return this._obj.visibility;
				},
				set: function(value) {
					this._obj.visibility = value;
				}
			},
			status: {
				get: function() {
					return this._obj.status;
				},
				set: function(value) {
					this._obj.status = value;
				}
			},
			priority: {
				get: function() {
					return this._obj.priority;
				},
				set: function(value) {
					this._obj.priority = value;
				}
			},
			alarms: {
				get: function() {
					return this._obj.alarms;
				},
				set: function(value) {
					this._obj.alarms = value;
				}
			},
			categories: {
				get: function() {
					return this._obj.categories;
				},
				set: function(value) {
					this._obj.categories = value;
				}
			},
			attendees: {
				get: function() {
					return this._obj.attendees;
				},
				set: function(value) {
					this._obj.attendees = value;
				}
			}
		},

		convertToString: function(format /*CalendarTextFormat*/) {
			return this._obj.convertToString(format);
		},

		clone: function() {
			return new (require('Ti/Tizen/Calendar/CalendarEvent'))(this._obj.clone());
		}
	});
});