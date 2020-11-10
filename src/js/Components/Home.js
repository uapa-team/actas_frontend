import React from "react";
import { withRouter } from "react-router-dom";
import HomeCaseTable from "./HomeCaseTable";
import {
  DownloadOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
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
    this.pagChange = this.pagChange.bind(this);
    this.findCases = this.findCases.bind(this);
    this.cleanQuery = this.cleanQuery.bind(this);
    this.makeCasesQuery = this.makeCasesQuery.bind(this);
    this.caseFilter = "&_cls_display__icontains=";
    this.idFilter = "&student_dni__istartswith=";
    this.nameFilter = "&student_name__icontains=";
    this.programFilter = "&academic_program__icontains=";
    this.cmFilter = "&consecutive_minute=";
    this.yearFilter = "&year=";
    this.periodFilter = "&academic_period__icontains=";
    this.state = {
      dataSource: [],
      downloadDrawerVisible: false,
      createDrawerVisible: false,
      filterByMinute: false,
      minuteSearch: 1,
      yearSearch: 2020,
      loading: true,
      page: 1,
      pageSize: 10,
      searchQuery: "cases?",
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

  makeCasesQuery = (callback) => {
    Backend.sendRequest("POST", this.state.searchQuery, {
      page_number: this.state.page,
      page_size: this.state.pageSize,
    })
      .then((response) => response.json())
      .then((data) => {
        let totalCases = data["total_cases"];
        let casesLoaded = data["cases"];
        if (totalCases !== casesLoaded.length) {
          if (this.state.page > 1) {
            let auxArray = new Array(
              (this.state.page - 1) * this.state.pageSize
            );
            auxArray.fill({});
            casesLoaded = auxArray.concat(casesLoaded);
          }
          if (totalCases !== casesLoaded.length) {
            let auxArray = new Array(totalCases - casesLoaded.length);
            auxArray.fill({});
            casesLoaded = casesLoaded.concat(auxArray);
          }
        }
        this.setState({ dataSource: casesLoaded, loading: false });
        if (typeof callback === "function") {
          callback();
        }
      });
    return true;
  };

  pagChange = (currentPage, pageSize) => {
    this.setState(
      {
        loading: true,
        page: currentPage,
        pageSize: pageSize,
      },
      () => this.makeCasesQuery()
    );
  };

  findCases = (selectedKeys, dataIndex) => {
    let query = this.state.searchQuery;
    let exp = "[^&$]*";
    let newQuery = "";

    if (dataIndex === "_cls_display") {
      let reg = new RegExp(this.caseFilter.concat(exp));
      newQuery = query.replace(reg, "");
      newQuery = newQuery.concat(this.caseFilter.concat(selectedKeys[0]));
    } else if (dataIndex === "student_dni") {
      let reg = new RegExp(this.idFilter.concat(exp));
      newQuery = query.replace(reg, "");
      newQuery = newQuery.concat(this.idFilter.concat(selectedKeys[0]));
    } else if (dataIndex === "student_name") {
      let reg = new RegExp(this.nameFilter.concat(exp));
      newQuery = query.replace(reg, "");
      newQuery = newQuery.concat(this.nameFilter.concat(selectedKeys[0]));
    } else if (dataIndex === "academic_program") {
      let reg = new RegExp(this.programFilter.concat(exp));
      newQuery = query.replace(reg, "");
      newQuery = newQuery.concat(this.programFilter.concat(selectedKeys[0]));
    } else if (dataIndex === "consecutive_minute") {
      let isnum = /^\d*$/.test(selectedKeys[0]);
      let reg = new RegExp(this.cmFilter.concat(exp));
      newQuery = query.replace(reg, "");
      if (isnum) {
        newQuery = newQuery.concat(this.cmFilter.concat(selectedKeys[0]));
      } else {
        newQuery = newQuery.concat(this.cmFilter.concat("-1"));
      }
    } else if (dataIndex === "year") {
      let isnum = /^\d*$/.test(selectedKeys[0]);
      let reg = new RegExp(this.yearFilter.concat(exp));
      newQuery = query.replace(reg, "");
      if (isnum) {
        newQuery = newQuery.concat(this.yearFilter.concat(selectedKeys[0]));
      } else {
        newQuery = newQuery.concat(this.yearFilter.concat("-1"));
      }
    } else if (dataIndex === "academic_period") {
      let reg = new RegExp(this.periodFilter.concat(exp));
      newQuery = query.replace(reg, "");
      newQuery = newQuery.concat(this.periodFilter.concat(selectedKeys[0]));
    }

    this.setState({
      searchQuery: newQuery,
    });
  };

  cleanQuery = (dataIndex) => {
    let query = this.state.searchQuery;
    let exp = "[^&$]*";
    let newQuery = "";

    if (dataIndex === "_cls_display") {
      let reg = new RegExp(this.caseFilter.concat(exp));
      newQuery = query.replace(reg, "");
    } else if (dataIndex === "student_dni") {
      let reg = new RegExp(this.idFilter.concat(exp));
      newQuery = query.replace(reg, "");
    } else if (dataIndex === "student_name") {
      let reg = new RegExp(this.nameFilter.concat(exp));
      newQuery = query.replace(reg, "");
    } else if (dataIndex === "academic_program") {
      let reg = new RegExp(this.programFilter.concat(exp));
      newQuery = query.replace(reg, "");
    } else if (dataIndex === "consecutive_minute") {
      let reg = new RegExp(this.cmFilter.concat(exp));
      newQuery = query.replace(reg, "");
    } else if (dataIndex === "year") {
      let reg = new RegExp(this.yearFilter.concat(exp));
      newQuery = query.replace(reg, "");
    } else if (dataIndex === "academic_period") {
      let reg = new RegExp(this.periodFilter.concat(exp));
      newQuery = query.replace(reg, "");
    }

    this.setState(
      {
        searchQuery: newQuery,
      },
      () => this.makeCasesQuery()
    );
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

  updateCases() {
    let key = "updatable";
    this.setState({ loading: true });
    message.loading({ content: "Actualizando casos...", key, duration: 50 });
    this.makeCasesQuery(
      message.success({
        content: "Casos actualizados correctamente.",
        key,
        duration: 2,
      })
    );
  }

  componentDidMount() {
    let key = "updatable";
    message.loading({ content: "Cargando casos...", key, duration: 50 });
    this.makeCasesQuery(
      message.success({
        content: "Casos cargados correctamente.",
        key,
        duration: 2,
      })
    );
  }

  render() {
    return (
      <div>
        <Divider style={{ background: "#ffffff00" }} />
        {localStorage.getItem("type") !== "secretary" ? ( //When not secretary:
          <Row gutter={8} className="home-main-row">
            <Col span={2} />
            <Col span={10}>
              <Title className="home-title">Casos Estudiantiles</Title>
            </Col>
            <Col span={3}>
              <Button
                block
                type="primary"
                icon={<ReloadOutlined />}
                onClick={() => this.updateCases()}
                disabled={this.state.loading}
              >
                Actualizar casos
              </Button>
            </Col>
            <Col span={3}>
              <Button
                block
                type="primary"
                icon={<PlusOutlined />}
                onClick={(e) => this.showDrawer("Create")}
              >
                Crear nuevo caso
              </Button>
              <HomeDrawerCreate
                visible={this.state.createDrawerVisible}
                makeCasesQuery={this.makeCasesQuery}
                onClose={(e) => this.closeDrawer("Create")}
              />
            </Col>
            <Col span={3}>
              <Button
                block
                type="primary"
                icon={<DownloadOutlined />}
                onClick={(e) => this.showDrawer("Download")}
              >
                Generar acta
              </Button>
              <HomeDrawerDownload
                visible={this.state.downloadDrawerVisible}
                onClose={(e) => this.closeDrawer("Download")}
              />
            </Col>
          </Row>
        ) : (
          //When secretary:
          <Row gutter={8} className="home-main-row">
            <Col span={2} />
            <Col span={10}>
              <Title className="home-title">Casos Estudiantiles</Title>
            </Col>
            <Col span={2} />
            <Col span={3}>
              <Button
                block
                type="primary"
                icon={<ReloadOutlined />}
                onClick={() => this.updateCases()}
                disabled={this.state.loading}
              >
                Actualizar casos
              </Button>
            </Col>
            <Col span={3}>
              <Button
                block
                type="primary"
                icon={<PlusOutlined />}
                onClick={(e) => this.showDrawer("Create")}
              >
                Crear nuevo caso
              </Button>
              <HomeDrawerCreate
                visible={this.state.createDrawerVisible}
                makeCasesQuery={this.makeCasesQuery}
                onClose={(e) => this.closeDrawer("Create")}
              />
            </Col>
          </Row>
        )}
        <Divider style={{ background: "#ffffff00" }} />
        <Row>
          <HomeCaseTable
            updateDataSource={this.updateDataSource}
            pagChange={this.pagChange}
            findCases={this.findCases}
            cleanQuery={this.cleanQuery}
            makeCasesQuery={this.makeCasesQuery}
            loading={this.state.loading}
            dataSource={this.state.dataSource}
          />
        </Row>
        <Divider style={{ background: "#ffffff00" }} />
      </div>
    );
  }
}

export default withRouter(Home);
