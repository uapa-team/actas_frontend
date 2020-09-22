import React from "react";
import { withRouter } from "react-router-dom";
import Backend from "../Basics/Backend";
import { Drawer, Button, Col, Row, Radio, InputNumber, Spin, Form } from "antd";
class HomeDrawerDownload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      councilNumber: 1,
      councliYear: 2020,
      isPre: true,
      target: "",
      allowed: [],
      spinning: false,
    };
  }

  handleGenerate = () => {
    this.setState({ spinning: true });
    let query = `pre=${this.state.isPre}&consecutive_minute${
      this.state.isPre ? "_ac" : ""
    }=${this.state.councilNumber}&year=${this.state.councliYear}&${
      this.state.target
    }`;
    Backend.sendRequest("GET", `generate?${query}`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({ spinning: false });
        Backend.openLink(data.url);
      });
  };

  menuJS = () => {
    return this.state.allowed.map(this.radioBtn);
  };

  radioBtn = (value) => {
    return (
      <Radio
        className="home-drawer-radio-style"
        key={value[0]}
        value={value[1].filter}
      >
        {value[1].display}
      </Radio>
    );
  };

  render() {
    return (
      <Spin spinning={this.state.spinning}>
        <Drawer
          title="Generar Acta del Consejo de Facultad o Comité Asesor"
          width={420}
          onClose={(e) => this.props.onClose(e, "Download")}
          visible={this.props.visible}
          bodyStyle={{ paddingBottom: 80 }}
        >
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col span={12}>
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
                    onChange={(value) =>
                      this.setState({ councilNumber: value })
                    }
                    min={0}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Año"
                  name="year"
                  initialValue={this.state.councliYear}
                  rules={[
                    {
                      required: true,
                      message: "Por favor seleccione un año",
                    },
                  ]}
                >
                  <InputNumber
                    placeholder="Número de acta"
                    onChange={(value) => this.setState({ councliYear: value })}
                    min={2000}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
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
                    <Radio.Button value={false}>
                      Consejo de Facultad
                    </Radio.Button>
                    <Radio.Button value={true}>Comité Asesor</Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
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
          <div className="home-drawer-div">
            <Button
              onClick={(e) => this.props.onClose(e, "Download")}
              style={{ marginRight: 8 }}
            >
              Cancelar
            </Button>
            <Button
              onClick={(e) => {
                this.handleGenerate();
                this.props.onClose(e, "Download");
              }}
              type="primary"
            >
              Generar
            </Button>
          </div>
        </Drawer>
      </Spin>
    );
  }
  componentDidMount() {
    Backend.sendRequest("GET", "allow_generate")
      .then((response) => response.json())
      .then((data) => this.setState({ allowed: Object.entries(data) }));
  }
}

export default withRouter(HomeDrawerDownload);
