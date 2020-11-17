import React from "react";
import { Tabs, Row } from "antd";
import { withRouter } from "react-router-dom";
import EditComponent from "./EditComponent";
import _ from "lodash";

const { TabPane } = Tabs;

class EditTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: this.props.dataSource,
      metadata: this.props.metadata,
      name: this.props.name,
      activeKey: "1",
      panes: [],
    };
  }
  currentlyFilling = 0;

  componentDidMount() {
    var dataFormat = [];

    for (let i = 0; i < this.state.dataSource.length; i++) {
      dataFormat.push({
        title: "Asignatura ".concat(this.currentlyFilling + 1),
        key: (i + 1).toString(),
        content: this.drawFields(),
      });
    }

    this.setState({ panes: dataFormat });
  }

  drawFields = () => {
    let auxArray = [];
    for (let key in this.state.metadata) {
      if (this.state.metadata.hasOwnProperty(key)) {
        let element = _.cloneDeep(this.state.metadata[key]);
        let current = this.state.dataSource[this.currentlyFilling]
        if (current.hasOwnProperty("cases")) {
          element.default = current.cases[0][key];
        } else if (current[0].hasOwnProperty("_cls") && current[0]._cls == "Subject") {
          element.default = current[0][key]
        }
        auxArray.push([key, element]);
      }
    }
    this.currentlyFilling++;
    let aux2Array = _.cloneDeep(auxArray);
    return <Row gutter={8}>{aux2Array.map(this.createInput)}</Row>;
  };

  createInput = (info) => {
    let name = _.cloneDeep(this.state.name);
    let key = name.concat(info[0].concat(this.currentlyFilling));
    let md = info[1];
    return <EditComponent key={key} fieldName={key} metadata={md} />;
  };

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  };

  onChange = (activeKey) => {
    this.setState({ activeKey });
  };

  add = () => {
    const { panes } = this.state;
    const newKey = (++this.currentlyFilling).toString();
    const newPanes = [...panes];

    var auxArray = [];
    var mdata = _.cloneDeep(this.state.metadata);
    for (var key in mdata) {
      if (mdata.hasOwnProperty(key)) {
        auxArray.push([key, mdata[key]]);
      }
    }

    let aux2Array = _.cloneDeep(auxArray);
    let components = <Row gutter={8}>{aux2Array.map(this.createInput)}</Row>;

    newPanes.push({
      title: "Asignatura ".concat(this.currentlyFilling),
      key: newKey,
      content: components,
    });
    this.setState({
      panes: newPanes,
      activeKey: newKey,
    });
  };

  remove = (targetKey) => {
    let { activeKey } = this.state;
    let lastIndex;
    this.state.panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const panes = this.state.panes.filter((pane) => pane.key !== targetKey);
    if (panes.length && activeKey === targetKey) {
      if (lastIndex >= 0) {
        activeKey = panes[lastIndex].key;
      } else {
        activeKey = panes[0].key;
      }
    }
    this.setState({ panes, activeKey });
  };

  render() {
    return (
      <Tabs
        type="editable-card"
        onChange={this.onChange}
        activeKey={this.state.activeKey}
        onEdit={this.onEdit}
        size={"small"}
      >
        {this.state.panes.map((pane) => (
          <TabPane
            tab={pane.title}
            key={pane.key}
            closable={pane.closable}
            forceRender={true}
          >
            {pane.content}
          </TabPane>
        ))}
      </Tabs>
    );
  }
}

export default withRouter(EditTabs);
