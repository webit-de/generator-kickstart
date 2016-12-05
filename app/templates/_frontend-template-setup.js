requirejs.config({
	'appdir': '../',
	'baseUrl': './',
	'paths': {
		//{{app}}
    '_core': 'app/_core/_core',

		//{{libs}}
		'jquery.exists': 'libs/jquery.exists/jquery.exists',
		'jquery': 'libs/jquery/dist/jquery.min'
	},
	'shim': {
		'jquery.exists': ['jquery']
	}
});

requirejs(['app/main']);
