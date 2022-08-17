define(['../accUtils', 'ojs/ojcore', 'ojs/ojmodel'],
 function(accUtils, oj, Model) {
    class IncidentsViewModel {
     constructor(params) {
       console.log("Function Executed: Module3");

       this.urlRoot = "js/resources/data.json";

       this.connected = (event) => {
         console.log("connecyed module:  module3");
       };

       this.disconnected = (event) => {
         console.log("disconnected module:   module3");
       };
     }
     newFunc (){
      console.log('aaa');
     }
   }
    return IncidentsViewModel;
  }
);
