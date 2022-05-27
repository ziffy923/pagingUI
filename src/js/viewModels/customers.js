/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Your customer ViewModel code goes here
 */
define(['../accUtils', 'appController', 'ojs/ojcore', "exports", "knockout", "ojs/ojbootstrap","ojs/ojmodule-element-utils", "ojs/ojmodule-element",
        "ojs/ojknockout", "ojs/ojbutton", "ojs/ojdialog", "ojs/ojformlayout", "ojs/ojinputtext", 'ojs/ojdefer'],
  function (accUtils, app, oj, exports, ko, Bootstrap, ModuleElementUtils) {
    function CustomerViewModel(params) {
      // console.log('connected');
      // Below are a set of the ViewModel methods invoked by the oj-module component.
      // Please reference the oj-module jsDoc for additional information.

      /**
       * Optional ViewModel method invoked after the View is inserted into the
       * document DOM.  The application can put logic that requires the DOM being
       * attached here.
       * This method might be called multiple times - after the View is created
       * and inserted into the DOM and after the View is reconnected
       * after being disconnected.
       */
      this.connected = (event) => {
        accUtils.announce('Customers page loaded.', 'assertive');
        document.title = "Customers";
        // Implement further logic if needed
      };

      /**
       * Optional ViewModel method invoked after the View is disconnected from the DOM.
       */
      this.disconnected = () => {
        // Implement if needed
      };

      /**
       * Optional ViewModel method invoked after transition to the new View is complete.
       * That includes any possible animation between the old and the new View.
       */
      this.transitionCompleted = () => {
        // Implement if needed
      };

      this.close1 = (event) => {
        document.getElementById("modalDialog1").close();
      };
      this.open1 = (event) => {
        document.getElementById("modalDialog1").open();
      };


      this.close2 = (event) => {
        document.getElementById("modalDialog2").close();
      };
      this.open2 = (event) => {
        document.getElementById("modalDialog2").open();
      };

      this.dialogparam = ko.observable('aaaaa');
      this.changeparam = (event) =>{
        this.dialogparam('dadda');
      };
      this.ModuleElementUtils = ModuleElementUtils;

      // this.moduleConfig = ModuleElementUtils.createConfig({
      //   name: 'about',
      //   params: this.dialogparam
      // });

      //thing to take into notice here the ViewModel is executed as soon as this block of code gets executed
      //whether HTML actually contains the module is inconsequntial. 
      //after the HTML tag gets joined to the Page, this.connectde gets called.

      //if you return function then the viewModel gets executed once once , 
      // rest times it's the observable whose value changes
      // but if you return a class with constructors the VM is guaranteed to be executed multiple times.

      this.refreshDialog = (event) => {
        document.querySelector("#modalDialog1").refresh();
      };

      this.dialogCloseHandler = app.closeHandler;

    }

    /*
     * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
     * return a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.
     */
    return CustomerViewModel;
  }
);
