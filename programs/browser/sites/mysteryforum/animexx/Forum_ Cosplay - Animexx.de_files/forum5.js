var str_inline_zitat = "Zitieren",
	str_err_betreffkurz = 'Bitte gib einen längeren Betreff an.',
	str_err_textkurz = 'Das Posting sollte doch etwas länger sein...',
	str_err_keinekats = 'Bitte wähle mindestens ein Unterforum aus.',
	sichtbarkeit_curr = null;


function add_kat_opener(thread) {
	open_iframe_dialog("thread_zuord", "./iframe_zuordnungen/", "Zuordnung hinzufügen", 600, 400);
	return false;
}

function thread_status_opener(thread) {
	open_iframe_dialog("thread_status", thread + "iframe_status/", "Thread-Status", 400, 500);
	return false;
}

function posting_admin_opener(url) {
	open_iframe_dialog("posting_admin", url, "Posting bearbeiten", 500, 600);
	return false;
}


function kats_selected(sel) {
	$("#kats_holder").find(".katsselector").each(function() {
		if ($(this).data("name") == sel) $(this).css("backgroundColor", "#E0E0FF");
		else $(this).css("backgroundColor", "#C3C3FF");
	});
	$("#kats_holder").find(".kats_content").each(function() {
		if ($(this).data("name") == sel) $(this).show();
		else $(this).hide();
	});
}

function clickKatsSelNav(id) {
	$("#kats_sel_" + katsSelNav_selected).hide();
	katsSelNav_selected = id;
	$("#kats_sel_" + katsSelNav_selected).show();
}

function addKatsSelNav(rueck_id, eigen_id, eigen_name, subkats) {
	var str = "<div id='kats_sel_" + eigen_id + "' ",
		i, sid;
	if (rueck_id != null) str += "style='display: none;'";
	str += ">";
	
	if (rueck_id == null) str += "<a href='/forum/all_threads/' style='color: black;'><div style='float: left; width: 64%;'>&nbsp;</div><div class='katsselnav_item' style='margin-bottom: 4px;'><img src='/pics/fugue3/icons/table-import.png' alt='' style='vertical-align: middle;'> <span style='vertical-align: middle; font-weight: bold;'>Alle Threads</span></div></a>";
	else str += "<div class='katsselnav_item' style='width: 64%; margin-bottom: 4px; color: #5858FF;' onClick='clickKatsSelNav(\"" + rueck_id + "\");'><i><span class='pics_pfeil_links'></span> Zurück</i></div><a href='/forum/kat" + eigen_id + "/'><div class='katsselnav_item' style='margin-bottom: 4px; color: black; '><img src='/pics/fugue3/icons/table-import.png' alt=''> <b>" + eigen_name + "</b></div></a>";
	
	for (i = 0; i < subkats.length; i++) {
		if (subkats[i] == "weitere") {
			str += "<div style='float: right;' class='clickable' onClick='katsSelOpenAll(\"" + eigen_id + "\");'><span class='pics_pfeil_rechts'></span> Alle anzeigen</div>";
		} else {
			sid = subkats[i].typ + "_" + subkats[i].id;
			if (subkats[i].subkats.length == 0) {
				str += "<a href='/forum/kat" + sid + "/' style='color: black;'><div class='katsselnav_item'><img src='/pics/fugue3/icons/table-import.png' alt=''> <span>" + subkats[i].name + "</span></div></a>";
			} else {
				addKatsSelNav(eigen_id, sid, subkats[i].name, subkats[i].subkats);
				str += "<div class='katsselnav_item katsselnav_itemm' onClick='clickKatsSelNav(\"" + sid + "\");'><img src='/pics/fugue3/icons/folder-horizontal.png' alt=''> <span>" + subkats[i].name + "</span></div>";
			}
		}
	}
	if (eigen_id == "1_2") str += "<div style='float: right;' class='clickable' onClick='katsSelOpenAll(\"allethemen\");'><span class='pics_pfeil_rechts'></span> Themen: Komplettliste</div>";
	
	str += "<br style='clear: both;'>";
	str += "</div>";
	$("#kats_sel").append(str);
}

function katsSelOpenAll(eigen_id) {
	if (eigen_id == "allethemen") {
			open_iframe_dialog("all_kats", "./iframe_allkats/?alle=themen", "Alle Themen", 500, 600);
	} else {
		var x = eigen_id.split("_");
		open_iframe_dialog("all_kats", "./iframe_allkats/?typ=" + x[0] + "&id=" + x[1], "Alle Unterforen", 500, 600);
	}
}


