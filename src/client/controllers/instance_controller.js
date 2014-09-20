/** @jsx React.DOM */
var InstanceControl = require('../components/instance_control')(React)
  , products = require('../../../products')
  , centsAsDollars = require('../cents_as_dollars')
  , tierData = require('../../../etc/price_matrix')
  , tierTemplate = require('../../../views/shared/price_matrix.ejs')
  , Modal = require('../components/modal')(React)

function Instance(slug, account) {
  var UI = null
    , product = products[slug]
    , defaultCharge = 100

  var resourcePath = this.resourcePath = '/api/v1/instance/'+slug;

  this.mountInterface = function(el) {
    var $el = $(el).get(0);
    var jsx = <InstanceControl slug={slug} product={product} controller={this} />
    UI = React.renderComponent(jsx, $el);
  }

  var fetch = this.fetch = function(cb) {
    $.getJSON(resourcePath, cb)
  }

  this.put = function(data, onsuccess, onerror) {
    $.ajax({
      type: 'PUT', 
      url: this.resourcePath,
      data: JSON.stringify(data),
      contentType: 'application/json',
      dataType: 'json',
      success: onsuccess,
      error: function(err) {
        var body = null;
        if (err.status === 403) {
          var problems = JSON.parse(err.responseText).problems;
          body = JSON.stringify(problems, null, 4)
        } else {
          body = err.status+' '+err.statusText
        }
        createModal(<Modal title="Error" body={<pre>{body}</pre>} />).show();
        fetch(function(data) {
          UI.setState({ status: data.status });
        })
      }
    })
  }

  this.chooseServerSize = function(cb) {
    var raw = { __html: tierTemplate({ priceMatrix: tierData }) }
    var slug = null;
    var body = <div>
      Choose a server size
      <div dangerouslySetInnerHTML={raw} />
    </div>
    var modal = createModal(<Modal 
      className='serverSelectModal'
      title="Server Selection"
      body={body}
      onShown={function($el) {
        $el.find('tbody tr').click(function() {
          slug = $(this).data('slug')
          modal.hide();
        })
      }}
      onHidden={function() {
        if (slug) {
          cb(null, tierData[slug])
        } else {
          cb(new Error('Please select a server size -- you can upgrade or downgrade later'))
        }
      }}
    />)
    modal.show();
  }
}

module.exports = Instance;
