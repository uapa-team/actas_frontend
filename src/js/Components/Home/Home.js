import React from "react";
import { withRouter } from "react-router-dom";
import CaseTable from "../CaseTable/CaseTable";
import { Typography, Row, Divider } from "antd";

const { Title } = Typography;

class Home extends React.Component {
  render() {
    return (
      <div style={{ marginHorizontal: "50px" }}>
        <Divider />
        <Row>
          <Title>Casos Estudiantiles</Title>
        </Row>
        <Row>
          <CaseTable />
        </Row>
        <Divider />
      </div>
    );
  }
}

export default withRouter(Home);
