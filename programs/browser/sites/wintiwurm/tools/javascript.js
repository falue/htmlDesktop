document.createElement("header");
document.createElement("nav");
document.createElement("section");
document.createElement("article");
document.createElement("footer");

function hide(id) {
  for (i = 0; i < arguments.length; i++) {
    document.getElementById(arguments[i]).style.display = "none";
  }
}

function show(id) {
  for (i = 0; i < arguments.length; i++) {
    document.getElementById(arguments[i]).style.display = "block";
  }
}

function goToAnchor(anchor) {
  var loc = document.location.toString().split("#")[0];
  document.location = loc + "#" + anchor;
  return false;
}

function selectProduct(selectId, optionId) {
  let select = document.getElementById(selectId);
  select.value = optionId;
  updateCost(select);
}

function updateCost(select) {
  let cost = select.options[select.selectedIndex].getAttribute("data-cost");
  let shipping = select.options[select.selectedIndex].getAttribute("data-shipping");
  cost = parseInt(cost) + parseFloat(shipping);
  document.getElementById("cost").innerHTML = cost.toFixed(2);
  document.getElementById("shipping").innerHTML = parseFloat(shipping).toFixed(2);
}

function closeMenu() {
  let checkbox = document.getElementById("checkbox_toggle");
  checkbox.checked = false;
}
