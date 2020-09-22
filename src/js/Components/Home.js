import React from "react";
import { withRouter } from "react-router-dom";
import HomeCaseTable from "./HomeCaseTable";
import { DownloadOutlined, PlusOutlined } from "@ant-design/icons";
import { Typography, Row, Divider, Col, Button, message } from "antd";
import HomeDrawerDownload from "./HomeDrawerDownload";
import HomeDrawerCreate from "./HomeDrawerCreate";
import Backend from "../Basics/Backend";
import "../../css/index.css";

const { Title } = Typography;

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.closeDrawer = this.closeDrawer.bind(this);
    this.updateDataSource = this.updateDataSource.bind(this);
    this.state = {
      dataSource: [],
      dataMatches: [],
      searchTerm: "",
      downloadDrawerVisible: false,
      createDrawerVisible: false,
      filterByMinute: false,
      minuteSearch: 1,
      yearSearch: 2020,
    };
  }

  updateDataSource = (id) => {
    var newDataSource = this.state.dataSource;
    newDataSource.forEach((item) => {
      if (item.id === id) {
        item.received_date = "Recibido";
      }
    });
    this.setState({
      dataSource: newDataSource,
    });
  };

  performSearch = (keyTerm) => {
    this.setState({ searchTerm: keyTerm });
    this.setState({ filterByMinute: false });
    let matches = [];
    this.state.dataSource.forEach((i) => {
      if (i.student_dni.includes(keyTerm)) {
        matches.push(i);
      }
    });
    this.setState({ dataMatches: matches });
  };

  filerByMinute = (checked, minute, year) => {
    this.setState({ filterByMinute: checked });
    this.setState({ minuteSearch: minute });
    this.setState({ yearSearch: year });
    this.setState({ searchTerm: "" });
    let newMatches = [];
    if (checked) {
      this.state.dataSource.forEach((i) => {
        if (i.consecutive_minute === minute && i.year === year) {
          newMatches.push(i);
        }
      });
      this.setState({ dataMatches: newMatches });
    }
  };

  showDrawer = (drw) => {
    if (drw === "Create") {
      this.setState({
        createDrawerVisible: true,
      });
    } else if (drw === "Download") {
      this.setState({
        downloadDrawerVisible: true,
      });
    }
  };

  closeDrawer = (drw) => {
    if (drw === "Create") {
      this.setState({
        createDrawerVisible: false,
      });
    } else if (drw === "Download") {
      this.setState({
        downloadDrawerVisible: false,
      });
    }
  };

  render() {
    return (
      <div>
        <Divider style={{ background: "#ffffff00" }} />
        {localStorage.getItem("type") !== "secretary" ? ( //When not secretary:
          <Row className="home-main-row">
            <Col span={2} />
            <Col span={10}>
              <Title className="home-title">Casos Estudiantiles</Title>
            </Col>
            <Col span={4}>
              <Button
                block
                type="primary"
                icon={<DownloadOutlined />}
                onClick={(e) => this.showDrawer("Download")}
              >
                Generar Acta
              </Button>
              <HomeDrawerDownload
                visible={this.state.downloadDrawerVisible}
                onClose={(e) => this.closeDrawer("Download")}
              />
            </Col>
            <Col span={1} />
            <Col span={4}>
              <Button
                block
                type="primary"
                icon={<PlusOutlined />}
                onClick={(e) => this.showDrawer("Create")}
              >
                Crear un nuevo caso
              </Button>
              <HomeDrawerCreate
                visible={this.state.createDrawerVisible}
                onClose={(e) => this.closeDrawer("Create")}
              />
            </Col>
          </Row>
        ) : (
          //When secretary:
          <Row className="home-main-row">
            <Col span={2} />
            <Col span={10}>
              <Title className="home-title">Casos Estudiantiles</Title>
            </Col>
            <Col span={1} />
            <Col span={4}>
              <Button
                block
                type="primary"
                icon={<PlusOutlined />}
                onClick={(e) => this.showDrawer("Create")}
                className="createCM_button"
              >
                Crear un nuevo caso
              </Button>
              <HomeDrawerCreate
                visible={this.state.createDrawerVisible}
                onClose={this.closeDrawer("Create")}
              />
            </Col>
          </Row>
        )}
        <Divider style={{ background: "#ffffff00" }} />
        <Row>
          <HomeCaseTable
            updateDataSource={this.updateDataSource}
            dataSource={
              this.state.searchTerm === "" && !this.state.filterByMinute
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
    message.loading("Cargando casos...", 7);
    Backend.sendRequest("GET", "case")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ dataSource: data["cases"] });
        message.success("Casos cargados correctamente.");
      });
  }
}

export default withRouter(Home);
