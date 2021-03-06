import React from "react";
import {
  Input,
  Button,
  Radio,
  Typography,
  Form,
  Row,
  Col,
  message,
} from "antd";
import { SmileOutlined, MailOutlined } from "@ant-design/icons";
import { withRouter } from "react-router-dom";
import Backend from "../Basics/Backend";

const { Title } = Typography;
const { TextArea } = Input;

class Contact extends React.Component {
  state = {
    value: "",
  };

  onFinish = (values) => {
    const key = "updatable";
    message.loading({ content: "Enviando mensaje...", key });
    Backend.sendRequest("POST", "make_suggestion", {
      name: values.name,
      email: values.mail,
      sugtype: values.type,
      content: values.message.concat(
        "\nNota: Este mensaje se envió desde la aplicación de Actas."
      ),
    }).then(async (response) => {
      if (response.status === 200 || response.status === 204) {
        message.success({
          content: "Leeremos su mensaje cuanto antes. ¡Gracias!",
          key,
        });
      } else {
        message.error({
          content: "Ha ocurrido un error enviando el mensaje.",
          key,
        });
      }
    });
  };

  onChange = ({ target: { value } }) => {
    this.setState({ value });
  };

  render() {
    const { value } = this.state;
    return (
      <Row className="main-row-container">
        <Col xs={4} sm={4} md={6} lg={6} xl={6}></Col>
        <Col xs={16} sm={16} md={12} lg={12} xl={12}>
          <div className="contact-welcome">
            <Title>Contáctenos</Title>
          </div>

          <Form onFinish={this.onFinish}>
            <Form.Item
              name="name"
              label="Nombre completo"
              rules={[
                { required: true, message: "Por favor ingrese su nombre." },
              ]}
            >
              <Input
                prefix={<SmileOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                placeholder="Escriba su nombre completo"
              />
            </Form.Item>

            <Form.Item
              name="mail"
              label="Correo electrónico"
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese su correo electrónico.",
                },
              ]}
            >
              <Input
                prefix={<MailOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                placeholder="Escriba su dirección de correo electrónico"
              />
            </Form.Item>

            <Form.Item name="type" label="Tipo de mensaje">
              <Radio.Group onChange={this.handleFormLayoutChange}>
                <Radio.Button value="Duda">Duda</Radio.Button>
                <Radio.Button value="Sugerencia">Sugerencia</Radio.Button>
                <Radio.Button value="Petición">Petición</Radio.Button>
                <Radio.Button value="Queja">Queja</Radio.Button>
                <Radio.Button value="Reclamo">Reclamo</Radio.Button>
                <Radio.Button value="Otro">Otro</Radio.Button>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name="message"
              rules={[
                { required: true, message: "Por favor ingrese su mensaje." },
              ]}
              placeholder="Escriba aquí su mensaje"
            >
              <TextArea
                value={value}
                onChange={this.onChange}
                autoSize={{ minRows: 3, maxRows: 5 }}
                placeholder="Escriba aquí su mensaje."
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                Enviar
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col xs={4} sm={4} md={6} lg={6} xl={6}></Col>
      </Row>
    );
  }
}

export default withRouter(Contact);
