/** @jsx React.DOM */
var products = require('../../products')
  , appsTemplate = require('../../views/shared/apps.ejs')
  , appsHTML = appsTemplate({ products: products })
  , className = 'appSelect'
  , ChooseServerSizeAndRegion = require('./choose_server_size_and_region')
  , InputInstanceConfig = require('./input_instance_config')
  , modal = null
  , handler = null;

module.exports = function (React) {
  var Modal = require('./components/modal')(React);
  return function(_handler) {
    handler = _handler;
    return function (opts) {
      modal = createModal(<Modal 
        title="Choose an App"
        className={className}
        body={<div dangerouslySetInnerHTML={{ __html: appsHTML }} />}
        onShown={shown(opts)}
      />)
      modal.show()
    }
  }
}

var shown = function (opts) {
  return function() {
    $('.'+className+' .app[data-slug]').each(function(i, el) {
      var slug = $(el).data('slug');
      $(el).click(selectProduct(slug))
    });

    if (opts.slug) {
      selectProduct(opts.slug)()
    }
  }
}

var selectProduct = function(slug) {
  var product = products[slug];
  return function() {
    modal.hide();
    ChooseServerSizeAndRegion(product, function (err, size, region) {
      if (err) return;
      if (product.configSchema) {
        InputInstanceConfig(product, { config: {} }, function(err, config) {
          if (err) return;
          else commit(slug, size, region, config, handler)
        })
      } else {
        commit(slug, size, region, null, handler)
      }
    })
  }
}

var commit = function (slug, size, region, config, success) {
  $.ajax({
    type: 'POST', 
    url: '/api/v1/instances',
    data: JSON.stringify({
      slug: slug,
      size: size,
      region: region,
      config: config,
      cloud: 'DigitalOcean'
    }),
    contentType: 'application/json',
    dataType: 'json',
    success: success,
    error: function(err) {
      window.errorModal(err, {
        xhr: true,
        title: "Instance Creation Error"
      })
    }
  })
}
