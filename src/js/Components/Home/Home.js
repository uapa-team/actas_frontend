import React from "react";
import { withRouter } from "react-router-dom";
import CaseTable from "../CaseTable/CaseTable";
import { Typography, Row, Divider, Col, Button } from "antd";
import Search from "antd/lib/input/Search";
import DrawerDownload from "./DrawerDownload";
import DrawerCreate from "./DrawerCreate";
import auth from "../../../auth";
import BackEndUrl from "../../../backendurl";

const { Title } = Typography;

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.closeDrawer = this.closeDrawer.bind(this);
    this.state = {
      dataSource: [],
      dataMatches: [],
      searchTerm: "",
      downloadDrawerVisible: false,
      createDrawerVisible: false
    };
  }
  performSearch = keyTerm => {
    this.setState({ searchTerm: keyTerm });
    let matches = [];
    this.state.dataSource.forEach(i => {
      if (i.student_dni.includes(keyTerm)) {
        matches.push(i);
      }
    });
    this.setState({ dataMatches: matches });
  };
  showDrawer = (e, drw) => {
    e.preventDefault();
    if (drw === "Create") {
      this.setState({
        createDrawerVisible: true
      });
    } else if (drw === "Download") {
      this.setState({
        downloadDrawerVisible: true
      });
    }
  };
  closeDrawer = (e, drw) => {
    e.preventDefault();
    console.log(drw);
    if (drw === "Create") {
      this.setState({
        createDrawerVisible: false
      });
    } else if (drw === "Download") {
      this.setState({
        downloadDrawerVisible: false
      });
    }
  };

  render() {
    return (
      <div style={{ marginHorizontal: "50px" }}>
        <Divider />
        <Row>
          <Col span={12}>
            <Title>Casos Estudiantiles</Title>
          </Col>
          <Col span={4}>
            <Button
              type="primary"
              icon="download"
              onClick={e => this.showDrawer(e, "Download")}
            >
              Generar Acta
            </Button>
            <DrawerDownload
              visible={this.state.downloadDrawerVisible}
              onClose={this.closeDrawer}
            />
          </Col>
          <Col span={4}>
            <Button
              type="primary"
              icon="plus"
              onClick={e => this.showDrawer(e, "Create")}
            >
              Crear un nuevo caso
            </Button>
            <DrawerCreate
              visible={this.state.createDrawerVisible}
              onClose={this.closeDrawer}
            />
          </Col>
          <Col span={4}>
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
      .then(data => {
        this.setState({ dataSource: data["cases"] });
      });
  }
}

export default withRouter(Home);