function sichtbar_close() {
	if (sichtbarkeit_curr == null) return;
	$("#katselect_setter, #kat_fan_setter, #statusadd_setter").hide();
	sichtbarkeit_curr = null;
}



function katselect_toggle(ev) {
	elname = $(ev.target).data("typid");
	if (sichtbarkeit_curr == null || sichtbarkeit_curr != elname) katselect_open($(ev.target), elname);
	else sichtbar_close();
	ev.stopPropagation();
}
function katselect_open(anchor, elname) {
	var sett = $("#katselect_setter"),
		pos, nururl, x;
	if (typeof(elname) == "string") {
		sichtbarkeit_curr = elname;
		pos = anchor.offset();
		sett.css({ "top": (pos.top - 45) + "px", "left": (pos.left + anchor.width() + 7) + "px" }).show();
		nururl = "/forum/kat" + elname + "/";
		x = elname.split("_");
		if (x[0] == 2 && x[1] != 3332 && x[1] != 3333 && x[1] != 3334 && x[1] != 3343 && x[1] != 3344 && x[1] != 3345 && x[1] != 3346 && x[1] != 3347 && x[1] != 4632) nururl += "kat-1_3,1_5/";
		sett.find(".nurkat").attr("href", nururl);
		sett.find(".kombi_nur").attr("href", path_without_thread + "kat" + elname + "/");
		sett.find(".kombi_ausser").attr("href", path_without_thread + "kat-" + elname + "/");
	}
}


function statusadd_toggle(ev) {
	elname = $(ev.target).text();
	if (sichtbarkeit_curr == null) statusadd_open($(ev.target), elname);
	else sichtbar_close();
	ev.stopPropagation();
}
function statusadd_open(anchor, elname) {
	var sett = $("#statusadd_setter"),
		pos;
	if (typeof(elname) == "string") {
		sichtbarkeit_curr = elname;
		pos = anchor.offset();
		sett.css({ "top": (pos.top - 25) + "px", "left": (pos.left + anchor.width() + 7) + "px" }).show();
		sett.find(".kombi_nur").attr("href", path_without_thread + "status_" + encodeURI(elname) + "/");
		sett.find(".kombi_ausser").attr("href", path_without_thread + "status-" + encodeURI(elname) + "/");
		sett.find(".statusnameholder").text(elname);
	}
}




function kat_fan_toggle(ev) {
	if (sichtbarkeit_curr == null) kat_fan_open($(ev.target));
	else sichtbar_close();
	ev.stopPropagation();
}
function kat_fan_open(anchor, elname) {
	var sett = $("#kat_fan_setter"),
		pos = $("#kat_fan_caller").offset();
	
	sichtbarkeit_curr = "fav";
	sett.css({ "top": (pos.top + 27) + "px", "left": (35 + pos.left - (anchor.width() / 2)) + "px" }).show();
	sett.find(".kat_fan_pfeil").css("left", (40 + anchor.width() / 2) + "px");
}


function forum_url_reload() {
	window.location.reload();
}



function iconselect(i) {
	$("#icon_holder").find(".icon").css("borderColor", "#E0E0FF");
	$("#icon"+i).css("borderColor", "#5858FF");
	$("#icon").val(i);
}

function avatarselect(i) {
	$("#avatar_holder").find(".avatar").css("borderColor", "#E0E0FF");
	$("#avatar"+i).css("borderColor", "#5858FF");
	$("#avatar").val(i);
}




function showAllSubkats(typ, id) {
	open_iframe_dialog("all_kats", "./iframe_allkats/?typ=" + typ + "&id=" + id, "Alle Unterforen", 500, 600);
}

function thread_show_gotopage(seite) {
	$("#prev_holder").find("tr.seite").hide();
	$("#prev_holder").find("tr.seite" + seite).show();
}


