/*
 Kompilieren:
 cd /animexx/repository/build
 gulp main-js
 */

var animexx_history_curr = {"u": ""},
	animexx_history_handlers = {},
	animexx_history_extrajs_loaded = [],
	animexx_history_extracss_loaded = [],
	animexx_history_full_ajax_active = false;


function animexx_history_addStateListener(statename, listener) {
	if (typeof(animexx_history_handlers[statename]) == "undefined") animexx_history_handlers[statename] = [];
	animexx_history_handlers[statename].push(listener);
}
function animexx_history_gotoState(state, value) {
	animexx_history_curr[state] = value;
	var hash = "", j;
	$.each(animexx_history_curr, function (key) {
		if (key == "u" && !animexx_history_full_ajax_active) return;
		if (hash != "") hash += "~";
		hash += key + "=" + this;
	});
	$.History.go(hash);
	if (typeof(animexx_history_handlers[state]) != "undefined") for (j = 0; j < animexx_history_handlers[state].length; j++) animexx_history_handlers[state][j](value);
}

function animexx_history_goto(state) {
    if (window["animexx_history_override_active"]) {
        return;
    }

	var states = state.split("~"),
		newstate = {},
		statevars = [],
		i, j, x, pos, v_name, v_val, requestdata;

	for (i = 0; i < states.length; i++) {
		x = states[i];
		pos = x.indexOf("=");
		if (pos == -1) continue;
		v_name = x.substring(0, pos);
		v_val = x.substring(pos + 1);
		newstate[v_name] = v_val;
		if (v_name != "u") statevars.push(v_name);
	}

	if (typeof(newstate["u"]) != "undefined") newstate["u"] = decodeURIComponent(newstate["u"]).replace("#", encodeURIComponent("#"));

	// Testfälle:
	// http://animexx.onlinewelten.com/ens/?doc_modus=lesen&id=12989047843296&fajax_deactivate=1#u=/ens/?doc_modus=lastens (cato) => zeigt ENS an
	// http://animexx.onlinewelten.com/!#u=/ens/?ordner=2 (ausgeloggt) => zeigt Loginfeld an
	if (typeof(newstate["u"]) != "undefined" && newstate["u"] != animexx_history_curr["u"] && animexx_history_full_ajax_active) {
		requestdata = {"animexx_full_ajax_url": newstate["u"]};
		if (typeof(newstate["scrollTo"]) != "undefined") requestdata["animexx_full_ajax_scrollTo"] = newstate["scrollTo"];
		$.ajax({
			"url": "/ajax/get-site.php",
			"data": requestdata,
			"dataType": "json",
			"type": "GET",
			"success": animexx_history_update_site,
			"error": animexx_history_loaderror
		});
	} else if (typeof(newstate["u"]) != "undefined" && newstate["u"] != animexx_history_curr["u"] && !animexx_history_full_ajax_active && !animexx_history_isRelevantURL(location.pathname)) {
		location.href = location.protocol + "//" + location.hostname + newstate["u"];
	} else if (typeof(newstate["u"]) != "undefined" && newstate["u"] == animexx_history_curr["u"] && animexx_history_full_ajax_active && typeof(newstate["scrollTo"]) != "undefined") {
		animexx_history_scroll_to(newstate["scrollTo"]);
        window.setTimeout(function() {
            animexx_history_scroll_to(newstate["scrollTo"]);
        }, 500);
        window.setTimeout(function() {
            animexx_history_scroll_to(newstate["scrollTo"]);
        }, 1000);
	} else {
		for (i = 0; i < statevars.length; i++) {
			v_name = statevars[i];
			if (typeof(animexx_history_handlers[v_name]) != "undefined" && (typeof(animexx_history_curr[v_name]) == "undefined" || animexx_history_curr[v_name] != newstate[v_name])) {
				for (j = 0; j < animexx_history_handlers[v_name].length; j++) animexx_history_handlers[v_name][j](newstate[v_name]);
				animexx_history_curr[v_name] = newstate[v_name];
			}
		}
	}
}

