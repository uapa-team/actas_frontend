import React from "react";
import { withRouter } from "react-router-dom";
import CaseTable from "../CaseTable/CaseTable";
import { Typography, Row, Divider, Col, Input, Icon } from "antd";
import Search from "antd/lib/input/Search";
import auth from "../../../auth";
import BackEndUrl from "../../../backendurl";

const { Title } = Typography;

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      dataMatches: [],
      searchTerm: ""
    };
  }
  performSearch = keyTerm => {
    let matches = [];
    this.state.dataSource.forEach(i => {
      if (i.student_dni.includes(this.state.searchTerm)) {
        matches.push(i);
      }
    });
    this.setState({ searchTerm: keyTerm, dataMatches: matches });
  };
  render() {
    return (
      <div style={{ marginHorizontal: "50px" }}>
        <Divider />
        <Row>
          <Col span={12}>
            <Title>Casos Estudiantiles</Title>
          </Col>
          <Col span={12}>
            <Search
              placeholder="Documento"
              onSearch={v => this.performSearch(v)}
            />
          </Col>
        </Row>
        <Row>
          <CaseTable
            dataSource={
              this.state.searchTerm === ""
                ? this.state.dataSource
                : this.state.dataMatches
            }
          />
        </Row>
        <Divider />
      </div>
    );
  }
  componentDidMount() {
    fetch(BackEndUrl + "case", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Token " + auth.getToken()
      }
    })
      .then(response => response.json())
      .then(data => this.setState({ dataSource: data["cases"] }));
  }
}

export default withRouter(Home);
