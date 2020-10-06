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
import {
  EditOutlined,
  SaveOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";
import Backend from "../Basics/Backend";
const { Option } = Select;

class HomeDrawerCreate extends React.Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      programs: [],
      cases: [],
      periods: [],
      edit: false,
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
        this.formRef.current.setFieldsValue({
          student_name: data.student_name,
        });
      });
  };

  editTrigger = () => {
    this.setState({
      edit: true,
    });
  };

  handleSave = (values) => {
    values.date = values.date.utc().format();
    this.props.onClose("Create");
    const key = "updatable";
    message.loading({ content: "Guardando caso...", key });
    Backend.sendRequest("POST", "case", {
      items: [values],
    })
      .then((response) => {
        if (response.status === 200) {
          response.json().then((data) => {
            this.props.onClose("Create");
            message.success({
              content: "El caso se ha guardado exitosamente.",
              key,
            });
            let newID = data.inserted_items[0];
            if (localStorage.getItem("type") !== "secretary") {
              Backend.sendRequest("PATCH", "mark_received?id=".concat(newID));
            }
            if (this.state.edit) {
              this.props.history.push({
                pathname: "/edit/" + newID,
              });
              this.setState({
                edit: false,
              });
            }
          });
        } else if (response.status) {
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

  renderForm = () => {
    let form = (
      <Form onFinish={this.handleSave} layout="vertical" ref={this.formRef}>
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              label="Tipo de documento"
              name="student_dni_type"
              initialValue="CC"
            >
              <Select>
                <Option value="CC">CC</Option>
                <Option value="TI">TI</Option>
                <Option value="CE">CE</Option>
                <Option value="PS">PS</Option>
                <Option value="OT">OT</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Documento Estudiante" name="student_dni">
              <Input
                placeholder="Ingrese el documento del estudiante"
                onBlur={(e) => this.autofillName(e.target.value)}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="Nombre Estudiante" name="student_name">
          <Input placeholder="Ingrese el nombre del estudiante" />
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
              <DatePicker />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Número de acta"
              name="consecutive_minute"
              initialValue={1}
              rules={[
                {
                  type: "number",
                  min: 0,
                  message: "El número mínimo del acta es 0.",
                },
              ]}
            >
              <InputNumber placeholder="Número de acta" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Año"
              name="year"
              initialValue={2020}
              rules={[
                {
                  type: "number",
                  min: 2000,
                  message: "El mínimo año para acta es 2000.",
                },
                {
                  type: "number",
                  max: 2100,
                  message: "El máximo año del acta es 2100.",
                },
              ]}
            >
              <InputNumber placeholder="Año" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={8}>
          {localStorage.getItem("type") !== "secretary" ? (
            <Col>
              <Form.Item>
                <Button
                  icon={<EditOutlined />}
                  type="primary"
                  htmlType="submit"
                  onClick={this.editTrigger}
                >
                  Guardar y editar
                </Button>
              </Form.Item>
            </Col>
          ) : null}
          <Col>
            <Form.Item>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                Guardar
              </Button>
            </Form.Item>
          </Col>
          <Col>
            <Button
              icon={<CloseCircleOutlined />}
              onClick={(e) => this.props.onClose(e, "Create")}
            >
              Cancelar
            </Button>
          </Col>
        </Row>
      </Form>
    );
    return form;
  };

  render() {
    return (
      <Drawer
        title="Crear un nuevo caso"
        width={"50%"}
        onClose={(e) => this.props.onClose(e, "Create")}
        visible={this.props.visible}
      >
        {this.renderForm()}
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