function thread_neu_addkat(eigen_id, name) {
	iframeEscapeHandler("thread_zuord");
	var x = eigen_id.split("_"),
		typ = x[0],
		id = x[1],
		found = false,
		entry;
	$("#nt_form").find(".kats_holder .katholder").each(function(){
		if ($(this).find(".kat_typ").val() == typ && $(this).find(".kat_id").val() == id) found = true;
	});
	if (found) return;
	
	entry = $("<div class='vertialalign katholder' data-katid='" + eigen_id + "'><input type='hidden' name='kat_typ[]' class='kat_typ' value='" + typ + "'><input type='hidden' name='kat_id[]' class='kat_id' value='" + id + "'><a href='#' class='remover'><span class='pics_list_remove' title='Entfernen'></span></a> " + name + "</div>");
	entry.find("a.remover").click(function(ev) {
		var par = $(ev.target).parents(".katholder"),
			katid = par.data("katid");
		ev.preventDefault();
		par.remove();
		$("#regeln_" + katid).hide();
		if ($("#nt_form .kats_holder .katholder").length == 0) $("#kats_keine").show();
		$("#kats_adder").show();
	});
	$("#nt_form").find(".kats_holder").append(entry);
	$("#regeln_" + eigen_id).show();
	$("#kats_keine").hide();
	if ($("#nt_form").find(".kats_holder .katholder").length >= forum_max_kats) $("#kats_adder").hide();
}


function neuer_thread_checkform() {
	if ($.trim($("#betreff").val()).length<3) {
	 	alert(str_err_betreffkurz);
		return false;
	}
	if ($.trim($("#posting_text").val()).length<3) {
	 	alert(str_err_textkurz);
		return false;
	}
	if ($("#nt_form").find(".katholder").length == 0) {
		alert(str_err_keinekats);
		return false;
	}
	return true;
}

function antworten_checkform() {
	if ($.trim($("#betreff").val()).length<3) {
	 	alert(str_err_betreffkurz);
		return false;
	}
	if ($.trim($("#posting_text").val()).length<3) {
	 	alert(str_err_textkurz);
		return false;
	}
	return true;
}


function for_adminkomm_show() {
	$.post("/ajax/toggle_set.php?" + animexx_absolutelink_sid, {"key": "for_adminkomm_show", "val": 1 });
	$("#admin_komm_disp_1").show();
	$("#admin_komm_disp_0").hide();
	return false;
}
function for_adminkomm_hide() {
	$.post("/ajax/toggle_set.php?" + animexx_absolutelink_sid, {"key": "for_adminkomm_show", "val": 0 });
	$("#admin_komm_disp_0").show();
	$("#admin_komm_disp_1").hide();
	return false;
}
function for_adminkomm_write() {
	$("#admin_komm_disp_1 form").show();
	$("#admin_komm_writer").hide();
	return false;
}

function for_adminlog_show() {
	$.post("/ajax/toggle_set.php?" + animexx_absolutelink_sid, {"key": "for_adminlog_show", "val": 1 });
	$("#admin_log_disp_1").show();
	$("#admin_log_disp_0").hide();
	return false;
}
function for_adminlog_hide() {
	$.post("/ajax/toggle_set.php?" + animexx_absolutelink_sid, {"key": "for_adminlog_show", "val": 0 });
	$("#admin_log_disp_0").show();
	$("#admin_log_disp_1").hide();
	return false;
}


function lesezeichen_add_form() {
	$("#lesezeichen_add_caller").hide();
	$("#lesezeichen_adder").show().css("display", "inline");
	$("#lesezeichen_adder input[type=text]").focus();
}


function forum_recommend(formname) {
	$.get("./?" + formname + "=1&" + animexx_absolutelink_sid, function(res) {
		if (res == "1") {
			$("#empfehlen_done").show();
			$("#empfehlen_add").hide();
		} else alert("Es ist ein Fehler aufgetreten: " + res);
	});
}


function forum_inline_quote(node, posting_id) {
	var $n = $(node);
    $("#inline_reply_holder").show().scrollintoview( { top_offset: 100 });
	$.getJSON($n.data("link") + "?json_version=1&" + animexx_absolutelink_sid, function(data) {
		var old_val, new_val,
			$textarea = $("#posting_text");
		if ($textarea.hasClass("jHtmlTextarea")) {
            $textarea[0].appendText("\n\n" + data.text, "<br>\n<br>\n" + data.html);
            $textarea.focus();
        } else if ($textarea.data("ckeditor")) {
            $textarea.data("ckeditor").appendText("\n\n" + data.text);
		} else {
			old_val = $textarea.val();
			new_val = old_val + "\n\n" + data.text;
			$textarea.val(new_val).focus();
		}
		$n.parents(".zitierlink").html("<span class='pics_but_accept16'></span>");
	});
	return false;
}

