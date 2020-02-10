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
  DatePicker
} from "antd";
import moment from "moment";
import auth from "../../../auth";
import BackEndUrl from "../../../backendurl";
const { Option } = Select;

class DrawerCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      programs: [],
      cases: []
    };
  }
  selectItem = i => {
    return (
      <Option value={i} key={i}>
        {i.normalize("NFD").replace(/[\u0300-\u036f]/g, "")}
      </Option>
    );
  };

  menuJSPrograms = () => {
    return this.state.programs.map(this.selectItem);
  };

  menuJSCases = () => {
    return this.state.cases.map(this.selectItem);
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
        <Form layout="vertical" hideRequiredMark>
          <Row>
            <Col>
              <Form.Item label="Documento Estudiante">
                {getFieldDecorator(
                  "student_dni",
                  {}
                )(
                  <Input
                    addonBefore={
                      <Select
                        defaultValue="Cédula de Ciudadanía colombiana"
                        style={{ width: "5em" }}
                        key="student_dni_type"
                      >
                        <Option value="Cédula de Ciudadanía colombiana">
                          CC
                        </Option>
                        <Option value="Tarjeta de Identidad colombiana">
                          TI
                        </Option>
                        <Option value="Cédula de extranjería">CE</Option>
                        <Option value="Pasaporte">PS</Option>
                        <Option value="Otro">OT</Option>
                      </Select>
                    }
                    placeholder="Ingrese el documento del estudiante"
                    key="student_dni"
                  />
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
                {getFieldDecorator("type", {
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
                      option.props.children.toLowerCase().indexOf(
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
                  "Plan",
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
                {getFieldDecorator("name", {
                  initialValue:
                    moment().year() + (moment().month() < 6 ? "-01" : "-03")
                })(
                  <Input
                    placeholder="Ingrese el periodo académico"
                    key="academic_period"
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Item label="Fecha de radicación">
                {getFieldDecorator("name", {
                  initialValue: moment()
                })(<DatePicker key="date" style={{ width: "100%" }} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label="Número del Acta">
                <InputNumber
                  placeholder="Número de acta"
                  min={0}
                  key="council_minute"
                  defaultValue="1"
                  style={{ width: "75%" }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Año">
                <InputNumber
                  placeholder="Número de acta"
                  min={2000}
                  defaultValue="2020"
                  key="year"
                  style={{ width: "75%", parginRight: 8 }}
                />
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
            onClick={e => this.props.onClose(e, "Create")}
            style={{ marginRight: 8 }}
          >
            Guardar
          </Button>
          <Button
            type="primary"
            onClick={e => this.props.onClose(e, "Create")}
            style={{ marginRight: 8 }}
          >
            Guardar y editar
          </Button>
        </div>
      </Drawer>
    );
  }
  componentDidMount() {
    fetch(BackEndUrl + "programs", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Token " + auth.getToken()
      }
    })
      .then(response => response.json())
      .then(data => {
        this.setState({ programs: data.programs });
      });
    fetch(BackEndUrl + "infocase", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Token " + auth.getToken()
      }
    })
      .then(response => response.json())
      .then(data => {
        this.setState({ cases: data.cases.map(i => i.name) });
      });
  }
}

const WrappedCreateForm = Form.create({ name: "normal_create" })(DrawerCreate);

export default withRouter(WrappedCreateForm);
