import React from "react";
import {
  Input,
  Button,
  Checkbox,
  Typography,
  message,
  Form,
  Row,
  Col,
} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { withRouter } from "react-router-dom";
import Backend from "../Basics/Backend";

const { Title, Text } = Typography;

class NormalLoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      checked: false,
    };
  }

  checkChanged = () => {
    this.setState({ checked: !this.state.checked });
  };

  performLogin = () => {
    const key = "updatable";
    message.loading({ content: "Iniciando sesión...", key });
    Backend.sendLogin(this.state.username, this.state.password)
      .then(async (response) => {
        if (response.status === 403) {
          message.error({ content: "Acceso restringido.", key });
        } else if (response.status === 404) {
          message.error({ content: "Contraseña incorrecta.", key });
        } else if (response.status === 200) {
          message.success({ content: "Inicio de sesión exitoso.", key });
          let res = await response.json();
          localStorage.setItem("jwt", res["token"]);
          localStorage.setItem("type", res["group"]);
          this.props.history.push("/home");
        } else {
          message.error({
            content: "Error realizando el login.",
            key,
          });
        }
      })
      .catch((error) => {
        message.error({
          content: "Error realizando el login.",
          key,
        });
      });
  };

  render() {
    return (
      <Row>
        <Col xs={4} sm={4} md={6} lg={8} xl={8}></Col>
        <Col xs={16} sm={16} md={12} lg={8} xl={8}>
          <div className="login-general">
            <div className="login-welcome">
              <Title>Aplicación de Actas</Title>
              <Text>
                Bienvenido a la aplicación de actas de la Facultad de Ingeniería
              </Text>
              <Text>
                . Para continuar, por favor, ingrese su usuario y contraseña
                institucional.
              </Text>
            </div>
            <Form onFinish={this.performLogin} className="login-form">
              <Form.Item
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Por favor, ingrese su usuario.",
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                  placeholder="Usuario SIA"
                  onChange={(text) => {
                    this.setState({ username: text.target.value });
                  }}
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Por favor, ingrese su contraseña.",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                  placeholder="Contraseña"
                  onChange={(text) => {
                    this.setState({ password: text.target.value });
                  }}
                />
              </Form.Item>
              <Form.Item name="remember" className="login-form-remember">
                <Checkbox
                  checked={this.state.checked}
                  onClick={this.checkChanged}
                >
                  Recuérdame
                </Checkbox>
              </Form.Item>
              <a
                className="login-form-forgot"
                href="https://cuenta.unal.edu.co/index.php?p=recoverPassword"
              >
                Olvidé mi contraseña
              </a>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                >
                  Ingresar
                </Button>
                <div className="login-form-contact">
                  ¿No tiene un usuario? - <a href="/contact">Contáctenos</a>
                </div>
              </Form.Item>
            </Form>
          </div>
        </Col>
        <Col xs={4} sm={4} md={6} lg={8} xl={8}></Col>
      </Row>
    );
  }
}

export default withRouter(NormalLoginForm);
