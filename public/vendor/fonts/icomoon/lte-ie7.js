/* Load this script using conditional IE comments if you need to support IE 7 and IE 6. */

window.onload = function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'icomoon\'">' + entity + '</span>' + html;
	}
	var icons = {
			'icon-exit' : '&#xe000;',
			'icon-enter' : '&#xe001;',
			'icon-wrench' : '&#xe002;',
			'icon-plus' : '&#xe003;',
			'icon-minus' : '&#xe004;',
			'icon-eye' : '&#xe005;',
			'icon-eye-blocked' : '&#xe006;',
			'icon-pencil' : '&#xe007;',
			'icon-remove' : '&#xe008;',
			'icon-close' : '&#xe009;',
			'icon-floppy' : '&#xe00a;'
		},
		els = document.getElementsByTagName('*'),
		i, attr, html, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		attr = el.getAttribute('data-icon');
		if (attr) {
			addIcon(el, attr);
		}
		c = el.className;
		c = c.match(/icon-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
};