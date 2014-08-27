var os = require('os'),
    hostname = os.hostname().split('.local')[0],
    serviceName = 'radiodan-http';

if(process.platform === 'linux') {
  var avahi = require('avahi_pub');

  module.exports.advertise = function(radiodan, port) {
    radiodan.create().player.discover().then(function(players) {
      var txtRecord = 'players=' + JSON.stringify(players),
          service = {
            name: hostname, type: '_'+serviceName+'._tcp',
            port: port, data: txtRecord
          };

      avahi.publish(service);
    });
  };
} else {
  var mdns = require('mdns'),
    serviceType = mdns.makeServiceType({
      name: serviceName, protocol: 'tcp'
    });

  module.exports.advertise = function(radiodan, port) {
    var utils  = radiodan.utils,
        logger = utils.logger(__filename),
        txtRecord,
        mdnsAd,
        player;

    player = radiodan.create().player;

    player.discover().then(function(players) {
      console.log(players);
      txtRecord = {
        players: JSON.stringify(players)
      };

      mdnsAd = mdns.createAdvertisement(
        serviceType.toString(), port, {txtRecord: txtRecord}
        );

      console.log('serviceType', mdnsAd, serviceType.toString());

      mdnsAd.start();
    }).then(null, utils.failedPromiseHandler(logger));
  };
}
