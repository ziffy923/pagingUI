define(["require", "exports", "knockout", "ojs/ojbootstrap", "dataProvider/DemoArrayDataGridProvider",
  "text!../resources/customers.json", "ojs/ojconverter-datetime",
  "ojs/ojconverter-number", "ojs/ojdatagrid", "ojs/ojknockout", "ojs/ojgauge"],
  function (require, exports, ko, ojbootstrap_1, DemoArrayDataGridProvider_1, jsonData, ojconverter_datetime_1, ojconverter_number_1) {
    class IncidentsViewModel {
      constructor() {
        this.jsonData = JSON.parse(jsonData);
        this.jsonData = this.jsonData.slice(0,200);

        //column trimming
        this.allowedColumns = ['firstName', 'lastName', 'balance', 'address'];
        this.rowHeaders = [
          this.jsonData.map((item) => {
            return item.index;
          })
        ];
        this.columnHeaders = [
          Object.keys(this.jsonData[0]).filter((key) => {
            return this.allowedColumns.indexOf(key) != -1;
          })
        ];
        this.data = this.jsonData.map((item) => {
          return this.columnHeaders[0].map((header) => {
            return { data: item[header] };
          });
        });
        this.dataGridProvider = new DemoArrayDataGridProvider_1.DemoArrayDataGridProvider({
          data: this.data,
          rowHeader: this.rowHeaders,
          columnHeader: this.columnHeaders
        }, {}, {});
        
        this.thresholdValues = [{ max: 20000 }, { max: 30000 }, {}];
        this.dateConverter = new ojconverter_datetime_1.IntlDateTimeConverter({
          formatType: 'date',
          dateFormat: 'medium'
        });
        this.numberConverter = new ojconverter_number_1.IntlNumberConverter({
          style: 'currency',
          currency: 'USD',
          currencyDisplay: 'symbol'
        });
        this.formatColumnHeader = (headerContext) => {
          const data = headerContext.item.data;
          return data.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) {
            return str.toUpperCase();
          });
        };
        this.getColumnHeaderStyle = (headerContext) => {
          return "width:200px";
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
        this.getdata = (context) => {
          console.log(context);
        };
        this.getColumnHeaderClassName = (headerContext) => {
          return this.getAlignmentClassNameByIndex(headerContext.index);
        };
        this.getCellClassName = (cellContext) => {
          return this.getAlignmentClassNameByIndex(cellContext.indexes.column);
        };
        this.getAlignmentClassNameByIndex = (index) => {
          if (this.numericIndexes.includes(index) || index === 15) {
            return 'oj-helper-justify-content-right oj-helper-text-align-right';
          }
          return 'oj-sm-justify-content-flex-start oj-sm-text-align-start';
        };
        let firstRowValues = Object.values(this.data[0]);
        this.numericIndexes = firstRowValues.reduce((numeric, data, index) => {
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
