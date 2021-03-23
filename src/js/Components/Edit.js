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
  List,
} from "antd";
import EditComponent from "./EditComponent";
import EditTabs from "./EditTabs";
import Backend from "../Basics/Backend";

const { Title, Text } = Typography;

class Edit extends React.Component {
  formRef = React.createRef();

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
      return: false,
      notes: "None",
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
        <EditComponent
          key={i[0]}
          fieldName={i[0]}
          metadata={i[1]}
          form={this.props.form}
        />
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
            name={i[0]}
            dataSource={i[1].default}
            metadata={i[1].fields}
          />
        </Col>
      );
    }
  };

  returnTrigger = () => {
    this.setState({
      return: true,
    });
  };

  onFinish = (values) => {
    const key = "updatable";
    message.loading({ content: "Guardando cambios...", key });
    values["id"] = this.state.id;

    //Search, retrieve and format tabs data (and time format fix):
    for (let i = 0; i < this.state.fields.length; i++) {
      let field = this.state.fields[i];

      //Time format fix:
      if (
        typeof values[i] !== "undefined" &&
        values[i]._isAMomentObject === true
      ) {
        values[i] = values[i].utc().format();
      }

      //Table search, retrieve and format process:
      if (field[1].type === "Table") {
        let saveData = {};
        let knownTabs = [];

        for (let value in values) {
          if (value.startsWith(field[0])) {
            let search = value.match(/\d+$/);
            let tabNum = search[0];
            let clean = value.replace(field[0], "");
            let varName = clean.replace(search[0], "");
            if (!knownTabs.includes(tabNum)) {
              knownTabs.push(tabNum);
              saveData[tabNum] = {};
            }
            saveData[tabNum][varName] = values[value];
            delete values[value];
          }
        }
        values[field[0]] = Object.values(saveData);
      }
    }

    //Send request to save case:
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

    //Return to home if the button was clicked:
    if (this.state.return) {
      this.props.history.push({
        pathname: "/home/",
      });
    }
  };

  componentDidMount() {
    Backend.sendRequest("GET", `case?id=${this.state.id}`)
      .then((response) => response.json())
      .then((json) => {
        this.setState({
          case: json["cases"][0],
          notes: json["cases"][0].notes,
        });
        Backend.sendRequest(
          "GET",
          `infocase?cls=${json.cases[0]._cls.split(".").pop()}`
        )
          .then((response) => response.json())
          .then((data) => {
            this.setState({
              full_name: data.full_name,
              decision_maker: data.decision_maker,
            });
            delete data.full_name;
            delete data.decision_maker;
            this.setState({ fields: Object.entries(data), visibleFlag: true });
          });
      });
  }

  renderForm = () => {
    let form = (
      <Form
        onKeyPress={(e) => {
          e.key === "Enter" && e.preventDefault();
        }}
        onFinish={this.onFinish}
        layout="vertical"
        ref={this.formRef}
      >
        <Row>
          <Col span={12}>
            <Title className="edit-title">Edición de solicitud</Title>
            {this.state.visibleFlag ? (
              <div className="edit-p">
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
                <br />
                {this.state.notes !== "None" ? <b>Notas adicionales:</b> : null}
              </div>
            ) : null}
          </Col>
          <Col span={12}>
            <Form.Item>
              <Button
                htmlType="submit"
                type="primary"
                className="edit-button"
                icon={<SaveOutlined />}
              >
                Guardar
              </Button>
              <Button
                onClick={this.returnTrigger}
                htmlType="submit"
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
            </Form.Item>
          </Col>
        </Row>
        {this.state.notes !== "None" ? (
          <List size="small">
            <List.Item>{this.state.notes}</List.Item>
          </List>
        ) : null}
        <Divider style={{ background: "#ffffff00" }} />
        {this.createInputs()}
        {this.createTabs()}
      </Form>
    );
    return form;
  };

  render() {
    return (
      <>
        <Divider style={{ background: "#ffffff00" }} />
        {this.renderForm()}
        <Divider style={{ background: "#ffffff00" }} />
      </>
    );
  }
}

export default withRouter(Edit);
