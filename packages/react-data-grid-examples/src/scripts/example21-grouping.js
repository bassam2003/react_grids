const faker = require('faker');
const ReactDataGrid = require('react-data-grid');
const exampleWrapper = require('../components/exampleWrapper');
const React = require('react');
const {
  ToolsPanel: { AdvancedToolbar: Toolbar, GroupedColumnsPanel },
  Data: { Selectors },
  Draggable: { Container: DraggableContainer },
  Formatters: { ImageFormatter }
} = require('react-data-grid-addons');

faker.locale = 'en_GB';

const createFakeRowObjectData = (index) => ({
  id: 'id_' + index,
  avartar: faker.image.avatar(),
  county: faker.address.county(),
  email: faker.internet.email(),
  title: faker.name.prefix(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  street: faker.address.streetName(),
  zipCode: faker.address.zipCode(),
  date: faker.date.past().toLocaleDateString(),
  bs: faker.company.bs(),
  catchPhrase: faker.company.catchPhrase(),
  companyName: faker.company.companyName(),
  words: faker.lorem.words(),
  sentence: faker.lorem.sentence()
});

const createRows = (numberOfRows) => {
  let rows = [];
  for (let i = 0; i < numberOfRows; i++) {
    rows[i] = createFakeRowObjectData(i);
  }
  return rows;
};

const columns = [
  {
    key: 'id',
    name: 'ID',
    width: 80,
    resizable: true
  },
  {
    key: 'avartar',
    name: 'Avartar',
    width: 60,
    formatter: ImageFormatter,
    draggable: true
  },
  {
    key: 'county',
    name: 'County',
    width: 200,
    draggable: true
  },
  {
    key: 'title',
    name: 'Title',
    width: 200,
    draggable: true
  },
  {
    key: 'firstName',
    name: 'First Name',
    width: 200,
    draggable: true
  },
  {
    key: 'lastName',
    name: 'Last Name',
    width: 200,
    draggable: true
  },
  {
    key: 'email',
    name: 'Email',
    width: 200,
    draggable: true
  },
  {
    key: 'street',
    name: 'Street',
    width: 200,
    draggable: true
  },
  {
    key: 'zipCode',
    name: 'ZipCode',
    width: 200,
    draggable: true
  },
  {
    key: 'date',
    name: 'Date',
    width: 200,
    draggable: true
  },
  {
    key: 'bs',
    name: 'bs',
    draggable: true,
    width: 200
  },
  {
    key: 'catchPhrase',
    name: 'Catch Phrase',
    width: 200,
    draggable: true
  },
  {
    key: 'companyName',
    name: 'Company Name',
    width: 200,
    draggable: true
  },
  {
    key: 'sentence',
    name: 'Sentence',
    width: 200,
    draggable: true
  }
];

const CustomToolbar = React.createClass({
  propTypes: {
    groupBy: React.PropTypes.array.isRequired,
    onColumnGroupAdded: React.PropTypes.func.isRequired,
    onColumnGroupDeleted: React.PropTypes.func.isRequired
  },

  render() {
    return (<Toolbar>
      <GroupedColumnsPanel groupBy={this.props.groupBy} onColumnGroupAdded={this.props.onColumnGroupAdded} onColumnGroupDeleted={this.props.onColumnGroupDeleted}/>
      </Toolbar>);
  }
});

const CustomRowGroupRenderer = React.createClass({
  renderColumns() {
    return this.props.columns.map(column => {
      return (
        <div className="react-grid-Cell" style={{position: 'absolute', width: column.width, height: '35px', left: column.left, contain: 'layout' }}>
          <div className="react-grid-Cell__value">
            {column.key === this.props.columnGroupName ? (
              <div>
                <span className="row-expand-icon" style={{float: 'left', cursor: 'pointer'}} onClick={this.props.onRowExpandClick} >{this.props.isExpanded ? String.fromCharCode('9660') : String.fromCharCode('9658')}</span>
                <strong>{this.props.name}</strong>
              </div>
              ) : ''}
          </div>
        </div>
      );
    });
  },

  render() {
    return (
      <div style={{height: '35px', overflow: 'hidden', contain: 'layout'}} >
        {this.renderColumns()}
      </div>
    );
  }
});

const Example = React.createClass({
  getInitialState() {
    let fakeRows = createRows(2000);
    return {rows: fakeRows, groupBy: [], expandedRows: {}};
  },

  getRows() {
    let rows = Selectors.getRows(this.state);
    return rows;
  },

  getRowAt(index) {
    let rows = this.getRows();
    return rows[index];
  },

  getSize() {
    return this.getRows().length;
  },

  onColumnGroupAdded(colName) {
    let columnGroups = this.state.groupBy.slice(0);
    if (columnGroups.indexOf(colName) === -1) {
      columnGroups.push(colName);
    }
    this.setState({groupBy: columnGroups});
  },

  onColumnGroupDeleted(name) {
    let columnGroups = this.state.groupBy.filter(function(g){return g !== name});
    this.setState({groupBy: columnGroups});
  },

  onRowExpandToggle({ columnGroupName, name, shouldExpand }) {
    let expandedRows = Object.assign({}, this.state.expandedRows);
    expandedRows[columnGroupName] = Object.assign({}, expandedRows[columnGroupName]);
    expandedRows[columnGroupName][name] = {isExpanded: shouldExpand};
    this.setState({expandedRows: expandedRows});
  },

  render() {
    return (
      <DraggableContainer>
          <ReactDataGrid
            ref={ node => this.grid = node }
            enableCellSelect={true}
            enableDragAndDrop={true}
            columns={columns}
            rowGetter={this.getRowAt}
            rowsCount={this.getSize()}
            onRowExpandToggle={this.onRowExpandToggle}
            toolbar={<CustomToolbar groupBy={this.state.groupBy} onColumnGroupAdded={this.onColumnGroupAdded} onColumnGroupDeleted={this.onColumnGroupDeleted}/>}
            rowHeight={50}
            minHeight={600}
            rowGroupRenderer={CustomRowGroupRenderer}
            />
      </DraggableContainer>
    );
  }
});

const exampleDescription = (
  <div>
    <p></p>
  </div>
);

module.exports = exampleWrapper({
  WrappedComponent: Example,
  exampleName: 'Data Grid Tasks',
  exampleDescription,
  examplePath: './scripts/example21-grouping.js',
  examplePlaygroundLink: undefined
});
