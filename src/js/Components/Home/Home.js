import React from "react";
import { withRouter } from "react-router-dom";
import CaseTable from "./CaseTable";
import { Typography, Row, Divider, Col, Button, message } from "antd";
import DrawerDownload from "./DrawerDownload";
import DrawerCreate from "./DrawerCreate";
import Backend from "../../../serviceBackend";
import { PrimButton } from "./HomeStyles";

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
        if (
          // eslint-disable-next-line
          i.consecutive_minute == minute &&
          // eslint-disable-next-line
          i.year == year
        ) {
          newMatches.push(i);
        }
      });
      this.setState({ dataMatches: newMatches });
    }
  };
  showDrawer = (e, drw) => {
    e.preventDefault();
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
  closeDrawer = (e, drw) => {
    e.preventDefault();
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
      <div style={{ marginHorizontal: "50px" }}>
        <Divider style={{ background: "#ffffff00" }} />
        {localStorage.getItem("type") !== "secretary" ? ( //When not secretary:
          <Row
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "10px",
            }}
          >
            <Col span={2} />
            <Col span={10}>
              <Title style={{ marginBottom: "0px" }}>Casos Estudiantiles</Title>
            </Col>
            <Col span={4}>
              <PrimButton>
                <Button
                  block
                  type="primary"
                  icon="download"
                  onClick={(e) => this.showDrawer(e, "Download")}
                  className="generateCM_button"
                >
                  Generar Acta
                </Button>
              </PrimButton>
              <DrawerDownload
                visible={this.state.downloadDrawerVisible}
                onClose={this.closeDrawer}
              />
            </Col>
            <Col span={1} />
            <Col span={4}>
              <PrimButton>
                <Button
                  block
                  type="primary"
                  icon="plus"
                  onClick={(e) => this.showDrawer(e, "Create")}
                  className="createCM_button"
                >
                  Crear un nuevo caso
                </Button>
              </PrimButton>
              <DrawerCreate
                visible={this.state.createDrawerVisible}
                onClose={this.closeDrawer}
              />
            </Col>
          </Row> //When secretary:
        ) : (
          <Row
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "10px",
            }}
          >
            <Col span={2} />
            <Col span={10}>
              <Title style={{ marginBottom: "0px" }}>Casos Estudiantiles</Title>
            </Col>
            <Col span={1} />
            <Col span={4}>
              <PrimButton>
                <Button
                  block
                  type="primary"
                  icon="plus"
                  onClick={(e) => this.showDrawer(e, "Create")}
                  className="createCM_button"
                >
                  Crear un nuevo caso
                </Button>
              </PrimButton>
              <DrawerCreate
                visible={this.state.createDrawerVisible}
                onClose={this.closeDrawer}
              />
            </Col>
          </Row>
        )}
        <Row>
          <CaseTable
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
