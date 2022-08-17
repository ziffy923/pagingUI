define(["require", "exports", "ojs/ojdatagridprovider", "ojs/ojeventtarget", 'jquery'], function (require, exports, ojdatagridprovider_1, ojeventtarget_1, $) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RestArrayDataGridProvider = void 0;
    class RestArrayDataGridProvider {
        constructor(dataParameters, sortParameters, mergeStrategy, requiredParameters) {
            this.dataParameters = [];
            this.sortParameters = sortParameters;
            this.columnLabels = dataParameters.columnLabels;
            this.mergeStrategy = mergeStrategy;
            this.requiredParameters = requiredParameters;
            this.baseURL = dataParameters.baseURL;
            this.URLCallback = dataParameters.URLCallback;
            this.pageNumber = 0;
            this.version = 0;
            this.totals = {};
            this.levels = {};
            this.fetchFinished = false;
            this.availableRows = 0;
            this.setTotalCounts = () => {
                var _a, _b, _c, _d, _e;
                this.totals.column = Math.max(((_a = this.dataParameters.data) === null || _a === void 0 ? void 0 : _a[0]) ? this.dataParameters.data[0].length : -1, this.dataParameters.columnHeader ? this.dataParameters.columnHeader.length : -1, this.dataParameters.columnEndHeader ? this.dataParameters.columnEndHeader.length : -1);
                this.totals.row = Math.max(this.dataParameters.data ? this.dataParameters.data.length : -1, this.dataParameters.rowHeader ? this.dataParameters.rowHeader.length : -1, this.dataParameters.rowEndHeader ? this.dataParameters.rowEndHeader.length : -1);
                this.levels.row = Math.max(0, (_b = this.dataParameters.rowHeader) === null || _b === void 0 ? void 0 : _b.length);
                this.levels.column = Math.max(0, (_c = this.dataParameters.columnHeader) === null || _c === void 0 ? void 0 : _c.length);
                this.levels.rowEnd = Math.max(0, (_d = this.dataParameters.rowEndHeader) === null || _d === void 0 ? void 0 : _d.length);
                this.levels.columnEnd = Math.max(0, (_e = this.dataParameters.columnEndHeader) === null || _e === void 0 ? void 0 : _e.length);
            };
            this.GridItem = class {
                constructor(metadata, data) {
                    this.metadata = metadata;
                    this.data = data;
                }
            };
            this.GridBodyItem = class {
                constructor(rowExtent, columnExtent, rowIndex, columnIndex, metadata, data) {
                    this.rowExtent = rowExtent;
                    this.columnExtent = columnExtent;
                    this.rowIndex = rowIndex;
                    this.columnIndex = columnIndex;
                    this.metadata = metadata;
                    this.data = data;
                }
            };
            this.GridHeaderItem = class {
                constructor(index, extent, level, depth, metadata, data) {
                    this.index = index;
                    this.extent = extent;
                    this.level = level;
                    this.depth = depth;
                    this.metadata = metadata;
                    this.data = data;
                }
            };
            this.GridHeaderMetadata = class {
                constructor(sortDirection, showRequired) {
                    this.sortDirection = sortDirection;
                    this.showRequired = showRequired;
                }
            };
            this.FetchByOffsetGridResults = class {
                constructor(fetchParameters, rowDone, columnDone, rowOffset, columnOffset, rowCount, columnCount, totalRowCount, totalColumnCount, results, version, next) {
                    this.fetchParameters = fetchParameters;
                    this.rowDone = rowDone;
                    this.columnDone = columnDone;
                    this.rowOffset = rowOffset;
                    this.columnOffset = columnOffset;
                    this.rowCount = rowCount;
                    this.columnCount = columnCount;
                    this.totalRowCount = totalRowCount;
                    this.totalColumnCount = totalColumnCount;
                    this.results = results;
                    this.version = version;
                    this.next = next;
                }
            };
            // this.setTotalCounts();
        }

        appendNewResultsAndUpdateTotals(data){
            this.dataParameters = this.dataParameters.concat(data.items);
            this.availableRows += data.items.length;
        }

        prepareDataCells(rowOffset, rowCount, columnCount){
            var results = [];
            for(var outeriter = rowOffset; outeriter <= Math.min((rowOffset + rowCount), this.availableRows);outeriter++){
                var innerinter = 0;
                for(const property in this.dataParameters[outeriter]){
                    results.push(this.createDataItem({data: this.dataParameters[outeriter][property]}, outeriter, innerinter++));
                }
            }
            return results;
        }

        applyTempParams(updatedQueryParams){
            for(const property in updatedQueryParams){
                this[property] = updatedQueryParams[property];
            }
        }

        getResultsFromRest(rowOffset, rowCount, columnCount){
            const {url, updatedQueryParams} = this.URLCallback(0, rowOffset, this.pageNumber, null, this.baseURL );
            return new Promise((resolve, reject) => {
                $.ajax({
                    url:url,
                    async: false,
                    success: (data) => {
                        this.appendNewResultsAndUpdateTotals(data);
                        this.applyTempParams(updatedQueryParams);
                        resolve(this.prepareDataCells(rowOffset, rowCount, columnCount));
                    },
                    error: (jqXHR) => {
                        console.log(jqXHR);
                        reject(Failed);
                    }

                });
            });
        }

        getResults(rowOffset, rowCount, columnCount){
            if(rowOffset + rowCount <= this.availableRows){
                return new Promise((resolve, reject)=>{
                    resolve(this.prepareDataCells(rowOffset, rowCount, columnCount));
                });

            } else {
                return this.getResultsFromRest(rowOffset, rowCount, columnCount);
            }

        }

        fetchByOffset(parameters){
            //to implement: if hasMore=false return null Object
            return new Promise((resolve) => {
                const rowOffset = parameters.rowOffset;
                const rowCount = parameters.rowCount;
                const columnCount = Math.min(parameters.columnCount, 4);
                const rowDone = false;
                const columnDone = false;
                const columnOffset = 0;
                //temp prpos
                const rowTotal = 1000;
                const columnTotal  = 4;
                const version = 0;
                const next = null;
                const databody = this.getResults(rowOffset, rowCount, columnCount);            
                
                Promise.all([databody]).then((values) => {
                    const results = {
                        databody: values[0],
                        rowHeader: null,
                        columnHeader: null,
                        rowEndHeader: null,
                        columnEndHeader: null,
                        columnHeaderLabel: null,
                        rowHeaderLabel: null,
                        columnEndHeaderLabel: null,
                        rowEndHeaderLabel: null
    
                    };
                    resolve(new this.FetchByOffsetGridResults(parameters, rowDone, columnDone, rowOffset, columnOffset, Math.min(rowCount, this.availableRows - rowOffset), columnCount, rowTotal, columnTotal, results, version, next));
                })
                
                                
            });

        }

        fetchByOffset_c(parameters) {
            return new Promise((resolve) => {
                var _a, _b, _c, _d, _e, _f, _g;
                const rowOffset = parameters.rowOffset;
                const columnOffset = parameters.columnOffset;
                const rowCount = Math.min(parameters.rowCount, this.totals.row - rowOffset);
                const columnCount = Math.min(parameters.columnCount, this.totals.column - columnOffset);
                const rowDone = rowOffset + rowCount >= this.totals.row;
                const columnDone = columnOffset + columnCount >= this.totals.column;
                const version = this.version;
                const databody = this.getResults(this.dataParameters.data, (_a = this.mergeStrategy) === null || _a === void 0 ? void 0 : _a.data, { outerOffset: rowOffset, innerOffset: columnOffset, outerCount: rowCount, innerCount: columnCount }, () => { return true; }, this.createDataItem.bind(this));
                const rowHeader = this.getResults(this.dataParameters.rowHeader, (_b = this.mergeStrategy) === null || _b === void 0 ? void 0 : _b.rowHeader, { outerOffset: 0, innerOffset: rowOffset, outerCount: this.levels.row, innerCount: rowCount }, this.mergeInnerHeaderValid, this.createHeaderItem.bind(this, RestArrayDataGridProvider.row, (_c = this.sortParameters) === null || _c === void 0 ? void 0 : _c.rowSortable));
                const columnHeader = this.getResults(this.dataParameters.columnHeader, (_d = this.mergeStrategy) === null || _d === void 0 ? void 0 : _d.columnHeader, { outerOffset: 0, innerOffset: columnOffset, outerCount: this.levels.column, innerCount: columnCount }, this.mergeInnerHeaderValid, this.createHeaderItem.bind(this, RestArrayDataGridProvider.column, (_e = this.sortParameters) === null || _e === void 0 ? void 0 : _e.columnSortable));
                const rowEndHeader = this.getResults(this.dataParameters.rowEndHeader, (_f = this.mergeStrategy) === null || _f === void 0 ? void 0 : _f.rowEndHeader, { outerOffset: 0, innerOffset: rowOffset, outerCount: this.levels.rowEnd, innerCount: rowCount }, this.mergeInnerHeaderValid, this.createHeaderItem.bind(this, RestArrayDataGridProvider.rowEnd, false));
                const columnEndHeader = this.getResults(this.dataParameters.columnEndHeader, (_g = this.mergeStrategy) === null || _g === void 0 ? void 0 : _g.columnEndHeader, { outerOffset: 0, innerOffset: rowOffset, outerCount: this.levels.columnEnd, innerCount: rowCount }, this.mergeInnerHeaderValid, this.createHeaderItem.bind(this, RestArrayDataGridProvider.columnEnd, false));
                const rowHeaderLabel = this.getHeaderLabelResults(this.dataParameters.rowHeaderLabel);
                const columnHeaderLabel = this.getHeaderLabelResults(this.dataParameters.columnHeaderLabel);
                const rowEndHeaderLabel = this.getHeaderLabelResults(this.dataParameters.rowEndHeaderLabel);
                const columnEndHeaderLabel = this.getHeaderLabelResults(this.dataParameters.columnEndHeaderLabel);
                const next = null;
                const results = {
                    databody: databody,
                    rowHeader: rowHeader,
                    columnHeader: columnHeader,
                    rowEndHeader: rowEndHeader,
                    columnEndHeader: columnEndHeader,
                    columnHeaderLabel: columnHeaderLabel,
                    rowHeaderLabel: rowHeaderLabel,
                    columnEndHeaderLabel: columnEndHeaderLabel,
                    rowEndHeaderLabel: rowEndHeaderLabel
                };
                resolve(new this.FetchByOffsetGridResults(parameters, rowDone, columnDone, rowOffset, columnOffset, rowCount, columnCount, this.totals.row, this.totals.column, results, version, next));
            });
        }
        getCapability(capabilityName) {
            if (capabilityName === 'version') {
                return 'monotonicallyIncreasing';
            }
            return null;
        }
        isEmpty() {
            return (this.totals.column <= 0 && this.totals.row <= 0) ? 'yes' : 'no';
        }
        doAdd(detail) {
            const count = detail.ranges.reduce((acc, obj) => acc + obj.count, 0);
            if (detail.axis === 'column') {
                this.totals.column = this.totals.column + count;
            }
            else if (detail.axis === 'row') {
                this.totals.row = this.totals.row + count;
            }
            this.dispatchEvent(new ojdatagridprovider_1.DataGridProviderAddEvent(detail));
        }
        doUpdate(detail) {
            this.dispatchEvent(new ojdatagridprovider_1.DataGridProviderUpdateEvent(detail));
        }
        doRemove(detail) {
            const count = detail.ranges.reduce((acc, obj) => acc + obj.count, 0);
            if (detail.axis === 'column') {
                this.totals.column = this.totals.column - count;
            }
            else if (detail.axis === 'row') {
                this.totals.row = this.totals.row - count;
            }
            this.dispatchEvent(new ojdatagridprovider_1.DataGridProviderRemoveEvent(detail));
        }
        doRefresh() {
            this.dispatchEvent(new ojdatagridprovider_1.DataGridProviderRefreshEvent());
        }
        getResults_1(outerValues, mergeDimension, resultsParams, mergeInnerValid, createItem) {
            var _a;
            const { outerOffset, innerOffset, outerCount, innerCount } = resultsParams;
            if (((_a = outerValues === null || outerValues === void 0 ? void 0 : outerValues[0]) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                const results = [];
                const mergeMatrix = this.createTempMatrix(outerOffset, innerOffset, outerCount, innerCount);
                for (let outer = outerOffset; outer < outerOffset + outerCount; outer++) {
                    const innerValues = outerValues[outer];
                    for (let inner = innerOffset; inner < innerOffset + innerCount; inner++) {
                        if (this.isInMatrix(mergeMatrix, outer, inner)) {
                            continue;
                        }
                        const data = innerValues[inner];
                        const mergeResults = this.getMergeDimensions(outerValues, mergeDimension, mergeInnerValid, { outerOffset: outer, innerOffset: inner, outerStart: outerOffset, innerStart: innerOffset });
                        results.push(createItem(data, mergeResults));
                        this.addToMatrix(mergeMatrix, mergeResults);
                    }
                    ;
                }
                return results;
            }
            return null;
        }
        createDataItem(data, rowOffset, columnOffset) {
            return new this.GridBodyItem(1, 1, rowOffset, columnOffset, {}, data);
        }
        createHeaderItem(axis, sortable, data, mergeResults) {
            const index = mergeResults.innerOffset;
            const level = this.levels[axis] - mergeResults.outerOffset - mergeResults.outerExtent;
            const required = this.isRequired(index, axis, level);
            const extent = mergeResults.innerExtent;
            const depth = mergeResults.outerExtent;
            const metadata = this.getHeaderMetadata(axis, index, level, sortable, required);
            return new this.GridHeaderItem(index, extent, level, depth, metadata, data);
        }
        isRequired(currentIndex, axis, currentLevel) {
            var _a;
            if ((_a = this.requiredParameters) === null || _a === void 0 ? void 0 : _a[axis]) {
                return this.requiredParameters[axis].some((header) => { return header.index === currentIndex && header.level === currentLevel; });
            }
            return false;
        }
        mergeInnerHeaderValid(offset) {
            return offset !== 0;
        }
        getHeaderMetadata(axis, index, level, sortable, required) {
            var _a, _b, _c, _d, _e;
            if (sortable) {
                if (((_b = (_a = this.sortParameters) === null || _a === void 0 ? void 0 : _a.sortValue) === null || _b === void 0 ? void 0 : _b.axis) === axis && ((_d = (_c = this.sortParameters) === null || _c === void 0 ? void 0 : _c.sortValue) === null || _d === void 0 ? void 0 : _d.index) === index) {
                    return new this.GridHeaderMetadata((_e = this.sortParameters) === null || _e === void 0 ? void 0 : _e.sortValue.direction, required);
                }
                else {
                    return new this.GridHeaderMetadata(RestArrayDataGridProvider.unsorted, required);
                }
            }
            else {
                return new this.GridHeaderMetadata(null, required);
            }
        }
        getHeaderLabelResults(headerLabels) {
            if ((headerLabels === null || headerLabels === void 0 ? void 0 : headerLabels.length) > 0) {
                return headerLabels.map((label) => {
                    return new this.GridItem({}, { data: label });
                });
            }
            return null;
        }
        createTempMatrix(outerOffset, innerOffset, outerCount, innerCount) {
            const matrix = new Array(outerCount);
            for (let i = 0; i < matrix.length; i++) {
                matrix[i] = new Array(innerCount).fill(false);
            }
            return { matrix, outerOffset, innerOffset };
        }
        isInMatrix(matrixObject, outerOffset, innerOffset) {
            return matrixObject.matrix[outerOffset - matrixObject.outerOffset][innerOffset - matrixObject.innerOffset];
        }
        addToMatrix(matrixObject, mergeParams) {
            const { outerOffset, innerOffset, outerExtent, innerExtent } = mergeParams;
            for (let i = 0; i < outerExtent; i++) {
                for (let j = 0; j < innerExtent; j++) {
                    matrixObject.matrix[outerOffset - matrixObject.outerOffset + i][innerOffset - matrixObject.innerOffset + j] = true;
                }
            }
        }
        getMergeDimensions(data, mergeDimension, shouldMergeInner, mergeParams) {
            const { outerOffset, innerOffset, outerStart, innerStart } = mergeParams;
            const innerMergeFunction = mergeDimension === null || mergeDimension === void 0 ? void 0 : mergeDimension.inner;
            const outerMergeFunction = mergeDimension === null || mergeDimension === void 0 ? void 0 : mergeDimension.outer;
            let finalInnerOffset = innerOffset;
            let finalOuterOffset = outerOffset;
            let innerExtent = 1;
            let outerExtent = 1;
            if (shouldMergeInner(outerOffset) && innerMergeFunction != null) {
                let currentInnerOffset = innerOffset;
                let previousInnerOffset = innerOffset - 1;
                if (innerStart === currentInnerOffset) {
                    while (data[finalOuterOffset][previousInnerOffset]) {
                        if (innerMergeFunction(data[finalOuterOffset][currentInnerOffset], data[finalOuterOffset][previousInnerOffset])) {
                            innerExtent += 1;
                            finalInnerOffset -= 1;
                            currentInnerOffset -= 1;
                            previousInnerOffset -= 1;
                        }
                        else {
                            break;
                        }
                    }
                }
                currentInnerOffset = innerOffset;
                let nextInnerOffset = innerOffset + 1;
                while (data[finalOuterOffset][nextInnerOffset]) {
                    if (innerMergeFunction(data[finalOuterOffset][currentInnerOffset], data[finalOuterOffset][nextInnerOffset])) {
                        innerExtent += 1;
                        currentInnerOffset += 1;
                        nextInnerOffset += 1;
                    }
                    else {
                        break;
                    }
                }
            }
            if ((mergeDimension === null || mergeDimension === void 0 ? void 0 : mergeDimension.outer) != null) {
                let currentOuterOffset = outerOffset;
                let previousOuterOffset = outerOffset - 1;
                let breakVar = true;
                if (outerStart === currentOuterOffset) {
                    while (data[previousOuterOffset] && breakVar) {
                        for (let i = finalInnerOffset; i < finalInnerOffset + innerExtent; i++) {
                            if (outerMergeFunction(data[currentOuterOffset][i], data[previousOuterOffset][i])) {
                                if (i === (finalInnerOffset + innerExtent - 1)) {
                                    outerExtent += 1;
                                    finalOuterOffset -= 1;
                                }
                            }
                            else {
                                breakVar = false;
                                break;
                            }
                        }
                        currentOuterOffset -= 1;
                        previousOuterOffset -= 1;
                    }
                }
                currentOuterOffset = outerOffset;
                let nextOuterOffset = outerOffset + 1;
                breakVar = true;
                while (data[nextOuterOffset] && breakVar) {
                    for (let i = finalInnerOffset; i < finalInnerOffset + innerExtent; i++) {
                        if (outerMergeFunction(data[currentOuterOffset][i], data[nextOuterOffset][i])) {
                            if (i === (finalInnerOffset + innerExtent - 1)) {
                                outerExtent += 1;
                            }
                        }
                        else {
                            breakVar = false;
                            break;
                        }
                    }
                    currentOuterOffset += 1;
                    nextOuterOffset += 1;
                }
            }
            return { innerOffset: finalInnerOffset, outerOffset: finalOuterOffset, innerExtent, outerExtent };
        }
    }
    exports.RestArrayDataGridProvider = RestArrayDataGridProvider;
    RestArrayDataGridProvider.row = 'row';
    RestArrayDataGridProvider.rowEnd = 'rowEnd';
    RestArrayDataGridProvider.column = 'column';
    RestArrayDataGridProvider.columnEnd = 'columnEnd';
    RestArrayDataGridProvider.unsorted = 'unsorted';
    ojeventtarget_1.EventTargetMixin.applyMixin(RestArrayDataGridProvider);
});