function animexx_history_update_relative_links() {
	var $bodycontent = $("#animexx_bodycontent");

	var x = animexx_history_curr["u"].split("/"),
		path_curr = "", path_parent = "";
	for (i = 1; i < x.length; i++) {
		if (i < (x.length - 1)) path_curr += "/" + x[i];
		if (i < (x.length - 2)) path_parent += "/" + x[i];
	}
	$bodycontent.find("a").each(function () {
		var $this = $(this),
			url = $this.attr("href");
		if (typeof(url) == "undefined") return;
		if (url.substr(0, 3) == "../") $this.attr("href", path_parent + url.substring(2));
		if (url.substr(0, 2) == "./") $this.attr("href", path_curr + url.substring(1));
	});
	$bodycontent.find("form").each(function () {
		var $this = $(this),
			url = $this.attr("action");
        if (typeof(url) == "undefined") return;
		if (url.substr(0, 3) == "../") $this.attr("action", path_parent + url.substring(2));
		if (url.substr(0, 2) == "./") $this.attr("action", path_curr + url.substring(1));
	});
}

function animexx_history_update_site(data) {
	$(".fajax_indicate_loading").each(animexx_history_deindicate_loading);
	xxmenu_closeMenu();
	axx_userfenster_close();
	$(".closeOnSiteChange").remove();
	if (typeof(animexx_history_curr["scrollTo"]) == "undefined") window.scrollTo(0, 0);

	animexx_history_curr = { "u": data.url };
	animexx_history_handlers = {};

	var newurl, lib, found, j, i;

	if (typeof(data["textareas_todelete"]) != "undefined") at_remove_entwuerfe(data["textareas_todelete"]);

	if (typeof(data["redirect"]) != "undefined") {
		location.href = animexx_history_normal2internal_link(data["redirect"]);
		return;
	} else {
		newurl = "u=" + data.url;
		if (typeof(data.scrollTo) != "undefined") newurl += "~scrollTo=" + data.scrollTo;
		$.History.go(newurl);
	}

	for (i = 0; i < data["extracss"].length; i++) {
		lib = data["extracss"][i];
		found = false;
		for (j = 0; j < animexx_history_extracss_loaded.length; j++) if (animexx_history_extracss_loaded[j] == lib) found = true;
		if (!found) {
			$("#bodyid").append("<link rel='stylesheet' type='text/css' href='" + lib + "'>");
			animexx_history_extracss_loaded.push(lib);
		}
	}
	var $bodycontent = $("#animexx_bodycontent");
	$bodycontent.html(data.content);

	if (data["usesrelativelinks"]) animexx_history_update_relative_links();

	document.title = data.title;
	$("#header_caption").text(data.caption);
	$("#header_breadcrumb").html(data["breadcrumb"]);
	if (typeof(data["mem_n"]) != "undefined") $("#header_memn").text(data["mem_n"]);
	if (typeof(data["mem_p"]) != "undefined") $("#header_memp").text(data["mem_p"]);
	$("#header_ladezeit").text(data["ladezeit"]);
	if (typeof(data["benachrichtigungen"]) != "undefined") ens_checker2_cb(data["benachrichtigungen"]);

	var toload = [];
	for (i = 0; i < data["extrajs"].length; i++) {
		lib = data["extrajs"][i];
		found = false;
		for (j = 0; j < animexx_history_extrajs_loaded.length; j++) if (animexx_history_extrajs_loaded[j] == lib) found = true;
		if (!found) {
			//$("#bodyid").append("<script src='" + lib + "' type='text/javascript' charset='UTF-8'></script>");
			toload.push(lib);
			animexx_history_extrajs_loaded.push(lib);
		}
	}
	if (typeof(data["onloadjs"]) != "undefined" && data["onloadjs"] != "") {
		if (toload.length > 0) LazyLoad.js(toload, function () {
			eval(data["onloadjs"])
		});
		else eval(data["onloadjs"]);
	}
	if (typeof(data["scrollTo"]) != "undefined") animexx_history_scroll_to(data["scrollTo"]);
	if (typeof($.animexxTextbox) != "undefined") $(".animexxtextbox").animexxTextbox();

	$(".logoutlink").attr("href", "/logout.php?redirect=" + encodeURI(animexx_history_curr["u"]));

	if (typeof $.Lightbox !== 'undefined') $('a[rel=lightbox-gallery]').lightbox();
	if (typeof ($.animexxTextbox) !== 'undefined') {
		$(".animexxtextbox").animexxTextbox();
	}
    $(".animexx_text_ckeditor").each(function () {
        ckeditor_animexxtextbox_load_and_init($(this));
    });
}

