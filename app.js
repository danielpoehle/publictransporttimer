(function(){

  'use strict'; //browser does complain about bad coding

  //let stops = require("./lines/buslines.js");
  //import  getBusline  from "/lines/buslines";

  angular.module('PublicTransportTimer', [])
  .controller('ReportsController', ReportsController)
  .service('ReportTimeService', ReportTimeService);

  ReportsController.$inject = ['ReportTimeService'];
  function ReportsController(ReportTimeService){
    let reportList = this;

    reportList.fileName = '';
    reportList.comment = '';
    //reportList.lines = [33, 34];
    //reportList.direction = [1, 2];

    reportList.addToList = function(type){
      //console.log(type + " clicked add to List");
      ReportTimeService.addReportItem(type);
    };

    reportList.items = ReportTimeService.getReportItems();

    reportList.getCSV = function(fileName){
      //console.log(fileName + " fileName parameter");
      ReportTimeService.downloadCSV({filename: fileName});
    };

    reportList.addComment = function(itemID, comment){
      ReportTimeService.addComment(itemID, comment);
      reportList.comment = '';
    }

    reportList.removeItem = function(itemID){
      console.log(itemID + " item ID in reportList");

      ReportTimeService.remove(itemID);
    };

  }



  function ReportTimeService(){
    let service = this;
    let reportItems = [];

    service.addReportItem = function(type){
      //console.log(reportItems.length + " length of items before");
      let relativeTime = 0;
      let id = 1;
      let time = new Date();
      let comment = '';
      if(reportItems.length > 0){
        // in seconds
        relativeTime = Math.floor(time/1000) - Math.floor(reportItems[reportItems.length - 1].timestamp / 1000);
        id = reportItems[reportItems.length - 1].id + 1;
      }
      //console.log(relativeTime + " relativeTime");
      //console.log(time + " time");
      let date = time.toLocaleDateString();
      let timeclock = time.toLocaleTimeString();

      reportItems.push({id: id, type: type, timestamp: time, date: date, time: timeclock, relativeTime: relativeTime, comment: comment});
      //console.log(reportItems.length + " length of items after");
      //console.log(reportItems);

    };

    service.getReportItems = function(){
      //console.log(reportItems);
      return reportItems;
    };

    service.downloadCSV = function(args) {
      let data, filename, link;

      let csv = convertArrayOfObjectsToCSV({
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

    service.remove = function(id){
      let index = reportItems.findIndex(x => x.id== id);
      let item = reportItems[index];
      console.log(item);
      reportItems.splice(index, 1);
    };

    service.addComment = function(id, text){
      let index = reportItems.findIndex(x => x.id== id);
      reportItems[index].comment = text;
    };

    //service.getBoughtItems = function(){
    //  return boughtItems;
    //};
  }

  function convertArrayOfObjectsToCSV(args) {
    let result, ctr, keys, columnDelimiter, lineDelimiter, data;
    data = args.data || null;
    if (data == null || !data.length) {return null;}

    columnDelimiter = args.columnDelimiter || ';';
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
