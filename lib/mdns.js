var mdns = require('mdns'),
    serviceType = mdns.makeServiceType({
      name: 'radiodan-http', protocol: 'tcp', subtypes: ['radiodanv1']
    }),
    txtRecord = {radiodan: true, video: false, audio: true, stream: true};

module.exports.advertise = function(radiodan, port) {
  var utils  = radiodan.utils,
      logger = utils.logger(__filename),
      mdnsAd;

  radiodan.create().player.discover().then(function(players) {
    txtRecord.players = JSON.stringify(players);

    mdnsAd = mdns.createAdvertisement(
      serviceType.toString(), port, {txtRecord: txtRecord}
    );

    mdnsAd.start();
  }).then(null, utils.failedPromiseHandler(logger));
};