function animexx_history_scroll_to(scrollto) {
	animexx_history_curr["scrollTo"] = scrollto;
	var el = $("#" + scrollto), pos;
	if (el.length == 0) el = $("a[name=" + scrollto + "]");
	if (el.length > 0) {
        el.scrollintoview({ top_offset: -100 });
	} else window.scrollTo(0, 0);
}

function animexx_history_loaderror() {
	alert("Beim Laden ist leider etwas schief gelaufen, möglicherweise ist die Internetverbindung abgebrochen oder der Animexx-Server hat Probleme. Bitte probier es später einfach nochmal. Tut uns Leid für die Probleme.");

	var oldhash = "";
	$.each(animexx_history_curr, function (key) {
		if (key == "u" && !animexx_history_full_ajax_active) return;
		if (oldhash != "") oldhash += "~";
		oldhash += key + "=" + this;
	});
	$.History.go(oldhash);
	$(".fajax_indicate_loading").each(animexx_history_deindicate_loading);
}

function animexx_history_isRelevantURL(url) {
	if (typeof(url) == "undefined") {
		if (animexx_user_id == 2) alert("URL undefiniert");
	}

	if (url.indexOf("/!#u=") == 1) return true;
	if (url.indexOf("://") >= 0) return false;
	if (url.indexOf("javascript:") == 0) return false;

	url = url.split("#");
	url = url[0];

	var node_url_strip = url.split("?");
	node_url_strip = node_url_strip[0];
	if (node_url_strip.indexOf(".php") == -1 && node_url_strip.indexOf(".phtml") == -1 && node_url_strip.indexOf(".html") == -1 && node_url_strip[node_url_strip.length - 1] != "/") return false;

	if (animexx_history_full_ajax_active) {
		if (url.substring(0, 2) == "./") return true;
		if (url.substring(0, 3) == "../") return true;
	}

	if (url.indexOf("com/!#") >= 0) return false;

	return (url.indexOf("/ens/") == 0 || url.indexOf("/ens4/") == 0 || url.indexOf("/rpg/") == 0 || (animexx_user_id == 2 && url.indexOf("/fotos/") == 0));
}

function animexx_history_normal2internal_link(url) {
	url = animexx_history_resolve_relative(url);

	var stripped = url.split("?"),
		hu, repl_url, x, y, np, x2, path;
	stripped = stripped[0];

	// Absolute Links nie ändern
	if (stripped.indexOf("://") >= 0) {
		return url;

		// Außerhalb der Full-Ajax-Bereiche (animexx_full_ajax_url == false) nur isRelevant-URLs modifizieren
	} else if (animexx_history_isRelevantURL(stripped)) {
		hu = url.split("#");
		repl_url = "/!#u=" + hu[0];
		if (hu.length > 1 && hu[1].length > 0) repl_url += "~scrollTo=" + hu[1];
		return repl_url;

	} else if (!animexx_history_full_ajax_active) {
		return url;

	} else if (stripped[0] == "#") { // Interner Verweis
		repl_url = "/!#u=" + animexx_history_curr["u"];
		if (stripped.length > 1) repl_url += "~scrollTo=" + stripped.substring(1);
		return repl_url;

	} else if (stripped[0] != "/") { // relativer Link

		x = animexx_history_curr["u"].split("?");
		y = x[0].lastIndexOf("/");
		path = x[0];
		if (y > 0) path = x[0].substring(0, y);
		if (path[path.length - 1] != "/") path += "/";

		if (stripped.substring(0, 2) == "./") {
			node_url = path + url.substring(2);
		} else if (stripped.substring(0, 3) == "../") {
			np = path.substring(0, path.length - 1);
			x2 = np.lastIndexOf("/");
			np = np.substring(0, x2);

			node_url = np + url.substring(2);
		} else {
			node_url = path + url;
		}

		hu = node_url.split("#");
		repl_url = "/!#u=" + hu[0];
		if (hu.length > 1 && hu[1].length > 0) repl_url += "~scrollTo=" + hu[1];
		return repl_url;

	} else {
		// Wechsel in Nicht-Full-Ajax-Bereich
		return url;
	}
}


