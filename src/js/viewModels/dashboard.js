
define(['../accUtils', 'ojs/ojcore', 'knockout', "ojs/ojcollectiondataprovider", 'ojs/ojknockouttemplateutils',
        'ojs/ojarraydataprovider', 'ojs/ojbutton', 'ojs/ojtable', "ojs/ojknockout", "require", "exports", "ojs/ojbootstrap",
        ],
  function (accUtils, oj, ko, CollectionDataProvider, KnockoutTemplateUtils, ArrayDataProvider) {
    function DashboardViewModel(params) {
      var self = this;
      self.KnockoutTemplateUtils = KnockoutTemplateUtils;


      self.connected = () => {
        accUtils.announce('Dashboard page loaded.', 'assertive');
        document.title = "Dashboard";
      };
      self.disconnected = () => {
      };
      self.transitionCompleted = () => {
      };

      self.buttonValue = ko.observable("off");

      self.parsedata = function(data){
        var self = this;
        self.DepartmentId = data.DepartmentId;
        self.DepartmentName = data.DepartmentName;
        self.EmployeeCount = data.EmployeeCount;
        return self;
      }


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
          ManagerId: response.ManagerId
        };
      };

      self.getdata = (arg) =>{
        console.log(arg);
      };

      self.get = (context) => {
        console.log(context);
        return context.rowContext.mode;
      };



      self.modelUrl = "js/resources/data.json";
      self.deptModel = oj.Model.extend({
        urlRoot: self.modelUrl,
        parse: self.parseDept,
        parseSave: self.parseDept,
        idAttribute: 'DepartmentId'
      });
      self.newDeptModel = new self.deptModel();

      self.deptCollection = oj.Collection.extend({
        url: self.modelUrl,
        model: self.newDeptModel,
        comparator: "DepartmentId"
      });

      self.deptObservable = ko.observable();
      self.deptObservable(new self.deptCollection());

      // self.deptDatasource = ko.pureComputed(function () {
      //   return new CollectionDataProvider(self.deptObservable());
      // });

      self.deptDatasource = new CollectionDataProvider(self.deptObservable());

      self.confidTableColumns = [
        {
          headerText: 'column1',
          style: 'width:40%;',
          field: 'DepartmentId',
          id: 'col1'
        },
        {
          headerText: 'column2',
          style: 'width:40%;',
          field: 'DepartmentId',
          id: 'col2'
        },
        {
          headerText: 'column3',
          style: 'width:20%',
          field: 'DepartmentId',
          id: 'col3'
        }
      ];

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
