  require(["require", "exports", "ojs/ojbootstrap", "knockout", "ojs/ojconverter-number", "ojs/ojarraydataprovider", "ojs/ojknockouttemplateutils", "text!../cookbook/dataCollections/table/customTable/employeeData.json", "ojs/ojcollectiondataprovider","ojs/ojknockout", "ojs/ojtable", "ojs/ojgauge", "ojs/ojinputtext", "ojs/ojavatar", "ojs/ojmodel"], function (require, exports, ojbootstrap_1, ko, ojconverter_number_1, ArrayDataProvider, KnockoutTemplateUtils, empData, CollectionDataProvider) {
      "use strict";
      
      class ViewModel {
          constructor() {
              this.empArray = JSON.parse(empData);
            
            
            this.parse = function(data)
            {
                      this.DepartmentId = data.DepartmentId;
                      this.DepartmentName = data.DepartmentName;
                      this.EmployeeCount = data.EmployeeCount;
            };
            this.modelurl =  "http://127.0.0.1:8887/data.json";
            this.modelproto = oj.Model.extend({
              urlRoot: this.modelurl,
              parse: this.parse,
              parseSave: this.parse,
              idAttribute: 'DepartmentId'              
            });            
            
            this.modelobj = new this.modelproto();
            
            this.collectionproto = oj.Collection.extend({
              url: this.empData,
              model: this.modelobj,
              comparator: 'DepartmentId'
            });
            
            
            this.deptObservable = ko.observable();
            this.deptObservable(new this.collectionproto())                  
            
            
            this.deptDatasource = new CollectionDataProvider(this.deptObservable());
            
            
            

            
            
              this.dataprovider = new ArrayDataProvider(this.empArray, {
                  keyAttributes: 'EmployeeId'
              });
              this.thresholdValues = [{ max: 33 }, { max: 67 }, {}];
            this.KnockoutTemplateUtils = KnockoutTemplateUtils;
              this.revenue_total_func = () => {
                  const dataprovider = this.dataprovider;
                  if (!dataprovider) {
                      return;
                  }
                  let total = 0;
                  dataprovider.getTotalSize().then((totalRowCount) => {
                      const addRevenue = (rowNum) => {
                          dataprovider
                              .fetchByOffset({ offset: rowNum })
                              .then((value) => {
                              let row = value.results[0];
                              total += row.data.Revenue;
                              if (rowNum < totalRowCount - 1) {
                                  addRevenue(rowNum + 1);
                              }
                              else {
                                  let parentElement = document.getElementById('table:revenue_total');
                                  parentElement.setAttribute('value', total.toString());
                              }
                          });
                      };
                      addRevenue(0);
                  });
                  return total;
              };
              this.revenueConverter = new ojconverter_number_1.IntlNumberConverter({
                  style: 'currency',
                  currency: 'USD',
                  currencyDisplay: 'symbol'
              });
              this.columnArray = [
                  {
                      renderer: KnockoutTemplateUtils.getRenderer('emp_photo', true),
                      footerRenderer: KnockoutTemplateUtils.getRenderer('revenue_total_label', true),
                      sortable: 'disabled',
                      id: 'photo'
                  },
                  {
                      headerText: 'Employee Name',
                      sortable: 'enabled',
                      renderer: KnockoutTemplateUtils.getRenderer('emp_name', true),
                      sortProperty: 'FirstName',
                      id: 'name'
                  },
                  {
                      headerText: 'Sales Revenue',
                      renderer: KnockoutTemplateUtils.getRenderer('revenue', true),
                      footerRenderer: KnockoutTemplateUtils.getRenderer('revenue_total', true),
                      sortProperty: 'Revenue',
                      id: 'revenue'
                  },
                  {
                      headerText: 'Rating',
                      field: 'Rating',
                      renderer: KnockoutTemplateUtils.getRenderer('rating', true),
                      id: 'rating'
                  },
                  {
                      headerText: 'Sales Target Achievement',
                      field: 'TargetAchievement',
                      sortable: 'disabled',
                      renderer: KnockoutTemplateUtils.getRenderer('target', true),
                      id: 'target'
                  }
              ];
          }
      }
      ojbootstrap_1.whenDocumentReady().then(() => {
          ko.applyBindings(new ViewModel(), document.getElementById('table'));
      });
  });