function animexx_history_resolve_relative(relative_url) {
	if (relative_url[0] == "/") return relative_url;
	if (relative_url.indexOf("://") >= 0) return relative_url;

	var curr_url;
	if (animexx_history_full_ajax_active) curr_url = animexx_history_curr["u"];
	else curr_url = window.location.pathname;

	curr_url = curr_url.substr(0, curr_url.lastIndexOf("/"));
	while (relative_url.substr(0, 3) == "../") {
		relative_url = relative_url.substring(3);
		curr_url = curr_url.substr(0, curr_url.lastIndexOf("/"));
	}
	if (relative_url.substr(0, 2) == "./") relative_url = relative_url.substring(2);
	relative_url = curr_url + "/" + relative_url;

	//var tmp = relative_url.split("?");
	//for (var i = 1; i < tmp.length; i++) relative_url += "?" + tmp[i];

	return relative_url;
}

function animexx_history_linkclicked_intern($node) {
	var href, modified_link;

	if (typeof(full_ajax_mode) == "undefined" || !full_ajax_mode) return false;

	href = $node.attr("href");
	if (typeof(href) == "undefined") return false;
	if (animexx_history_full_ajax_active && href.indexOf("javascript:") == 0) return false;
	if (animexx_history_full_ajax_active && href == "#") return false;

	href = animexx_history_resolve_relative(href);

	if (animexx_history_full_ajax_active && typeof($node.attr("target")) != "undefined" && $node.attr("target") == "_blank") return false;

	modified_link = animexx_history_normal2internal_link(href);

	if (animexx_history_full_ajax_active && href != modified_link) $node.each(animexx_history_indicate_loading);
	// Hinweis: Beim IE9 wird aus irgendeinem Grund der Hash nicht richtig gesetzt, wenn man bereits im History-Modus ist; deswegen wird das explizit nochmal aufgerufen

	var ret = false;
	if (animexx_history_full_ajax_active && modified_link == "/!#" + $.History.getHash()) { // Selbe Seite nochmal => neu laden
		animexx_history_curr = {"u": ""};
		animexx_history_goto($.History.getHash());
		ret = true;
	} else if (animexx_history_full_ajax_active && modified_link.substr(0, 3) == "/!#") {
		$.History.go(modified_link.substr(3));
		ret = true;
	} else if (animexx_history_isRelevantURL(href)) {
		$node.attr("href", modified_link);
	}
	if (!animexx_history_full_ajax_active && modified_link != href) $.jCookie("fajax_site", href, 10, {"path": "/"});
	return ret;
}
function animexx_history_linkclicked(ev) {
	if (ev.shiftKey || ev.ctrlKey) return;
	var $node = $(this);
	if ($node.hasClass("no-full-ajax")) return;
	if (typeof($node.attr("onclick")) != "undefined") return;
	if (ev.isDefaultPrevented()) return;

	if (animexx_history_linkclicked_intern($node)) ev.preventDefault();
}

function animexx_history_formsubmitted(ev) {
	var $node = $(this),
		action, method, postdata, getdata, url, get_arr = {}, post_arr = {};

	if (ev.isDefaultPrevented()) return;
	if (typeof($node.attr("enctype")) != "undefined" && $node.attr("enctype").toLowerCase() == "multipart/form-data") return;
	if ($node.hasClass("no-full-ajax")) return;
	if (!animexx_history_full_ajax_active) return;

	action = animexx_history_resolve_relative($node.attr("action"));
	if (typeof(action) == "undefined") action = window.location.href;
	if (!animexx_history_isRelevantURL(action)) return;

	if (action.substring(0, 1) == ".") {
		action = animexx_history_resolve_relative(action);
		$node.attr("action", action);
	}
	if (!animexx_history_isRelevantURL(action)) return;

	method = "GET";
	if ($node.attr("method").toLowerCase() == "post") method = "POST";

	postdata = null;
	getdata = "/ajax/get-site.php?";

	if (method == "GET") {
		url = action;
		if (action.indexOf("?") > 0) url += "&";
		else url += "?";
		url += $node.serialize();

		$node.find("input[disabled]").each(function () {
			url += "&" + encodeURIComponent($node.attr("name")) + "=" + encodeURIComponent($node.val());
		});
		getdata += "animexx_full_ajax_url=" + encodeURIComponent(url);
	} else {
		postdata = "animexx_full_ajax_url=" + encodeURI(action) + "&" + $node.serialize();
		$node.find("input[disabled]").each(function () {
			postdata += "&" + encodeURIComponent($node.attr("name")) + "=" + encodeURIComponent($node.val());
		});
	}

	$.ajax({
		"url": getdata,
		"data": postdata,
		"dataType": "json",
		"type": method,
		"success": animexx_history_update_site,
		"error": animexx_history_loaderror
	});

	$node.find("input[type=submit]").each(animexx_history_indicate_loading);

	ev.preventDefault();
}

