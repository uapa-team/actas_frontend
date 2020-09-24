import React from "react";
import { withRouter } from "react-router-dom";
import {
  EyeOutlined,
  SaveOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import {
  Row,
  Col,
  Divider,
  Typography,
  Button,
  Popconfirm,
  message,
  Form,
} from "antd";
import EditComponent from "./EditComponent";
import EditTabs from "./EditTabs";
import Backend from "../Basics/Backend";

const { Title, Text } = Typography;

class Edit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      case: {},
      full_name: "",
      decision_maker: "",
      fields: [],
      cls: "",
      id: this.props.match.params.id,
      fillIndicator: 0,
      visibleFlag: false,
    };
  }

  createInputs = () => {
    return <Row gutter={8}>{this.state.fields.map(this.createInput)}</Row>;
  };

  createTabs = () => {
    return <Row gutter={8}>{this.state.fields.map(this.createTab)}</Row>;
  };

  createInput = (i) => {
    if (
      typeof this.state.case[i[0]] !== "undefined" &&
      this.state.case[i[0]] !== ""
    ) {
      i[1].default = this.state.case[i[0]];
    }
    if (i[1].type !== "Table") {
      return (
        <Col span={8} key={i[0]}>
          <EditComponent
            key={i[0]}
            fieldName={i[0]}
            metadata={i[1]}
            form={this.props.form}
          />
        </Col>
      );
    }
  };

  createTab = (i) => {
    if (i[1].type === "Table") {
      return (
        <Col span={24} key={i[0]}>
          <Title level={5}>{i[1].display.concat(":")}</Title>
          <EditTabs
            key={i[0]}
            dataSource={i[1].default}
            metadata={i[1].fields}
          />
        </Col>
      );
    }
  };

  saveCase = (values) => {
    const key = "updatable";
    message.loading({ content: "Guardando cambios...", key });

    values["id"] = this.state.id;
    for (var i in values) {
      if (
        typeof values[i] !== "undefined" &&
        values[i]._isAMomentObject === true
      ) {
        values[i] = values[i].utc().format();
      }
    }

    Backend.sendRequest("PATCH", "case", {
      items: [values],
    })
      .then((response) => {
        if (response.status === 200) {
          message.success({
            content: "Cambios guardados exitosamente.",
            key,
          });
        } else if (response.status === 401) {
          message.error({
            content: "Usuario sin autorización para guardar casos.",
            key,
          });
        } else {
          message.error({
            content: "Ha habido un error guardando el caso.",
            key,
          });
          console.error("Login Error: Backend HTTP code " + response.status);
        }
        return response.json();
      })
      .catch((error) => {
        message.error({
          content: "Ha habido un error guardando el caso.",
          key,
        });
        console.error("Error en guardando el caso");
        console.error(error);
      });
  };

  saveCaseReturn = (e) => {
    this.saveCase(e);
    this.props.history.push({
      pathname: "/home/",
    });
  };

  componentDidMount() {
    Backend.sendRequest("GET", `case?id=${this.state.id}`)
      .then((response) => response.json())
      .then((json) => {
        this.setState({
          case: json["cases"][0],
        });
        Backend.sendRequest(
          "GET",
          `infocase?cls=${json.cases[0]._cls.split(".")[1]}`
        )
          .then((response) => response.json())
          .then((data) => {
            this.setState({ full_name: data.full_name });
            this.setState({ decision_maker: data.decision_maker });
            delete data.full_name;
            delete data.decision_maker;
            this.setState({ fields: Object.entries(data), visibleFlag: true });
          });
      });
  }

  render() {
    return (
      <>
        <Divider style={{ background: "#ffffff00" }} />
        <Row>
          <Col span={12}>
            <Title className="edit-title">Edición de solicitud</Title>
            {this.state.visibleFlag ? (
              <p className="edit-p">
                <b>Tipo de caso: </b>
                {this.state.full_name}
                <br />
                <b>ID del caso: </b>{" "}
                <Text
                  copyable={{
                    tooltips: ["Copiar ID en el portapapeles", "¡ID Copiado!"],
                  }}
                >
                  {this.state.id}
                </Text>
              </p>
            ) : null}
          </Col>
          <Col span={12}>
            <Button
              onClick={(e) => this.saveCase(e)}
              type="primary"
              className="edit-button"
              icon={<SaveOutlined />}
            >
              Guardar
            </Button>
            <Button
              onClick={(e) => this.saveCaseReturn(e)}
              type="primary"
              className="edit-button"
              icon={<SaveOutlined />}
            >
              Guardar y volver
            </Button>
            <Popconfirm
              title="¿Qué tipo de vista previa desea generar?"
              onConfirm={() => Backend.generateCouncil(false, this.state.id)}
              onCancel={() => Backend.generateCouncil(true, this.state.id)}
              okText="Consejo"
              cancelText="Comité"
              placement="right"
            >
              <Button
                className="edit-button"
                type="primary"
                icon={<EyeOutlined />}
              >
                Vista Previa
              </Button>
            </Popconfirm>
            <Button
              className="edit-button"
              onClick={(e) => {
                this.props.history.push({
                  pathname: "/home/",
                });
              }}
              icon={<CloseCircleOutlined />}
            >
              Volver sin guardar
            </Button>
          </Col>
        </Row>
        <Divider style={{ background: "#ffffff00" }} />
        <Form layout="vertical">
          {this.createInputs()}
          {this.createTabs()}
        </Form>
        <Divider style={{ background: "#ffffff00" }} />
      </>
    );
  }
}

export default withRouter(Edit);
