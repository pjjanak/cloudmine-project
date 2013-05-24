$(document).ready(function() {
	var curTab = $('.tab.active');

	$('.tab').on('click', function(e) {
		var newCur = $(e.delegateTarget);

		curTab.removeClass('active');
		$('.' + curTab.data('toggle')).addClass('hide');

		$('.' + newCur.data('toggle')).removeClass('hide');
		newCur.addClass('active');
		curTab = newCur;
	});
});