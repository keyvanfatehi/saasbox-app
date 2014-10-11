/** @jsx React.DOM */
var Modal = require('./components/modal')(React)
  , App = require('./components/app')(React)

module.exports = function(product, instance, cb) {
  var modal = null;
  var fields = [];
  var config = {};
  for (key in instance.config) {
    config[key] = instance.config[key]
  }
  var valueChanged = function(e, a) {
    var key = $(e.target).data('key')
    config[key] = e.target.value
  }

  for (key in product.configSchema) {
    var field = product.configSchema[key]
    fields.push(
      <div className="form-group" key={key}>
        <label htmlFor={key} className="control-label col-sm-4">{field.label}</label>
        <div className="col-sm-8">
          <input className="form-control" data-key={key}
            type={field.type || 'text'}
            onChange={valueChanged}
            placeholder={field.placeholder||''}
            defaultValue={instance.config[key]} />
        </div>
      </div>
    )
  }

  var body = <div>
    <h2>Application</h2>
    <App slug={product.slug} />
    <h2>Configuration</h2>
    <form className="form-horizontal" role="form">
      {fields}
    </form>
  </div>
  var cancel = function() {
    config = null;
    modal.hide();
  }
  var madeChanges = false;
  var commit = function() {
    instance.config = config;
    madeChanges = true;
    modal.hide()
  }
  modal = createModal(<Modal 
    className='instanceConfigModal'
    title="Configure"
    body={body}
    footer={
      <div>
        <button type="submit" onClick={commit} className="btn btn-primary">Continue</button>
        <button type="button" onClick={cancel} className="pull-left btn btn-default">Cancel</button>
      </div>
    }
    onHidden={function() {
      if (config) {
        if (madeChanges)
          cb(null, config)
      } else {
        cb(new Error('Invalid configuration'))
      }
    }}
  />)
  modal.show();
}
