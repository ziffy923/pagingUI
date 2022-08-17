define(["require", "jquery", "exports", "knockout", "ojs/ojbootstrap", "dataProvider/DemoArrayDataGridProvider",
  "text!../resources/customers.json", "ojs/ojconverter-datetime",
  "ojs/ojconverter-number", "ojs/ojdatagrid", "ojs/ojknockout", "ojs/ojgauge"],
  function (require, $, exports, ko, ojbootstrap_1, DemoArrayDataGridProvider_1, jsonData, ojconverter_datetime_1, ojconverter_number_1,
            ArrayDataprovider) {
    class IncidentsViewModel {
      constructor() {
        var self = this;

        self.newjsondata = null;
        self.jsonData = null;

        $.ajax({
          url: 'http://localhost:8080/page/1',
          method: "GET",
          async: false,
          success: function(data){
            self.jsonData = data.items;
          },
          failure: function (jqXHR) {
            console.log(jqXHR);
          }
        });

        // self.jsonData = JSON.parse(jsonData);
        self.rowHeaders = [
          self.jsonData.map((item) => {
            return item.index;
          })
        ];
        self.columnHeaders = [
          Object.keys(self.jsonData[0]).filter((key) => {
            return key !== 'index';
          })
        ];
        self.data = self.jsonData.map((item) => {
          return self.columnHeaders[0].map((header) => {
            return { data: item[header] };
          });
        });
        self.dataGridProvider = new DemoArrayDataGridProvider_1.DemoArrayDataGridProvider({
          data: self.data,
          rowHeader: self.rowHeaders,
          columnHeader: self.columnHeaders
        }, {}, {});


        self.handleScroll = function(event, context, arg3, arg4){
          console.log(event, context, arg3, arg4);
        };
        self.orderAmountIndex = self.columnHeaders[0].indexOf('totalAmountOrdered');
        self.maxAmountOrdered = self.data.reduce((previousValue, currentValue) => {
          let amountOrdered = currentValue[self.orderAmountIndex].data;
          if (amountOrdered > previousValue) {
            return amountOrdered;
          }
          return previousValue;
        }, -Infinity);
        self.minAmountOrdered = self.data.reduce((previousValue, currentValue) => {
          let amountOrdered = currentValue[self.orderAmountIndex].data;
          if (amountOrdered < previousValue) {
            return amountOrdered;
          }
          return previousValue;
        }, Infinity);
        self.thresholdValues = [{ max: 20000 }, { max: 30000 }, {}];
        self.dateConverter = new ojconverter_datetime_1.IntlDateTimeConverter({
          formatType: 'date',
          dateFormat: 'medium'
        });
        self.numberConverter = new ojconverter_number_1.IntlNumberConverter({
          style: 'currency',
          currency: 'USD',
          currencyDisplay: 'symbol'
        });
        self.formatColumnHeader = (headerContext) => {
          const data = headerContext.item.data;
          return data.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) {
            return str.toUpperCase();
          });
        };
        self.getColumnHeaderStyle = (headerContext) => {
          const columnIndex = headerContext.index;
          if (columnIndex === 8) {
            return 'width:175px';
          }
          else if (columnIndex === 3 || columnIndex === 5 || columnIndex === 16) {
            return 'width:150px';
          }
          else if (columnIndex === 4) {
            return 'width:185px;';
          }
          else if (columnIndex === 9 || columnIndex === 11 || columnIndex === 13) {
            return 'width:250px;';
          }
          return 'width:125px;';
        };
        self.getColumnHeaderClassName = (headerContext) => {
          return self.getAlignmentClassNameByIndex(headerContext.index);
        };
        self.getCellClassName = (cellContext) => {
          return self.getAlignmentClassNameByIndex(cellContext.indexes.column);
        };
        self.getAlignmentClassNameByIndex = (index) => {
          if (self.numericIndexes.includes(index) || index === 15) {
            return 'oj-helper-justify-content-right oj-helper-text-align-right';
          }
          return 'oj-sm-justify-content-flex-start oj-sm-text-align-start';
        };
        let firstRowValues = Object.values(self.data[0]);
        self.numericIndexes = firstRowValues.reduce((numeric, data, index) => {
          if (!isNaN(data.data) || !isNaN(Date.parse(data.data))) {
            numeric.push(index);
          }
          return numeric;
        }, []);
      }
    }
    return IncidentsViewModel;
  }
);
