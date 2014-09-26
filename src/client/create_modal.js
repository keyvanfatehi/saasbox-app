module.exports = function (React, window) {
  return function(reactComponent) {
    var div = $('<div></div>')
    $(window.document.body).append(div);
    return React.renderComponent(reactComponent, div.get(0))
  }
}
