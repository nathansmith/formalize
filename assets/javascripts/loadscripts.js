// load in different libraries based on hash tag
(function(){
	var libs = {
			mootools: 'https://ajax.googleapis.com/ajax/libs/mootools/1.3.0/mootools-yui-compressed.js',
			jquery: 'https://ajax.googleapis.com/ajax/libs/jquery/1.4.3/jquery.min.js'
		},
		lib = (window.location.hash || '#jquery').replace('#','');
	// loldocument.write n00b
	document.write('<script type="text/javascript" src="' + libs[lib] + '"></script>');
	document.write('<script type="text/javascript" src="assets/javascripts/formalize-' + lib + '.js"></script>');
}());
