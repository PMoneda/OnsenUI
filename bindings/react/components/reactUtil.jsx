var ReactTestUtils = React.addons.TestUtils;
var reactUtil = {};

reactUtil.rendersToOnsPage =  function(obj) {
   var htmlString = ReactDOMServer.renderToStaticMarkup(obj);
   return htmlString.startsWith('<ons-page');
};

reactUtil.rendersTo =  function(obj, str) {
   var htmlString = ReactDOMServer.renderToStaticMarkup(obj);
   return htmlString.startsWith(str);
}

reactUtil.rendersToOnsToolbar = function(obj) {
  var htmlString = ReactDOMServer.renderToStaticMarkup(obj);
  return htmlString.startsWith('<ons-toolbar');
};

reactUtil.rendersToOnsModal = function(obj) {
  var htmlString = ReactDOMServer.renderToStaticMarkup(obj);
  return htmlString.startsWith('<ons-modal');
};



reactUtil.lastChild = function(el) {
  return el.children[el.children.length - 1];
};

reactUtil.createCustomDialog = function(component) {
  var body = document.body;
  var container = document.createElement('div');
  body.appendChild(container);

  return new Promise(function(resolve) {
    ReactDOM.render(component, container, function() {
      resolve(container.firstChild);
    });
  });
};

reactUtil.templateMap = {};
