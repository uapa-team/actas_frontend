import React from "react";
import { Tabs, Col, Row } from "antd";
import { withRouter } from "react-router-dom";
import EditComponent from "./EditComponent";

const { TabPane } = Tabs;

const initialPanes = [
  { title: "Cargando...", content: "Cargando...", key: "0" },
];

class EditTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: this.props.dataSource,
      metadata: this.props.metadata,
      activeKey: initialPanes[0].key,
      panes: initialPanes,
    };
  }
  newTabIndex = 0;

  componentDidMount() {
    var dataFormat = [];

    for (let i = 0; i < this.state.dataSource.length; i++) {
      dataFormat.push({
        title: "Asignatura ".concat(this.newTabIndex + 1),
        key: this.newTabIndex++,
        content: this.drawFields(i),
      });
    }

    this.setState({
      panes: dataFormat,
    });
  }

  drawFields = (pos) => {
    let auxArray = [];
    for (const key in this.state.metadata) {
      if (this.state.metadata.hasOwnProperty(key)) {
        const element = this.state.metadata[key];
        auxArray.push([key, element]);
      }
    }
    return <Row gutter={8}>{auxArray.map(this.createInput)}</Row>;
  };

  createInput = (info) => {
    return (
      <Col span={8} key={info[0].concat(this.newTabIndex - 1)}>
        <EditComponent
          key={info[0].concat(this.newTabIndex - 1)}
          fieldName={info[0].concat(this.newTabIndex - 1)}
          metadata={info[1]}
        />
      </Col>
    );
  };

  onChange = (activeKey) => {
    console.log(activeKey);
    this.setState({ activeKey });
  };

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  };

  add = () => {
    const { panes } = this.state;
    const tempKey = this.newTabIndex++;
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
      title: "Asignatura ".concat(tempKey + 1),
      key: tempKey,
      content: components,
    });

    this.setState({
      panes: newPanes,
      activeKey: tempKey,
    });
  };

  remove = (targetKey) => {
    const { panes, activeKey } = this.state;
    let newActiveKey = activeKey;
    let lastIndex;
    panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = panes.filter((pane) => pane.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    this.setState({
      panes: newPanes,
      activeKey: newActiveKey,
    });
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
