define(['../accUtils', 'ojs/ojcore', 'knockout',"ojs/ojmodule-element-utils", 'ojs/ojbutton', 'ojs/ojdrawerpopup',
        "ojs/ojmodule-element", 'ojs/ojdefer'],
 function(accUtils, oj, ko, ModuleElementUtils) {
    function IncidentsViewModel() {
        var self = this;
        self.ModuleElementUtils = ModuleElementUtils;
        self.counter = ko.observable(0);
        self.draweropen = ko.observable(false);
        self.draweopenclose = function(){
            self.draweropen(!self.draweropen());
        };

        self.add = function(){
            self.counter(self.counter() + 1);
        }
        self.subtract = function(){
            self.counter(self.counter() - 1);
        }

        self.dosome = function (){
            document.querySelector('#data').innerHTML = self.counter();

        };
        self.saveAvailabe = ko.pureComputed(function(){
            return self.counter() === 0 ? true : false;
        });

        self.get = function(){
            console.log('aaaaaaa');
            return 'aaaaaaa';
        };

   }
    return IncidentsViewModel;
  }
);
