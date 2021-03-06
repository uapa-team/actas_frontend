import React from "react";
import { withRouter } from "react-router-dom";
import Backend from "../Basics/Backend";
import {
  Drawer,
  Button,
  Col,
  Row,
  Radio,
  InputNumber,
  Form,
  message,
} from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
class HomeDrawerDownload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      councilNumber: 1,
      councilYear: 2021,
      isPre: true,
      target: "",
      allowed: [],
    };
  }

  handleGenerate = () => {
    const key = "updatable";
    message.loading({ content: "Generando acta...", key, duration: 60 });
    let query = `pre=${this.state.isPre}&consecutive_minute${
      this.state.isPre ? "_ac" : ""
    }=${this.state.councilNumber}&year=${this.state.councilYear}&${
      this.state.target
    }`;
    Backend.sendRequest("GET", `generate?${query}`)
      .then((response) => response.json())
      .then((data) => {
        message.success({ content: "Acta generada correctamente.", key });
        Backend.openLink(data.url);
      });
  };

  menuJS = () => {
    return this.state.allowed.map(this.radioBtn);
  };

  radioBtn = (value) => {
    return (
      <Radio
        style={{ display: "block" }}
        key={value[0]}
        value={value[1].filter}
      >
        {value[1].display}
      </Radio>
    );
  };

  render() {
    return (
      <Drawer
        title="Generar Acta del Consejo de Facultad o Comité Asesor"
        width={"50%"}
        onClose={(e) => this.props.onClose(e, "Download")}
        visible={this.props.visible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form layout="vertical">
          <Row>
            <Col span={8}>
              <Form.Item
                label="Número del Acta"
                name="number"
                initialValue={this.state.councilNumber}
                rules={[
                  {
                    required: true,
                    message: "Por favor seleccione un número",
                  },
                ]}
              >
                <InputNumber
                  placeholder="Número de acta"
                  onChange={(value) => this.setState({ councilNumber: value })}
                  min={0}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Año"
                name="year"
                initialValue={this.state.councilYear}
                rules={[
                  {
                    required: true,
                    message: "Por favor seleccione un año",
                  },
                ]}
              >
                <InputNumber
                  placeholder="Número de acta"
                  onChange={(value) => this.setState({ councilYear: value })}
                  min={2000}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item
                label="Tipo de Acta"
                name="isPre"
                initialValue={this.state.isPre}
                rules={[{ required: true, message: "Seleccione un valor" }]}
              >
                <Radio.Group
                  onChange={(v) => this.setState({ isPre: v.target.value })}
                  buttonStyle="solid"
                >
                  <Radio.Button value={true}>Comité Asesor</Radio.Button>
                  <Radio.Button value={false}>Consejo de Facultad</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item
                label="Solicitudes a generar"
                name="generate"
                initialValue={this.state.target}
              >
                <Radio.Group
                  onChange={(v) => this.setState({ target: v.target.value })}
                >
                  {this.menuJS()}
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Row gutter={8}>
          <Col>
            <Button
              icon={<CheckCircleOutlined />}
              onClick={(e) => {
                this.handleGenerate();
                this.props.onClose(e, "Download");
              }}
              type="primary"
            >
              Generar y descargar
            </Button>
          </Col>
          <Col>
            <Button
              icon={<CloseCircleOutlined />}
              onClick={(e) => this.props.onClose(e, "Download")}
            >
              Cancelar
            </Button>
          </Col>
        </Row>
      </Drawer>
    );
  }
  componentDidMount() {
    Backend.sendRequest("GET", "allow_generate")
      .then((response) => response.json())
      .then((data) => this.setState({ allowed: Object.entries(data) }));
  }
}

export default withRouter(HomeDrawerDownload);
