// Wraps Tizen module "SystemSetting".

define(['Ti/_/lang', 'Ti/_/Evented', 'Tizen/_/WebAPIError'], function(lang, Evented, WebAPIError) {

	function errorCallback (e, callback) {
		callback({
			code: -1,
			error: e.type + ': ' + e.message,
			success: false
		});
	}

	return lang.mixProps(require.mix({}, Evented), {

		setProperty: function(type /*SystemSettingType*/, value /*DOMString*/, callback) {
			return tizen.systemsetting.setProperty(type, value, function() {
				callback({
					code: 0,
					success: true
				});
			}, function(e) {
				errorCallback(e, callback);
			});
		},

		getProperty: function(type /*SystemSettingType*/, callback) {
			return tizen.systemsetting.getProperty(type, function(value) {
				callback({
					code: 0,
					success: true,
					data: value
				});
			}, function(e) {
				errorCallback(e, callback);
			});
		},

		constants: {
			SYSTEM_SETTING_TYPE_HOME_SCREEN: 'HOME_SCREEN',
			SYSTEM_SETTING_TYPE_LOCK_SCREEN: 'LOCK_SCREEN',
			SYSTEM_SETTING_TYPE_INCOMING_CALL: 'INCOMING_CALL',
			SYSTEM_SETTING_TYPE_NOTIFICATION_EMAIL: 'NOTIFICATION_EMAIL'
		}

	}, true);
});
