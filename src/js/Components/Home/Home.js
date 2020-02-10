import React from "react";
import { withRouter } from "react-router-dom";
import CaseTable from "../CaseTable/CaseTable";
import {
  Typography,
  Row,
  Divider,
  Col,
  Button,
  Switch,
  InputNumber,
  Tooltip
} from "antd";
import Search from "antd/lib/input/Search";
import DrawerDownload from "./DrawerDownload";
import DrawerCreate from "./DrawerCreate";
import auth from "../../../auth";
import BackEndUrl from "../../../backendurl";

const { Title, Text } = Typography;

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.closeDrawer = this.closeDrawer.bind(this);
    this.state = {
      dataSource: [],
      dataMatches: [],
      searchTerm: "",
      downloadDrawerVisible: false,
      createDrawerVisible: false,
      filterByMinute: true,
      minuteSearch: 1,
      yearSearch: 2020
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
        <Divider style={{ background: "#ffffff00" }} />
        <Row
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "10px"
          }}
        >
          <Col span={7}>
            <Title style={{ marginBottom: "0px" }}>Casos Estudiantiles</Title>
          </Col>
          <Col span={3}>
            <Button
              block
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
          <Col span={1} />
          <Col span={3}>
            <Button
              block
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
          <Col span={2} style={{ textAlignLast: "center" }}>
            <Tooltip title="Filtar por número de acta">
              <Switch
                defaultChecked
                onChange={checked => this.setState({ filterByMinute: checked })}
              />
            </Tooltip>
          </Col>
          <Col span={2}>
            <InputNumber
              disabled={!this.state.filterByMinute}
              min={0}
              defaultValue={1}
              onChange={value => this.setState({ minuteSearch: value })}
            />
          </Col>
          <Col span={2}>
            <InputNumber
              disabled={!this.state.filterByMinute}
              min={2000}
              defaultValue={2020}
              onChange={value => this.setState({ yearSearch: value })}
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
        <Divider style={{ background: "#ffffff00" }} />
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
