/** @jsx React.DOM */
var tierData = require('../../etc/price_matrix')
  , regionData = require('../../etc/regions')
  , tierTemplate = require('../../views/shared/price_matrix.ejs')
  , regionTemplate = require('../../views/shared/regions.ejs')
  , Modal = require('./components/modal')(React)

module.exports = function(product, cb) {
  var tiers = { __html: tierTemplate({ priceMatrix: tierData }) }
  var regions = { __html: regionTemplate({ regions: regionData }) }
  var size = null;
  var region = null;
  var modal = null;
  var body = <div>
    <h2>Choose a server size</h2>
    <div dangerouslySetInnerHTML={tiers} />
    <h2>Choose a region</h2>
    <div dangerouslySetInnerHTML={regions} />
  </div>
  cancel = function() {
    size = null;
    region = null;
    modal.hide();
  }
  modal = createModal(<Modal 
    className='serverSelectModal'
    title="Server Selection"
    body={body}
    onShown={function($el) {
      var submit = $el.find('button[type=submit]')
      var updateButton = function() {
        if (size && region) submit.removeAttr('disabled').click(modal.hide)
      }
      var sizeChoices = $el.find('[data-size]')
      var regionChoices = $el.find('[data-region]')

      sizeChoices.each(function() {
        var memory = parseInt($(this).data('memory'))
        if (product.minMemory && memory < product.minMemory) {
          $(this).addClass('insufficient').tooltip({
            title: "The application's minimum memory requirements exceed this flavor."
          })
        } else {
          $(this).addClass('choice')
        }
      }).click(function() {
        sizeChoices.removeClass('selected')
        if ($(this).hasClass('insufficient')) return;
        $(this).addClass('selected')
        size = $(this).data('size')
        updateButton()
      })

      regionChoices.each(function() {
        $(this).addClass('choice')
      }).click(function() {
        regionChoices.removeClass('selected')
        $(this).addClass('selected')
        region = $(this).data('region')
        updateButton()
      }).first().click()
    }}
    footer={
      <div>
        <button type="submit" disabled className="btn btn-primary">Continue</button>
        <button type="button" onClick={cancel} className="pull-left btn btn-default">Cancel</button>
      </div>
    }
    onHidden={function() {
      if (size && region) {
        cb(null, size, region)
      } else {
        cb(new Error('No selection'))
      }
    }}
  />)
  modal.show();
}
