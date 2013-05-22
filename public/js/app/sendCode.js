$(document).ready(function() {
	$('.submit').on('click', function(e) {
		e.preventDefault();

		var val = $('.input').val();

		if (val) {
			$.ajax('execute', {
				method: 'POST',
				data: $('.input').val()
			}).always(function(response) {
				$('.output').val(response);
			});
		}
	});
});

