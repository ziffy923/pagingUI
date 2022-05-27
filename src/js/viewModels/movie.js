define(["require", "exports", "ojs/ojbootstrap", "knockout", "ojs/ojarraydataprovider", 
        "ojs/ojbufferingdataprovider", "ojs/ojcontext", "ojs/ojconverter-number",
        "ojs/ojconverter-datetime", "ojs/ojvalidator-numberrange",
        "text!resources/data.json", "ojs/ojknockout",
        "ojs/ojinputtext", "ojs/ojdatetimepicker", "ojs/ojselectcombobox", "ojs/ojcheckboxset",
        "ojs/ojtable", "ojs/ojtoolbar", "ojs/ojbutton", "ojs/ojmessages", "ojs/ojselectsingle",
        "ojs/ojformlayout", "ojs/ojlabelvalue"],
 function(require, exports, ojbootstrap_1, ko, ArrayDataProvider, BufferingDataProvider,
          Context, ojconverter_number_1, ojconverter_datetime_1, NumberRangeValidator,
          deptData) {
    class IncidentsViewModel {
     constructor(params) {
      this.deptArray = JSON.parse(deptData);
      this.deptObservableArray = ko.observableArray(this.deptArray);
      this.dataprovider = new BufferingDataProvider(new ArrayDataProvider(this.deptObservableArray, {
          keyAttributes: 'DepartmentId'
      }));
      this.departments = new ArrayDataProvider([{ label: 'Sales' }, { label: 'HR' }, { label: 'Marketing' }, { label: 'Finance' }], { keyAttributes: 'label' });
      this.asyncValidation = ko.observable('off');
      this.isDelayDisabled = ko.computed(function () {
          return this.asyncValidation() === 'off';
      }.bind(this));
      this.editDelay = ko.observable(2000);
      this.editEndDelay = ko.observable(2000);
      this.editedData = ko.observable('');
      // // NUMBER AND DATE CONVERTER ////
      this.numberConverter = new ojconverter_number_1.IntlNumberConverter();
      this.dateConverter = new ojconverter_datetime_1.IntlDateTimeConverter({
          year: '2-digit',
          month: '2-digit',
          day: '2-digit'
      });
      this.rangeValidator = new NumberRangeValidator({ min: 100, max: 500 });
      this.validators = [this.rangeValidator];
      this.editRow = ko.observable();
      this.beforeRowEditListener = (event) => {
          if (this.asyncValidation() === 'on') {
              event.detail.accept(new Promise(function (resolve) {
                  setTimeout(function () {
                      this.prepareEdit(event);
                      resolve();
                  }.bind(this), this.editDelay());
              }.bind(this)));
          }
          else {
              this.prepareEdit(event);
          }
      };
      this.prepareEdit = (event) => {
          this.cancelEdit = false;
          const rowContext = event.detail.rowContext;
          this.originalData = Object.assign({}, rowContext.item.data);
          this.rowData = Object.assign({}, rowContext.item.data);
      };
      // handle validation of editable components and when edit has been cancelled
      this.beforeRowEditEndListener = (event) => {
          this.editedData('');
          const detail = event.detail;
          if (!detail.cancelEdit && !this.cancelEdit) {
              if (this.asyncValidation() === 'on') {
                  detail.accept(new Promise(function (resolve, reject) {
                      // the use of 'setTimeout' here is only to simulate the delay of a real asynchronous task
                      setTimeout(function () {
                          let invalidInput = this.validateEdit(event);
                          if (invalidInput != null) {
                              reject();
                              this.applyFocus(invalidInput);
                          }
                          else {
                              resolve();
                          }
                      }.bind(this), this.editEndDelay());
                  }.bind(this)));
              }
              else {
                  let invalidInput = this.validateEdit(event);
                  if (invalidInput != null) {
                      event.preventDefault();
                      this.applyFocus(invalidInput);
                  }
              }
          }
      };
      this.validateEdit = (event) => {
          let invalidInputs = this.getValidationErrorElementsInRow(document.getElementById('table'));
          if (invalidInputs.length > 0) {
              return invalidInputs[0];
          }
          else {
              if (this.isRowDataUpdated()) {
                  const key = event.detail.rowContext.item.data.DepartmentId;
                  this.submitRow(key);
              }
          }
      };
      this.applyFocus = (element) => {
          let busyContext = Context.getContext(document.getElementById('table')).getBusyContext();
          busyContext.whenReady().then(function () {
              element.focus();
          });
      };
      this.submitRow = (key) => {
          this.dataprovider.updateItem({
              metadata: { key: key },
              data: this.rowData
          });
          const editItem = this.dataprovider.getSubmittableItems()[0];
          this.dataprovider.setItemStatus(editItem, 'submitting');
          for (let idx = 0; idx < this.deptObservableArray().length; idx++) {
              if (this.deptObservableArray()[idx].DepartmentId === editItem.item.metadata.key) {
                  this.deptObservableArray.splice(idx, 1, editItem.item.data);
                  break;
              }
          }
          // Set the edit item to "submitted" if successful
          this.dataprovider.setItemStatus(editItem, 'submitted');
          this.editedData(JSON.stringify(editItem.item.data));
      };
      this.isRowDataUpdated = () => {
          const propNames = Object.getOwnPropertyNames(this.rowData);
          for (let i = 0; i < propNames.length; i++) {
              if (this.rowData[propNames[i]] !== this.originalData[propNames[i]]) {
                  return true;
              }
          }
          return false;
      };
      // checking for validity of editables inside a row
      this.getValidationErrorElementsInRow = (table) => {
          let invalidInputs = [];
          const editables = table.querySelectorAll('.editable');
          for (let i = 0; i < editables.length; i++) {
              const editable = editables.item(i);
              editable.validate();
              // Table does not currently support editables with async validators
              // so treating editable with 'pending' state as invalid
              if (editable.valid !== 'valid') {
                  invalidInputs.push(editable);
              }
          }
          return invalidInputs;
      };
      this.handleUpdate = (event, context) => {
          this.editRow({ rowKey: context.item.data.DepartmentId });
      };
      this.handleDone = () => {
          this.editRow({ rowKey: null });
      };
      this.handleCancel = () => {
          this.cancelEdit = true;
          this.editRow({ rowKey: null });
      };
     }
   }
    return IncidentsViewModel;
  }
);
