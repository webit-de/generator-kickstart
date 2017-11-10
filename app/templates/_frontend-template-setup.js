requirejs.config({
	'appdir': '../',
	'baseUrl': './',
	'paths': {
		//{{app}}
    '_core': 'app/_core/_core',<% if (includeCookie) { %>
    'cookie-info': 'app/cookie-info/cookie-info',<% } %><% if (includeSocialSharing) { %>
    'social-media-share': 'app/social-media-share/social-media-share',<% } %>

		//{{libs}}<% if (includeCookie) { %>
    'cookie': 'libs/cookie/cookie',<% } %>
		'jquery.exists': 'libs/jquery.exists/jquery.exists',
		'jquery': 'libs/jquery/dist/jquery.min'
	},
	'shim': {
		'jquery.exists': ['jquery']
	}
});

requirejs(['app/main']);