function animexx_history_disableclick(ev) {
	ev.preventDefault();
}
function animexx_history_indicate_loading() {
	var $node = $(this);
	if (typeof($node.prop("disabled")) != "undefined") $node.data("fajax-disabled-pre", $node.prop("disabled"));
	if (typeof($node.css("color")) != "undefined") $node.data("fajax-color-pre", $node.css("color"));
	$node.prop("disabled", true);
	$node.css("color", "gray");
	$node.addClass("fajax_indicate_loading");
	$node.on("click", animexx_history_disableclick);

	if ($node.hasClass("button") || $node.hasClass("greybutton")) {
		$node.addClass("button-loading");
	} else {
		var $load_indicator = $("<img src='/pics/loading.gif' alt='Loading' class='animexx_history_load_indicator'>");
		$("#animexx_bodycontent").append($load_indicator);
		$load_indicator.position({
			of: $node,
			my: "right center",
			at: "left center"
		});
	}
}
function animexx_history_deindicate_loading() {
	var $node = $(this);
	if (typeof($node.data("fajax-disabled-pre")) != "undefined") $node.prop("disabled", $node.data("fajax-disabled-pre")); else $node.prop("disabled", false);
	if (typeof($node.data("fajax-color-pre")) != "undefined") $node.css("color", $node.data("fajax-color-pre"));
	$node.removeClass("fajax_indicate_loading");
	$node.off("click", animexx_history_disableclick);
	$(".animexx_history_load_indicator").remove();
	$(".button-loading").removeClass("button-loading");
}

function animexx_history_init() {
	if (typeof(full_ajax_mode) == "undefined" || !full_ajax_mode) return;
	animexx_history_full_ajax_active = (location.href.indexOf("onlinewelten.com/!#") != -1 || location.href.indexOf("animexx.de/!#") != -1);

	$(document).on("click", "a", animexx_history_linkclicked);
	$(document).on("submit", "form", animexx_history_formsubmitted);

	if (!animexx_history_full_ajax_active) return;

	$(document).on("click", "input:submit", function () {
		var $node = $(this), $form;
		$form = $node.parents("form");
		if ($form.find("input[name=_submit_name]").length == 0) {
			$form.append("<input type='hidden' name='_submit_name' value=''><input type='hidden' name='_submit_value' value=''>");
		}
		$form.find("input[name=_submit_name]").val($node.attr("name"));
		$form.find("input[name=_submit_value]").val($node.val());
	});

	$.ajaxPrefilter(function (options, originalOptions, jqXHR) {
		if (options.url[0] == '.') options.url = animexx_history_resolve_relative(options.url);
	});

	$("script").each(function () {
		var src = $(this).attr("src");
		if (typeof(src) != "undefined") animexx_history_extrajs_loaded.push(src);
	});
	$("link[rel=stylesheet][href]").each(function () {
		var href = $(this).attr("href");
		animexx_history_extracss_loaded.push(href);
	});
    xx_onPageLoad();
}


function animexx_history_goto_url(url) { // Für externe Aufrufe
	var modified_link = animexx_history_normal2internal_link(url);
	if (animexx_history_full_ajax_active && modified_link.substr(0, 3) == "/!#") {
		$.History.go(modified_link.substr(3));
	} else {
		window.location.href = url;
	}
}

window["animexx_history_override_active"] = false;

function animexx_history_override_back_set(cb) {
    try {
        window.onpopstate = function(event) {
            window["animexx_history_override_active"] = false;
            cb();
        };
        window["animexx_history_override_active"] = true;
        if (animexx_history_full_ajax_active) {
            var curr = animexx_history_curr["u"];
            history.pushState({android: 1}, "android_back_hack", animexx_history_normal2internal_link(append_url(curr, "android_back=1")));
        } else {
            history.pushState({android: 1}, "android_back_hack", append_url(window.location.href, "android_back=1"));
        }
    } catch (e) { console.log(e); }
}

function animexx_history_override_back_unset() {
    try {
        window.onpopstate = null;
        if (window["animexx_history_override_active"]) {
            window["animexx_history_override_active"] = false;
            history.back();
        }
    } catch (e) { console.log(e); }
}


$(function () {
    if (!$("body").hasClass("msie7") && $.History) {
		$.History.bind(animexx_history_goto);
		animexx_history_init();
	}
});
