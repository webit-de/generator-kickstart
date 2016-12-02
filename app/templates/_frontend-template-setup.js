requirejs.config({
	'appdir': '../',
	'baseUrl': './',
	'paths': {
		//{{app}}

		//{{libs}}
		'jquery.exists': 'libs/jquery.exists/jquery.exists',
		'jquery': 'libs/jquery/dist/jquery.min'
	},
	'shim': {
		'jquery.exists': ['jquery']
	}
});

requirejs(['app/main']);
