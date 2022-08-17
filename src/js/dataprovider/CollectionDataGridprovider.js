define(["require", "exports", "ojs/ojdatagridprovider", "ojs/ojeventtarget"], function (require, exports, ojdatagridprovider_1, ojeventtarget_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CollectionDataGridProvider = void 0;
    class CollectionDataGridProvider {
        constructor(ModelObj, CollectionObj,dataParameters, sortParameters, mergeStrategy, requiredParameters) {
            this.dataParameters = dataParameters;
            this.sortParameters = sortParameters;
            this.mergeStrategy = mergeStrategy;
            this.requiredParameters = requiredParameters;
            this.version = 0;
            this.totals = {};
            this.levels = {};

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
            this.setTotalCounts();
        }
        fetchByOffset(parameters) {
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
        setSortParameters(sortParameters) {
            this.sortParameters = sortParameters;
        }
        setDataParameters(dataParameters) {
            this.dataParameters = dataParameters;
            this.setTotalCounts();
        }
        doAdd(detail) {
        }
        doUpdate(detail) {
        }
        doRemove(detail) {
        }
        doRefresh() {
        }
        getResults(outerValues, mergeDimension, resultsParams, mergeInnerValid, createItem) {
        }
        createDataItem(data, mergeResults) {
            const rowOffset = mergeResults.outerOffset;
            const columnOffset = mergeResults.innerOffset;
            const rowExtent = mergeResults.outerExtent;
            const columnExtent = mergeResults.innerExtent;
            const metadata = {};
            return new this.GridBodyItem(rowExtent, columnExtent, rowOffset, columnOffset, metadata, data);
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
        }
        mergeInnerHeaderValid(offset) {
            return offset !== 0;
        }
        getHeaderMetadata(axis, index, level, sortable, required) {
        }
        getHeaderLabelResults(headerLabels) {
        }
        createTempMatrix(outerOffset, innerOffset, outerCount, innerCount) {
        }
        isInMatrix(matrixObject, outerOffset, innerOffset) {
            
        }
        addToMatrix(matrixObject, mergeParams) {
        }
        getMergeDimensions(data, mergeDimension, shouldMergeInner, mergeParams) {
        }
    }
    exports.CollectionDataGridProvider = CollectionDataGridProvider;
    CollectionDataGridProvider.row = 'row';
    CollectionDataGridProvider.rowEnd = 'rowEnd';
    CollectionDataGridProvider.column = 'column';
    CollectionDataGridProvider.columnEnd = 'columnEnd';
    CollectionDataGridProvider.unsorted = 'unsorted';
    ojeventtarget_1.EventTargetMixin.applyMixin(CollectionDataGridProvider);
});