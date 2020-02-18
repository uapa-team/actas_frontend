import React from "react";
import { withRouter } from "react-router-dom";
import {
  Drawer,
  Form,
  Button,
  Col,
  Row,
  Input,
  InputNumber,
  Select,
  DatePicker,
  message
} from "antd";
import moment from "moment";
import Backend from "../../../serviceBackend";
import { LabelSD } from "./DrawerCreateStyles";
const { Option } = Select;

class DrawerCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      programs: [],
      cases: [],
      periods: [],
      id: undefined
    };
  }

  autofillName = dni => {
    Backend.sendRequest("POST", "autofill", { field: "name", student_dni: dni })
      .then(response => response.json())
      .then(data => {
        if ("student_name" in data)
          this.props.form.setFieldsValue({ student_name: data.student_name });
      });
  };

  handleSave = (e, redirect) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.date = values.date.utc().format();
        this.props.onClose(e, "Create");
        const key = "updatable";
        message.loading({ content: "Guardando caso...", key });
        Backend.sendRequest("POST", "case", {
          items: [values]
        })
          .then(response => {
            this.props.onClose(e, "Create");
            if (response.status === 200) {
              message.success({
                content: "El caso se ha guardado exitosamente.",
                key
              });
            } else if (response.status === 401) {
              message.error({
                content: "Usuario sin autorización para guardar casos.",
                key
              });
              this.setState({ id: undefined });
            } else {
              message.error({
                content: "Ha habido un error guardando el caso.",
                key
              });
              console.error(
                "Login Error: Backend HTTP code " + response.status
              );
              this.setState({ id: undefined });
            }
            return response.json();
          })
          .then(data =>
            redirect(
              data["inserted_items"][0],
              "Request." + this.props.form.getFieldValue("_cls")
            )
          )
          .catch(error => {
            message.error({
              content: "Ha habido un error guardando el caso.",
              key
            });
            console.error("Error en guardando el caso");
            console.error(error);
            this.setState({ id: undefined });
          });
      }
    });
  };

  handleSaveAndEdit = e => {
    e.preventDefault();
    this.handleSave(e, (id, cls) => {
      this.props.history.push({
        pathname: "/edit/" + id,
        state: { _cls: cls }
      });
    });
  };

  selectItem = i => {
    return (
      <Option value={i} key={i}>
        {i}
      </Option>
    );
  };

  selectItemCase = i => {
    return (
      <Option value={i.code} key={i.code}>
        {i.name}
      </Option>
    );
  };

  menuJSPrograms = () => {
    return this.state.programs.map(this.selectItem);
  };

  menuJSPperiods = () => {
    return this.state.periods.map(this.selectItem);
  };

  menuJSCases = () => {
    return this.state.cases.map(this.selectItemCase);
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Drawer
        title="Crear un nuevo caso"
        width={"40%"}
        onClose={e => this.props.onClose(e, "Create")}
        visible={this.props.visible}
        bodyStyle={{ paddingBottom: 80, paddingRight: 60 }}
      >
        <Form onSubmit={this.handleSubmit} layout="vertical">
          <Row>
            <Col>
              <Form.Item label="Documento Estudiante">
                {getFieldDecorator(
                  "student_dni",
                  {}
                )(
                  <LabelSD>
                    <Input
                      addonBefore={
                        <Form.Item>
                          {getFieldDecorator("student_dni_type", {
                            initialValue: "CC"
                          })(
                            <Select
                              style={{ width: "5em" }}
                              key="student_dni_type"
                            >
                              <Option value="Cédula de ciudadanía Colombiana">
                                CC
                              </Option>
                              <Option value="Tarjeta de identidad Colombiana">
                                TI
                              </Option>
                              <Option value="Cédula de extranjería">CE</Option>
                              <Option value="Pasaporte">PS</Option>
                              <Option value="Otro">OT</Option>
                            </Select>
                          )}
                        </Form.Item>
                      }
                      placeholder="Ingrese el documento del estudiante"
                      key="student_dni"
                      onBlur={e => this.autofillName(e.target.value)}
                    />
                  </LabelSD>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Item label="Nombre Estudiante">
                {getFieldDecorator(
                  "student_name",
                  {}
                )(
                  <Input
                    placeholder="Ingrese el nombre del estudiante"
                    key="student_name"
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Item label="Tipo de caso">
                {getFieldDecorator("_cls", {
                  rules: [
                    {
                      required: true,
                      message: "Por favor, escoja el tipo de caso"
                    }
                  ]
                })(
                  <Select
                    showSearch
                    placeholder="Por favor, escoja el tipo de caso"
                    key="_cls"
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .indexOf(
                          input
                            .toLowerCase()
                            .normalize("NFD")
                            .replace(/[\u0300-\u036f]/g, "")
                        ) >= 0
                    }
                  >
                    {this.menuJSCases()}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Item label="Plan de estudios">
                {getFieldDecorator(
                  "academic_program",
                  {}
                )(
                  <Select
                    showSearch
                    placeholder="Escoja el plan de estudios"
                    key="academic_program"
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(
                        input
                          .toLowerCase()
                          .normalize("NFD")
                          .replace(/[\u0300-\u036f]/g, "")
                      ) >= 0
                    }
                  >
                    {this.menuJSPrograms()}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Item label="Periodo académico">
                {getFieldDecorator("academic_period", {
                  initialValue:
                    moment().year() + (moment().month() < 6 ? "-1S" : "-2S")
                })(
                  <Select
                    showSearch
                    placeholder="Escoja el plan de estudios"
                    key="academic_period"
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(
                        input
                          .toLowerCase()
                          .normalize("NFD")
                          .replace(/[\u0300-\u036f]/g, "")
                      ) >= 0
                    }
                  >
                    {this.menuJSPperiods()}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Item label="Fecha de radicación">
                {getFieldDecorator("date", {
                  initialValue: moment()
                })(<DatePicker key="date" style={{ width: "100%" }} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label="Número del Acta">
                {getFieldDecorator("council_year", {
                  initialValue: 1,
                  rule: [
                    {
                      min: 0,
                      message: "El número mínimo del acta es 0"
                    }
                  ]
                })(
                  <InputNumber
                    placeholder="Número de acta"
                    key="council_minute"
                    style={{ width: "75%" }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Año">
                {getFieldDecorator("council_minute", {
                  initialValue: 2020,
                  rule: [
                    {
                      min: 2000,
                      message: "El mínimo año para acta"
                    },
                    {
                      min: 2100,
                      message: "El máximo año del acta es 0"
                    }
                  ]
                })(
                  <InputNumber
                    placeholder="Número de acta"
                    key="year"
                    style={{ width: "75%", parginRight: 8 }}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <div
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            width: "100%",
            borderTop: "1px solid #e9e9e9",
            padding: "10px 16px",
            background: "#fff",
            textAlign: "right"
          }}
        >
          <Button
            onClick={e => this.props.onClose(e, "Create")}
            style={{ marginRight: 8 }}
          >
            Cancelar
          </Button>
          <Button
            type="primary"
            onClick={e => this.handleSave(e, _ => {})}
            style={{ marginRight: 8 }}
          >
            Guardar
          </Button>
          <Button
            type="primary"
            onClick={e => this.handleSaveAndEdit(e)}
            style={{ marginRight: 8 }}
          >
            Guardar y editar
          </Button>
        </div>
      </Drawer>
    );
  }
  componentDidMount() {
    Backend.sendRequest("GET", "details")
      .then(response => response.json())
      .then(data => {
        this.setState({ programs: data.programs });
        this.setState({ periods: data.periods });
      });
    Backend.sendRequest("GET", "infocase")
      .then(response => response.json())
      .then(data => {
        this.setState({ cases: data.cases });
      });
  }
}

const WrappedCreateForm = Form.create({ name: "normal_create" })(DrawerCreate);

export default withRouter(WrappedCreateForm);
