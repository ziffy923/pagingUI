define(['../accUtils', 'ojs/ojcore', 'knockout', 'ojs/ojmodel', 'ojs/ojarraydataprovider', 'ojs/ojvalidator-length', 'ojs/ojlabel',
        'ojs/ojknockout', 'ojs/ojselectsingle'],
 function(accUtils, oj, ko, Model, ArrayDataProvider) {
    function IncidentsViewModel(params){
        var self = this;

        self.addfield = function(){
            self.browsers.push({ value: "Edge", label: "Edge Browser Explorer", newKey: "newKey1" });
        }

        self.browsers = ko.observableArray([
            { value: "IE", label: "Internet Explorer", newKey: "newKey1" },
            { value: "FF", label: "Firefox", newKey: "newKey2" },
            { value: "CH", label: "Chrome", newKey: "newKey3"},
            { value: "OP", label: "Opera", disabled: true },
            { value: "SA", label: "Safari" },
        ]);
        self.browsersDP = new ArrayDataProvider(this.browsers, {
            keyAttributes: "value",
        });

        self.valueItem = ko.observable({});
        self.selectValue = ko.observable('CH');
        self.changeListener = function (event, data, arg3, arg4){
            console.log(event);
            console.log(data);
            console.log(arg3);
            console.log(arg4);
            console.log(self.valueItem());
            console.log(self.selectValue());
        };
    }
    return IncidentsViewModel;
  }
);
