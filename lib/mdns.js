var serviceName = 'radiodan-http';

if(process.platform === 'linux') {
  var avahi = require('avahi_pub');

  module.exports.advertise = function(radiodan, port) {
    radiodan.create().player.discover().then(function(players) {
      var txtRecord = { players: JSON.stringify(players) },
          service = {
            name: serviceName, type: '_radiodan-http._tcp',
            port: port, data: txtRecord
          };

      avahi.publish(service);
    });
  };
} else {
  var mdns = require('mdns'),
    serviceType = mdns.makeServiceType({
      name: serviceName, protocol: 'tcp', subtypes: ['radiodanv1']
    });

  console.log('serviceType', process.platform, serviceType.toString());

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
}
