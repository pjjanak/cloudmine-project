$(document).ready(function() {
	var jsInput = $('.js-input'),
		jsOutput = $('.js-output'),
		nameInput = $('.snippet-name'),
		snippetList = $('.snippet-list'),
		uploadButton = $('.upload-button'),
		uploadInput = $('.upload-input'),
		fileForm = $('.file-form'),
		selectedSnippet = null;

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

	$('.save').on('click', function(e) {
		e.preventDefault();

		var js = jsInput.val(),
			name = nameInput.val() ? nameInput.val() : '<i>No Name</i>';

		if (js) {
			var newSnip = $('<li class="snippet">' + name + '</li>');

			newSnip.on('click', handleSnipClip);
			newSnip.data('js', js);
			newSnip.data('name', name === '<i>No Name</i>' ? 'No Name' : name);

			snippetList.append(newSnip);
		}
	});

	uploadButton.on('click', function(e) {
		uploadInput.trigger('click');
	});

	uploadInput.on('change', function(e) {
		var opts = {
			success: function(e) {
				jsInput.val(e);
			}
		}

		fileForm.ajaxSubmit(opts);
	});

	function handleSnipClip(e) {
		var target = $(e.target);

		if (selectedSnippet) {
			selectedSnippet.removeClass('selected');
		}

		target.addClass('selected');
		selectedSnippet = target;

		jsInput.val(target.data('js'));
		nameInput.val(target.data('name'));
	};
});

