/** @jsx React.DOM */
var products = require('../../products')
  , className = 'appSelect'
  , ChooseServerSizeAndRegion = require('./choose_server_size_and_region')
  , InputInstanceConfig = require('./input_instance_config')
  , modal = null
  , handler = null;

module.exports = function (React) {
  var App = require('./components/app')(React)
  var Modal = require('./components/modal')(React)
  return function(_handler) {
    handler = _handler;
    return function (opts) {
      var apps = []
      Object.keys(products).forEach(function(slug) {
        apps.push(<App
          key={slug} slug={slug}
          onClick={selectProduct(slug)}
        />)
      })
      modal = createModal(<Modal 
        title="Choose an App"
        className={className}
        body={apps}
        onShown={shown(opts)}
      />)
      modal.show()
      analytics.track('Opened New Instance Wizard')
    }
  }
}

var shown = function (opts) {
  return function() {
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
      analytics.track('Selected Size and Region', {
        slug: slug,
        size: size,
        region: region
      })
    })
    analytics.track('Selected a Product', { slug: slug })
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
