import React from "react";
import { withRouter } from "react-router-dom";
import auth from "../../../auth";
import BackEndUrl from "../../../backendurl";
import {
  Drawer,
  Form,
  Button,
  Col,
  Row,
  Select,
  Radio,
  InputNumber
} from "antd";
const { Option } = Select;
class DrawerDownload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      councilNumber: 0,
      councliYear: 0,
      isPre: true,
      target: "",
      allowed: []
    };
  }
  radioStyle = {
    display: "block",
    height: "30px",
    lineHeight: "30px"
  };
  menuJS = () => {
    console.log(this.state.allowed);
    return this.state.allowed.map(this.radioBtn);
  };
  radioBtn = value => {
    return (
      <Radio style={this.radioStyle} value={value[1].filter}>
        {value[1].display}
      </Radio>
    );
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Drawer
        title="Generar Acta del Consejo de Facultad o Comité Asesor"
        width={420}
        onClose={e => this.props.onClose(e, "Download")}
        visible={this.props.visible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form layout="vertical" hideRequiredMark>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Número del Acta">
                {getFieldDecorator("number", {
                  initialValue: 1,
                  rules: [
                    {
                      required: true,
                      message: "Por favor seleccione un número"
                    }
                  ]
                })(
                  <InputNumber
                    placeholder="Número de acta"
                    onChange={value => this.setState({ councilNumber: value })}
                    min={0}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Año">
                {getFieldDecorator("year", {
                  initialValue: 2020,
                  rules: [
                    {
                      required: true,
                      message: "Por favor seleccione un año"
                    }
                  ]
                })(
                  <InputNumber
                    placeholder="Número de acta"
                    onChange={value => this.setState({ councliYear: value })}
                    min={2000}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Tipo de Acta">
                {getFieldDecorator("owner", {
                  rules: [{ required: true, message: "Seleccione un valor" }],
                  initialValue: true
                })(
                  <Radio.Group
                    onChange={v => this.setState({ isPre: v.target.value })}
                  >
                    <Radio.Button value={false}>
                      Consejo de Facultad
                    </Radio.Button>
                    <Radio.Button value={true}>Comité Asesor</Radio.Button>
                  </Radio.Group>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Solicitudes a generar">
                {getFieldDecorator("generate", {
                  rules: [{ required: true, message: "Seleccione una opción" }]
                })(
                  <Radio.Group
                    onChange={v => this.setState({ target: v.target.value })}
                  >
                    {this.menuJS()}
                  </Radio.Group>
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
            onClick={e => this.props.onClose(e, "Download")}
            style={{ marginRight: 8 }}
          >
            Cancel
          </Button>
          <Button
            onClick={e => this.props.onClose(e, "Download")}
            type="primary"
          >
            Generar
          </Button>
        </div>
      </Drawer>
    );
  }
  componentDidMount() {
    fetch(BackEndUrl + "allow_generate", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Token " + auth.getToken()
      }
    })
      .then(response => response.json())
      .then(data => this.setState({ allowed: Object.entries(data) }));
  }
}

const WrappedDownloadForm = Form.create({ name: "normal_download" })(
  DrawerDownload
);

export default withRouter(WrappedDownloadForm);
