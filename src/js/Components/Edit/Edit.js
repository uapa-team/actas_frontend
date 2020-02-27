import React from "react";
import { withRouter } from "react-router-dom";
import {
  Form,
  Row,
  Divider,
  Typography,
  Button,
  Popconfirm,
  message
} from "antd";
import MutableComponent from "./MutableComponent";
import MutableTable from "./MutableTable";
import Backend from "../../../serviceBackend";
import Columns from "react-columns";
import Functions from "../../../Functions";

const { Title } = Typography;

class Edit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      case: {},
      full_name: "",
      decision_maker: "",
      fields: [],
      cls: "",
      id: this.props.match.params.id
    };
  }
  createInputs = () => {
    return this.state.fields.map(this.createInput);
  };
  createInput = i => {
    if (
      typeof this.state.case[i[0]] !== "undefined" &&
      this.state.case[i[0]] !== ""
    ) {
      i[1].default = this.state.case[i[0]];
    }
    return (
      <MutableComponent
        key={i[0]}
        fieldName={i[0]}
        metadata={i[1]}
        form={this.props.form}
      />
    );
  };
  createTables = () => {
    return this.state.fields.map(this.createTable);
  };
  createTable = i => {
    if (i[1].type === "Table") {
      if (
        typeof this.state.case[i[0]] !== "undefined" &&
        this.state.case[i[0]] !== ""
      ) {
        i[1].default = Array.from(
          this.state.case[i[0]].map((i, index) => {
            let dirResult = i["cases"][0];
            dirResult["key"] = index;
            return dirResult;
          })
        );
      }
      return (
        <MutableTable
          key={i[0]}
          fieldName={i[0]}
          dataSource={i[1].default}
          metadata={i[1]}
          form={this.props.form}
        />
      );
    }
  };
  saveCase = e => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
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
          items: [values]
        })
          .then(response => {
            if (response.status === 200) {
              message.success({
                content: "Cambios guardados exitosamente.",
                key
              });
            } else if (response.status === 401) {
              message.error({
                content: "Usuario sin autorización para guardar casos.",
                key
              });
            } else {
              message.error({
                content: "Ha habido un error guardando el caso.",
                key
              });
              console.error(
                "Login Error: Backend HTTP code " + response.status
              );
            }
            return response.json();
          })
          .catch(error => {
            message.error({
              content: "Ha habido un error guardando el caso.",
              key
            });
            console.error("Error en guardando el caso");
            console.error(error);
          });
      }
    });
  };

  saveCaseReturn = e => {
    this.saveCase(e);
    this.props.history.push({
      pathname: "/home/"
    });
  };

  render() {
    return (
      <div>
        <Divider style={{ background: "#ffffff00" }} />
        <Row>
          <Columns gap={"50px"} columns={2}>
            <Title>Edición de solicitud</Title>
            <div>
              <Button
                onClick={e => this.saveCase(e)}
                type="primary"
                className="saveCaseButton"
                icon="save"
              >
                Guardar
              </Button>
              <Button
                onClick={e => this.saveCaseReturn(e)}
                type="primary"
                className="saveCaseButton"
                icon="save"
              >
                Guardar y volver
              </Button>
              <Popconfirm
                title="¿Qué tipo de vista previa desea generar?"
                onConfirm={() => Functions.generateCouncil(false, this.state.id)}
                onCancel={() => Functions.generateCouncil(true, this.state.id)}
                okText="Consejo"
                cancelText="Comité"
                placement="right"
              >
                <Button type="primary" icon="eye">
                  Vista Previa
                </Button>
              </Popconfirm>
            </div>
          </Columns>
        </Row>
        <Row>
          <Form>
            <Columns gap={"50px"} columns={2}>
              {this.createInputs()}
            </Columns>
            <Divider style={{ background: "#ffffff00" }} />
            {this.createTables()}
          </Form>
        </Row>
        <Divider />
      </div>
    );
  }
  componentDidMount() {
    Backend.sendRequest("GET", `case?id=${this.state.id}`)
      .then(response => response.json())
      .then(json => {
        this.setState({ case: json["cases"][0] });
        Backend.sendRequest(
          "GET",
          `infocase?cls=${json.cases[0]._cls.split(".")[1]}`
        )
          .then(response => response.json())
          .then(data => {
            this.setState({ full_name: data.full_name });
            this.setState({ decision_maker: data.decision_maker });
            delete data.full_name;
            delete data.decision_maker;
            this.setState({ fields: Object.entries(data) });
          });
      });
  }
}

const WrappedCreateForm = Form.create({ name: "normal_create" })(Edit);
export default withRouter(WrappedCreateForm);