function forum_inline_reply(node) {
	if (!exists("inline_reply_holder")) return true;
	var url = "";
	if (typeof($(node).attr("href")) != "undefined") url = $(node).attr("href");
	if (typeof($(node).attr("action")) != "undefined") url = $(node).attr("action");
	url += "?ajax_version=1&" + animexx_absolutelink_sid;
    $("#inline_reply_holder").show().scrollintoview( { top_offset: 100 });
	
	$("#inline_reply_holder").load(url, function() {
		$("#answer_button").hide();
		$("#posting_text").focus();
		if (typeof $.animexxTextbox !== 'undefined') $(".animexxtextbox").animexxTextbox();
        $(".animexx_text_ckeditor").each(function () {
            ckeditor_animexxtextbox_load_and_init($(this));
        });
	});
	
	if ($(".zitierlink").length == 0) $(".answerlink").each(function(){
		var $t = $(this),
			id = $t.data("postingid"),
			$newnode = $("<span class='zitierlink'>[<a href='#' onClick='return forum_inline_quote(this, \"" + id + "\");'>" + str_inline_zitat + "</a>]</span>");
		$newnode.find("a").data("link", $t.find("a").attr("href"));
		$t.after($newnode);
		$t.hide();
	});
	
	return false;
}


function oe_recommend(node, formname) {
	var holder = $(node).parents(".empfehlen_holder");
	$.get("./?" + formname + "=1&" + animexx_absolutelink_sid, function(ret) {
		if (ret == "1") {
			holder.find(".empfehlen_add").hide();
			holder.siblings(".empfehlen_done").show();
		} else alert("Es ist ein Fehler aufgetreten: " + ret);
	});
}



function thr_status_show() {
	$("#thread_status_tab").show();
	$("#thr_status_hider").show();
	$("#thr_status_shower").hide();
	return false;
}
function thr_status_hide() {
	$("#thread_status_tab").hide();
	$("#thr_status_hider").hide();
	$("#thr_status_shower").show();
	return false;
}




function forum_attachment_openupload() {
    window.KCFinder = {};
    window.KCFinder.callBackMultiple = function (files) {
        window.KCFinder = null;
        for (var i = 0; i < files.length; i++) {
            forum_attachment_add(decodeURIComponent(files[i]));
        }
        $("#kcfinder_upload").dialog("close");
    };
    window.KCFinder.callBack = function (url) {
        window.KCFinder = null;
        forum_attachment_add(decodeURIComponent(url));
        $("#kcfinder_upload").dialog("close");
    };

    open_iframe_dialog("kcfinder_upload", "/include/kcfinder-upload-iframe.php?namespace=1&namespace_id=" + animexx_user_id, "Hochladen", 600, 200);
}

function forum_attachment_add(filename) {
    if (filename.indexOf("/mitglieder/files/") > 0) {
        var x = filename.split("/files/");
        x = x[x.length - 1].split("?");
        x = x[0];
        x = x.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
        var node = $("<div class='attachment'><input type='hidden' name='attachments[]' value=''><a href='#' class='deleter'><span class='pics_list_remove'></span></a> <a class='link' href='' target='_blank'>" + x + "</a></div>");
        node.find("input[type=hidden]").val("/files/" + x);
        node.find("a.link").attr("href", filename);
        node.find(".deleter").click(function (ev) {
            $(this).parents(".attachment").remove();
            ev.preventDefault();
        });
        $("#attachments_list").append(node).css("marginBottom", "10px");
    }
}

function forum_openKCFinder_multipleFiles() {
    return open_kcfinder_dialog("Hochladen", false, 1, animexx_user_id, forum_attachment_add);
}


function forum_openKCFinder_noselect() {
    window.KCFinder = {};
    window.KCFinder.callBackMultiple = function (files) {
        window.KCFinder = null;
        for (var i = 0; i < files.length; i++) {
            forum_attachment_add(decodeURIComponent(files[i]));
        }
    };
    window.open("/include/kcfinder/browse.php?lang=" + $("body").attr("lang") + "&" + animexx_absolutelink_sid, "_blank", "width=700,height=550,left=50,top=50,toolbar=no,status=no,resizable=yes,location=no,menubar=no");
    return false;
}
