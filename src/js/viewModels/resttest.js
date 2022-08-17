define(["require", "exports", "knockout", "ojs/ojbootstrap", "dataProvider/RestArrayDataGridProvider", "ojs/ojconverter-datetime",
  "ojs/ojconverter-number", "ojs/ojdatagrid", "ojs/ojknockout", "ojs/ojgauge"],
  function (require, exports, ko, ojbootstrap_1, RestArrayDataGridProvider_1, ojconverter_datetime_1, ojconverter_number_1) {
    class RESTTest {
      constructor() {
        this.URLCallback = (columnOffset, rowOffset, pageNumber, filters, baseURL) => {
          return {
            url: baseURL + "/page/" + pageNumber,
            updatedQueryParams: {
              pageNumber: pageNumber +1
            }
          };       
        };
        this.dataGridProvider = new RestArrayDataGridProvider_1.RestArrayDataGridProvider({
          data: {},
          rowHeader: {},
          columnHeader: {},
          baseURL: 'http://localhost:8080',
          URLCallback: this.URLCallback
        }, {}, {});
        
        this.getColumnHeaderStyle = (headerContext) => {
          return "width:200px";
        };
      }
    }
    return RESTTest;
  }
);
