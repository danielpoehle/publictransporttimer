(function(){

  'use strict'; //browser does complain about bad coding

  angular.module('PublicTransportTimer', [])
  .controller('ReportsController', ReportsController)
  .service('ReportTimeService', ReportTimeService);

  ReportsController.$inject = ['ReportTimeService'];
  function ReportsController(ReportTimeService){
    var reportList = this;

    reportList.addToList = function(type){
      //console.log(type + " clicked add to List");
      ReportTimeService.addReportItem(type);
    };

    reportList.items = ReportTimeService.getReportItems();

  }



  function ReportTimeService(){
    var service = this;
    var reportItems = [];

    service.addReportItem = function(type){
      //console.log(reportItems.length + " length of items before");
      var relativeTime = 0;
      var time = new Date();
      if(reportItems.length > 0){
        // in seconds
        relativeTime = Math.floor(time/1000) - Math.floor(reportItems[reportItems.length - 1].time / 1000);
      }
      //console.log(relativeTime + " relativeTime");
      //console.log(time + " time");
      var id = reportItems.length + 1;

      reportItems.push({id: id, type: type, time: time, relativeTime: relativeTime});
      //console.log(reportItems.length + " length of items after");
      //console.log(reportItems);

    };

    service.getReportItems = function(){
      //console.log(reportItems);
      return reportItems;
    };

    //service.getBoughtItems = function(){
    //  return boughtItems;
    //};
  }

})();
