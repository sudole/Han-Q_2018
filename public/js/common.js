function Key13Event(stpoint, fname) {
	$(stpoint).keydown(function(key) {
		if (key.keyCode == 13) {
			fname();
		}
	});
}