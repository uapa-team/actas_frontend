import React from "react";
import { Tabs, Col, Row } from "antd";
import { withRouter } from "react-router-dom";
import EditComponent from "./EditComponent";

const { TabPane } = Tabs;

class EditTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: this.props.dataSource,
      metadata: this.props.metadata,
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
    for (const key in this.state.metadata) {
      if (this.state.metadata.hasOwnProperty(key)) {
        const element = this.state.metadata[key];
        auxArray.push([key, element]);
      }
    }
    this.currentlyFilling++;
    return <Row gutter={8}>{auxArray.map(this.createInput)}</Row>;
  };

  createInput = (info) => {
    return (
      <Col span={8} key={info[0].concat(this.currentlyFilling)}>
        <EditComponent
          key={info[0].concat(this.currentlyFilling)}
          fieldName={info[0].concat(this.currentlyFilling)}
          metadata={info[1]}
        />
      </Col>
    );
  };

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  };

  onChange = (activeKey) => {
    this.setState({ activeKey });
  };

  add = () => {
    console.log(this.state.panes);
    const { panes } = this.state;
    const newKey = (++this.currentlyFilling).toString();
    const newPanes = [...panes];

    var auxArray = [];
    var mdata = this.state.metadata;
    for (var key in mdata) {
      if (mdata.hasOwnProperty(key)) {
        auxArray.push([key, mdata[key]]);
      }
    }

    var components = <Row gutter={8}>{auxArray.map(this.createInput)}</Row>;

    newPanes.push({
      title: "Asignatura ".concat(this.currentlyFilling),
      key: newKey,
      content: components,
    });
    this.setState({
      panes: newPanes,
      activeKey: newKey,
    });
    console.log(this.state.activeKey);
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
      >
        {this.state.panes.map((pane) => (
          <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>
            {pane.content}
          </TabPane>
        ))}
      </Tabs>
    );
  }
}

export default withRouter(EditTabs);
