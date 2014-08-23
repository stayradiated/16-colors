var _ = require('lodash');
var Reflux = require('reflux');
var ReactWM = require('reactwm');

var actions = require('../actions');
var LocalStore = require('../utils/local');

var Editor = require('../components/editor.react');
var Import = require('../components/import.react');
var Export = require('../components/export.react');
var Template = require('../components/template.react');
var SchemeBrowser = require('../components/schemeBrowser.react');
var TemplateBrowser = require('../components/templateBrowser.react');

var STORAGE_ID = 'window::store';

var windows = {

  editor: function (id) {
    return {
      component: new Editor({ key: id }),
      title: 'Editor',
      width: 460,
      height: 700
    };
  },

  import: function (id) {
    return {
      component: new Import({ key: id }),
      title: 'Import',
      width: 330,
      height: 330,
      x: 500
    };
  },

  export: function (id) {
    return {
      component: new Export({ key: id }),
      title: 'Export',
      width: 330,
      height: 330,
      x: 500,
      y: 370
    };
  },

  schemes: function (id) {
    return {
      component: new SchemeBrowser({ key: id }),
      title: 'Scheme Browser',
      width: 330,
      height: 330,
      x: 850
    };
  },

  templates: function (id) {
    return {
      component: new TemplateBrowser({ key: id }),
      title: 'Template Browser',
      width: 500,
      height: 200,
      x: 850,
      y: 370
    };
  },

  template: function (id) {
    return {
      component: new Template({ key: id }),
      id: 'template-' + id,
      title: 'Template: ' + id,
      width: 730,
      height: 580
    };
  }

};

var getWindow = function (id) {
  var _id = id.split('::');
  id = _id.splice(0, 1)[0];
  data = _id.join('::');

  return windows[id](data);
};


var manager = (function () {
  var localData = LocalStore.load(STORAGE_ID);
  var manager = new ReactWM.Manager(localData);

  manager.openWindows().forEach(function (window) {
    var info = getWindow(window.id);
    window.setComponent(info.component);
  });

  var _saveLayout = _.throttle(function () {
    LocalStore.save(STORAGE_ID, manager.toJSON());
  }, 500);

  manager.on('change', _saveLayout);
  manager.on('change:windows', _saveLayout);

  return manager;
}());


var WindowStore = Reflux.createStore({

  init: function () {
    this.listenTo(actions.openWindow, this.open);
  },

  getManager: function () {
    return manager;
  },

  open: function (id) {
    console.log('opening window', id);
    var window = getWindow(id);
    console.log(window);
    var el = window.component;
    manager.open(id, el, window);
  }

});

module.exports = WindowStore;