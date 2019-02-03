const shallowCloneObject = require('./shallowCloneObject');
const sameColumn = require('./ColumnComparer');
const ColumnUtils = require('./ColumnUtils');
const getScrollbarSize  = require('./getScrollbarSize');
const isColumnsImmutable  = require('./utils/isColumnsImmutable');

type Column = {
  key: string;
  left: number;
  width: number;
};

type ColumnMetricsType = {
    columns: Array<Column>;
    totalWidth: number;
    minColumnWidth: number;
};

function setColumnWidths(columns, totalWidth) {
  return columns.map(column => {
    let colInfo = Object.assign({}, column);
    if (column.width) {
      if (/^([0-9]+)%$/.exec(column.width.toString())) {
        colInfo.width = Math.floor(
          column.width / 100 * totalWidth);
      }
    }
    return colInfo;
  });
}

function setDefferedColumnWidths(columns, unallocatedWidth, minColumnWidth) {
  let defferedColumns = columns.filter(c => !c.width);
  return columns.map((column) => {
    if (!column.width) {
      if (unallocatedWidth <= 0) {
        column.width = minColumnWidth;
      } else {
        column.width = Math.floor(unallocatedWidth / (ColumnUtils.getSize(defferedColumns)));
      }
    }
    return column;
  });
}

function setColumnOffsets(columns) {
  let left = 0;
  return columns.map(column => {
    column.left = left;
    left += column.width;
    return column;
  });
}

/**
 * Update column metrics calculation.
 *
 * @param {ColumnMetricsType} metrics
 */
function recalculate(metrics: ColumnMetricsType): ColumnMetricsType {
    // compute width for columns which specify width
  let columns = setColumnWidths(metrics.columns, metrics.totalWidth);

  let unallocatedWidth = columns.filter(c => c.width).reduce((w, column) => {
    return w - column.width;
  }, metrics.totalWidth);
  unallocatedWidth -= getScrollbarSize();

  let width = columns.filter(c => c.width).reduce((w, column) => {
    return w + column.width;
  }, 0);

  // compute width for columns which doesn't specify width
  columns = setDefferedColumnWidths(columns, unallocatedWidth, metrics.minColumnWidth);

  // compute left offset
  columns = setColumnOffsets(columns);

  return {
    columns,
    width,
    totalWidth: metrics.totalWidth,
    minColumnWidth: metrics.minColumnWidth
  };
}

/**
 * Update column metrics calculation by resizing a column.
 *
 * @param {ColumnMetricsType} metrics
 * @param {Column} column
 * @param {number} width
 */
function resizeColumn(metrics: ColumnMetricsType, index: number, width: number): ColumnMetricsType {
  let column = ColumnUtils.getColumn(metrics.columns, index);
  let metricsClone = shallowCloneObject(metrics);
  metricsClone.columns = metrics.columns.slice(0);

  let updatedColumn = shallowCloneObject(column);
  updatedColumn.width = Math.max(width, metricsClone.minColumnWidth);

  metricsClone = ColumnUtils.spliceColumn(metricsClone, index, updatedColumn);

  return recalculate(metricsClone);
}

function areColumnsImmutable(prevColumns: Array<Column>, nextColumns: Array<Column>) {
  return isColumnsImmutable(prevColumns) && isColumnsImmutable(nextColumns);
}

function compareEachColumn(prevColumns: Array<Column>, nextColumns: Array<Column>) {
  return nextColumns.every( (value, index) => {
    const prevColumn = prevColumns[index];
    if (prevColumn) {
      return value.key === prevColumn.key;
    }
    return false;
  });
}

function sameColumns(prevColumns: Array<Column>, nextColumns: Array<Column>, isSameColumn: (a: Column, b: Column) => boolean): boolean {
  if (prevColumns.length !== nextColumns.length ) return false;
  if (areColumnsImmutable(prevColumns, nextColumns)) {
    return prevColumns === nextColumns;
  }
  const compare = compareEachColumn(prevColumns, nextColumns, isSameColumn);
  return compare;
}

module.exports = { recalculate, resizeColumn, sameColumn, sameColumns };
