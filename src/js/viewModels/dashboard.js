
define(['../accUtils', 'ojs/ojcore', 'knockout', "ojs/ojcollectiondataprovider", 'ojs/ojknockouttemplateutils',
        'ojs/ojarraydataprovider', 'ojs/ojmodel', 'ojs/ojbutton', 'ojs/ojtable', "ojs/ojknockout", "require", "exports", "ojs/ojbootstrap",
        ],
  function (accUtils, oj, ko, CollectionDataProvider, KnockoutTemplateUtils, ArrayDataProvider, Model) {
    function DashboardViewModel(params) {
      var self = this;
      self.KnockoutTemplateUtils = KnockoutTemplateUtils;

      self.buttonValue = ko.observable("off");

      self.parsedata = function(data){
        var self = this;
        self.DepartmentId = data.id;
        self.DepartmentName = data.first_name;
        self.EmployeeCount = data.last_name;
        self.email = data.email;
        return self;
      }

      self.parseEmployee = function(data){
        if(data.items){
          data = data.items;
        }
        return {
          id:data.EmployeeId,
          name: data.FirstName + ' ' + data.LastName,
          Revenue: data.Revenue,
          Status: data.Status,
          Salary: data.Salary
        };
      };

      self.parseNewEmployee = (data) => {
        return {
          FIRST_NAME: data.firstName,
          LAST_NAME: data.lastName,
          ID: data.employeeId,
          DEPARTMENT_ID: data.departmentId
        };
      }

      self.createworkflow = function(){

        var crtPromise = new Promise((resolve, reject) => {
          self.deptCollection.create({
            id: 9,
            last_name: 'Parida',
            first_name: 'Ayusman'          
          },
          {
            wait: true,
            doNotEncodeURI: true,
            success: function(response){
              console.log('creation success');
              resolve();
            },
            error: function(error){
              console.log("creation failed");
              reject();
            }
          });
        });

        crtPromise.then(function(){
          console.log("promise resolved gracefully");
        }).catch(function(){
          console.log("promsei failed tp resolved");
        });

        
      };

      self.parseDept = function(response) {
        if (response.items) { 
          response = response.items
        }
        return {
          empno: response.empno,
          ename: response.ename,
          job: response.job,
          hiredate: response.hiredate,
          sal: response.sal,
          DepartmentId: response.DepartmentId,
          DepartmentName: response.DepartmentName,
          EmployeeCount: response.EmployeeCount,
          ManagerId: response.ManagerId,
          id: response.id,
          first_name: response.first_name,
          last_name: response.last_name
        };
      };

      self.modelUrl = "http://localhost:8080/model";
      self.getModelURL = () => {
        return "http://localhost:8080/page/" + self.pageNumber();
      }
      self.deptModel = Model.Model.extend({
        urlRoot: self.modelUrl,
        parse: self.parseNewEmployee,
        parseSave: self.parseNewEmployee,
        idAttribute: 'ID'
      });
      self.newDeptModel = new self.deptModel();

      self.recordsSaved = ko.observable(0);
      self.pageNumber = ko.observable(0);
      self.customPagingOptionsProvider = (response) => {
        if(!(response.items)) return null;
        var customPagingOptions = {};
        customPagingOptions.hasMore = response.hasMore;
        customPagingOptions.limit = response.items.length;
        customPagingOptions.count = response.items.length;
        customPagingOptions.offset = self.recordsSaved();
        self.recordsSaved(self.recordsSaved() + response.items.length);
        self.pageNumber(self.pageNumber() + 1);
        document.querySelector("#ojPagingTable").refresh();
        return customPagingOptions;
      }

      self.parseCollection = (response) => {
        return response.items;
      }

      self.deptCollection = new Model.Collection(null, {
        url: self.getModelURL,
        model: self.newDeptModel,
        comparator: "ID",
        fetchSize: 50,
        parse: self.parseCollection,
        customPagingOptions: self.customPagingOptionsProvider
      });

      self.deptObservable = ko.observable();
      self.deptObservable(self.deptCollection);

      // self.deptDatasource = ko.pureComputed(function () {
      //   return new CollectionDataProvider(self.deptObservable());
      // });

      self.deptDatasource = new CollectionDataProvider(self.deptObservable());

      self.confidTableColumns = [
        {
          headerText: 'column1',
          style: 'width:40%;',
          field: 'DepartmentId',
          id: 'col1',
          sortable: 'enabled'
        },
        {
          headerText: 'column2',
          style: 'width:30%;',
          field: 'DepartmentId',
          id: 'col2'
        },
        {
          headerText: 'column3',
          style: 'width:20%',
          field: 'DepartmentId',
          id: 'col3'
        },
        {
          headerText: 'Actions',
          style: 'width: 10%',
          id: 'col4',
          frozenEdge: "end"
        }
      ];

      self.handleRemove = (event, context, arg3, arg4) => {
        var modelpromise = self.deptCollection.get(context.ID);
        modelpromise.then((modeltodelete) => {
          modeltodelete.destroy({
            success : function(data) {
              console.log(data);
            },
            error: function(jqXHR) {
              console.log(jqXHR);
            },
            wait: true
          });
        });

        return true;
      };

      self.templateVal = 1;
      self.getRowRenderer = function(){
        if(self.templateVal == 1){
          return self.KnockoutTemplateUtils.getRenderer('row_template1', true);
        } else {
          return self.KnockoutTemplateUtils.getRenderer('row_template2', true);
        }
        
      }

      self.rowtemp = ko.observable(self.KnockoutTemplateUtils.getRenderer('row_template1', true));

      self.changeTemplate = function(){
        self.templateVal  = 3 - self.templateVal;
        self.rowtemp(self.templateVal === 1 ? self.KnockoutTemplateUtils.getRenderer('row_template1', true): self.KnockoutTemplateUtils.getRenderer('row_template2', true));

      };






    }
    return DashboardViewModel;
  }
);
