var mdns = require('mdns'),
    serviceType = mdns.makeServiceType({
      name: 'radiodan-http', protocol: 'tcp', subtypes: ['radiodanv1']
    });

module.exports.advertise = function(radiodan, port) {
  var utils  = radiodan.utils,
      logger = utils.logger(__filename),
      txtRecord,
      mdnsAd;

  radiodan.create().player.discover().then(function(players) {
    txtRecord = {
      players: JSON.stringify(players)
    };

    mdnsAd = mdns.createAdvertisement(
      serviceType.toString(), port, {txtRecord: txtRecord}
    );

    mdnsAd.start();
  }).then(null, utils.failedPromiseHandler(logger));
};
