$(document).ready(function() {
	var jsInput = $('.js-input'),
		jsOutput = $('.js-output');

	$('.run').on('click', function(e) {
		e.preventDefault();

		var js = jsInput.val();

		if (js) {
			$.ajax('execute', {
				method: 'POST',
				data: js
			}).always(function(response) {
				jsOutput.val(response);
			});
		}
	});
});

