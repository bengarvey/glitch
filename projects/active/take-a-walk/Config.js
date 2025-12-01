function Config(config) {
  this.config = config;
  var location = document.getElementsByTagName(this.config.ui.location)[0];

  function getUI() {
    var ui = "<div class='ui closed'>";
    ui += "<form class='ui' id='ui' onmouseleave='hideUI(event);'>";
    var keys = Object.keys(this.config);
    for(var i=0; i<keys.length; i++) {
      var area = "<div class='section'>";
      area += "<h4>" + keys[i] + "</h4>";
      area += getSubForm(this.config[keys[i]], keys[i]);
      area += "</div>";
      ui += area;
    }   
    ui += getSaveUI();
    ui += "</form></div>";
    ui += getToggleUI();
    return ui; 
  }

  function getToggleUI() {
    return '<button class="toggle btn-mini" onclick="return false;" onmouseover="showUI();">Config</button>';
  }

  function getSaveUI() {
    return '<button class="btn-save" onclick="return saveConfig();">Save</button>';
  }

  function getSubForm(ob, parent) {
    var ui = ""; 
    var keys = Object.keys(ob);
    for(var i=0; i<keys.length; i++) {
      var id = parent + "-" + keys[i];
      ui += '<label for="' + id + '">' + keys[i] + "</label>";
      ui += '<input id="' + id + '" type="text" value="' + ob[keys[i]] + '"></input>';
    }   
    return ui; 
  }
}