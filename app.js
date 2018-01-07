(function(){

  'use strict'; //browser does complain about bad coding

  angular.module('PublicTransportTimer', [])
  .controller('ReportsController', ReportsController)
  .service('ReportTimeService', ReportTimeService);

  ReportsController.$inject = ['ReportTimeService'];
  function ReportsController(ReportTimeService){
    var reportList = this;

    reportList.fileName = '';

    reportList.addToList = function(type){
      //console.log(type + " clicked add to List");
      ReportTimeService.addReportItem(type);
    };

    reportList.items = ReportTimeService.getReportItems();

    reportList.getCSV = function(fileName){
      //console.log(fileName + " fileName parameter");

      ReportTimeService.downloadCSV({filename: fileName});
    };

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

    service.downloadCSV = function(args) {
      var data, filename, link;

      var csv = convertArrayOfObjectsToCSV({
          data: reportItems
      });

      //console.log(csv + " is generated");

      if (csv == null) return;

      filename = args.filename || 'export.csv';

      if (!csv.match(/^data:text\/csv/i)) {
          csv = 'data:text/csv;charset=utf-8,' + csv;
      }
      data = encodeURI(csv);

      link = document.createElement('a');
      link.setAttribute('href', data);
      link.setAttribute('download', filename);
      link.click();
    };

    //service.getBoughtItems = function(){
    //  return boughtItems;
    //};
  }

  function convertArrayOfObjectsToCSV(args) {
    var result, ctr, keys, columnDelimiter, lineDelimiter, data;
    data = args.data || null;
    if (data == null || !data.length) {return null;}

    columnDelimiter = args.columnDelimiter || ',';
    lineDelimiter = args.lineDelimiter || '\n';

    keys = Object.keys(data[0]);

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;
    data.forEach(function(item) {
      ctr = 0;
      keys.forEach(function(key) {
        if (ctr > 0) result += columnDelimiter;

        result += item[key];
        ctr++;
      });

      result += lineDelimiter;
    });
    return result;
  }

})();
