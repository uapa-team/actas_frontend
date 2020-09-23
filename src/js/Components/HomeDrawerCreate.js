import React from "react";
import { withRouter } from "react-router-dom";
import {
  Drawer,
  Button,
  Col,
  Row,
  Input,
  InputNumber,
  Select,
  DatePicker,
  message,
  Form,
} from "antd";
import moment from "moment";
import Backend from "../Basics/Backend";
const { Option } = Select;

class HomeDrawerCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      programs: [],
      cases: [],
      periods: [],
    };
  }

  autofillName = (dni) => {
    Backend.sendRequest("POST", "autofill", {
      field: "name",
      student_dni: dni,
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          return { student_name: "" };
        }
      })
      .then((data) => {
        //this.props.form.setFieldsValue({ student_name: data.student_name });
      });
  };

  handleSave = (values, e, redirect) => {
    values.date = values.date.utc().format();
    this.props.onClose(e, "Create");
    const key = "updatable";
    message.loading({ content: "Guardando caso...", key });
    Backend.sendRequest("POST", "case", {
      items: [values],
    })
      .then((response) => {
        this.props.onClose(e, "Create");
        if (response.status === 200) {
          message.success({
            content: "El caso se ha guardado exitosamente.",
            key,
          });
          response
            .json()
            .then((data) =>
              redirect(
                data["inserted_items"][0],
                "Request." + this.props.form.getFieldValue("_cls")
              )
            );
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
        return;
      })
      .catch((error) => {
        message.error({
          content: "Ha habido un error guardando el caso.",
          key,
        });
        console.error("Error en guardando el caso");
        console.error(values);
        console.error(error);
      });
  };

  handleSaveAux = (e) => {
    this.handleSave(e, (id) => {
      if (localStorage.getItem("type") !== "secretary") {
        Backend.sendRequest("PATCH", `mark_received?id=${id}`);
      }
    });
  };

  handleSaveAndEdit = (e) => {
    this.handleSave(e, (id) => {
      this.props.history.push({
        pathname: "/edit/" + id,
      });
      if (localStorage.getItem("type") !== "secretary") {
        Backend.sendRequest("PATCH", `mark_received?id=${id}`);
      }
    });
  };

  selectItem = (i) => {
    return (
      <Option value={i} key={i}>
        {i}
      </Option>
    );
  };

  selectItemCase = (i) => {
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
    return (
      <Drawer
        title="Crear un nuevo caso"
        width={"50%"}
        onClose={(e) => this.props.onClose(e, "Create")}
        visible={this.props.visible}
      >
        <Form onFinish={this.handleSave} layout="vertical">
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                label="Tipo de documento"
                name="student_dni_type"
                initialValue="CC"
              >
                <Select key="student_dni_type">
                  <Option value="Cédula de ciudadanía Colombiana">CC</Option>
                  <Option value="Tarjeta de identidad Colombiana">TI</Option>
                  <Option value="Cédula de extranjería">CE</Option>
                  <Option value="Pasaporte">PS</Option>
                  <Option value="Otro">OT</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Documento Estudiante" name="student_dni">
                <Input
                  placeholder="Ingrese el documento del estudiante"
                  key="student_dni"
                  onBlur={(e) => this.autofillName(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Nombre Estudiante" name="student_name">
            <Input
              placeholder="Ingrese el nombre del estudiante"
              key="student_name"
            />
          </Form.Item>
          <Form.Item
            label="Tipo de caso"
            name="_cls"
            rules={[
              {
                required: true,
                message: "Por favor, escoja el tipo de caso",
              },
            ]}
          >
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
          </Form.Item>
          <Form.Item label="Plan de estudios" name="academic_program">
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
          </Form.Item>
          <Form.Item
            label="Periodo académico"
            name="academic_period"
            initialValue={
              moment().year() + (moment().month() < 6 ? "-1S" : "-2S")
            }
          >
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
          </Form.Item>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Fecha de radicación"
                name="date"
                initialValue={moment()}
              >
                <DatePicker key="date" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Número del Acta"
                name="consecutive_minute"
                initialValue={1}
                rules={[
                  {
                    min: 0,
                    message: "El número mínimo del acta es 0.",
                  },
                ]}
              >
                <InputNumber
                  placeholder="Número de acta"
                  key="council_minute"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Año"
                name="year"
                initialValue={2020}
                rules={[
                  {
                    min: 2000,
                    message: "El mínimo año para acta es 2000.",
                  },
                  {
                    min: 2100,
                    message: "El máximo año del acta es 2100.",
                  },
                ]}
              >
                <InputNumber placeholder="Número de acta" key="year" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Row gutter={8}>
          {localStorage.getItem("type") !== "secretary" ? (
            <Col>
              <Button type="primary" onClick={(e) => this.handleSaveAndEdit(e)}>
                Guardar y editar
              </Button>
            </Col>
          ) : null}
          <Col>
            <Button
              type="primary"
              onClick={(e) => this.handleSaveAux(e, (_) => {})}
            >
              Guardar
            </Button>
          </Col>
          <Col>
            <Button onClick={(e) => this.props.onClose(e, "Create")}>
              Cancelar
            </Button>
          </Col>
        </Row>
      </Drawer>
    );
  }
  componentDidMount() {
    Backend.sendRequest("GET", "details")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ programs: data.programs });
        this.setState({ periods: data.periods });
      });
    Backend.sendRequest("GET", "infocase")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ cases: data.cases });
      });
  }
}

export default withRouter(HomeDrawerCreate);
