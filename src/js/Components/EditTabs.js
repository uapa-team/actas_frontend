import React from "react";
import { Tabs, Col } from "antd";
import { withRouter } from "react-router-dom";
import EditComponent from "./EditComponent";

const { TabPane } = Tabs;

const initialPanes = [];

class EditTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: this.props.dataSource,
      metadata: this.props.metadata,
      activeKey: 0,
      fillIndicator: 0,
      panes: initialPanes,
    };
  }
  newTabIndex = 0;

  componentDidMount() {
    var dataFormat = [];

    this.state.dataSource.forEach((element) => {
      dataFormat.push({
        title: element.name,
        content: this.drawFields(element),
        key: element.code,
      });
    });

    this.setState({
      panes: dataFormat,
    });
  }

  drawFields = (element) => {
    var mdata = this.state.metadata.fields;
    var auxArray = [];

    for (var key in mdata) {
      if (mdata.hasOwnProperty(key)) {
        mdata[key].default = element[key];
        auxArray.push([key, mdata[key]]);
      }
      console.log(auxArray);
    }
    return auxArray.map(this.createInput);
  };

  createInput = (i) => {
    return (
      <Col span={8}>
        <EditComponent fieldName={i[0]} metadata={i[1]} />
      </Col>
    );
  };

  onChange = (activeKey) => {
    this.setState({ activeKey });
  };

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  };

  add = () => {
    const { panes } = this.state;
    const activeKey = `newTab${this.newTabIndex++}`;
    const newPanes = [...panes];
    newPanes.push({
      title: "Nueva entrada",
      content: "Content of new Tab",
      key: activeKey,
    });
    this.setState({
      panes: newPanes,
      activeKey,
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
    const { panes, activeKey } = this.state;
    return (
      <Tabs
        type="editable-card"
        onChange={this.onChange}
        activeKey={activeKey}
        onEdit={this.onEdit}
      >
        {panes.map((pane) => (
          <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>
            {pane.content}
          </TabPane>
        ))}
      </Tabs>
    );
  }
}

export default withRouter(EditTabs);
