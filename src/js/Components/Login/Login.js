import React from "react";
import { Form, Icon, Input, Button, Checkbox, Typography, Modal } from "antd";
import { Row, Col } from 'antd';
import { withRouter } from "react-router-dom"
import auth from "../../../auth"
import BackEndUrl from '../../../backendurl'

import "./Login.css";
import "antd/dist/antd.css";

const { Title, Text } = Typography;

class NormalLoginForm extends React.Component {

  constructor(props){ 
    super(props);
    this.state = {
      username: '',
      password: ''
    }; 
  } 


  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.performLogin()
      }
    });
  };

  performLogin = () => {
    fetch(BackEndUrl + 'login', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: this.state.username,
          password: this.state.password,
        })
    }).then(async response => {
        if (response.status === 403) {
          Modal.error({
            title: 'Acceso restringido',
            content: 'Su usuario no tiene permiso para acceder a la aplicación.',
          });
          auth.authenticated = false;
        } else if (response.status === 404) {
          Modal.error({
            title: 'Contraseña incorrecta',
            content: 'Por favor verifique e intente nuevamente.',
          });
          auth.authenticated = false;
        } else if (response.status === 200) {
          let res = await response.json()
          auth.login(() => {return});
          auth.setToken(res['token'])
          this.props.history.push('/home');
        }
      }).catch(error => {
        console.log(error)
      })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
      <div className="breadcrumb-class">
      Está en:
      <a href="/" target="_self" title="Inicio">
        Inicio
      </a>
    </div>
      <Row>
      <Col xs={4} sm={4} md={6} lg={8} xl={8}></Col>
      <Col xs={16} sm={16} md={12} lg={8} xl={8}>
      <div className="login-general">
        <div className="login-welcome">
                <Title>Aplicación de Actas</Title>
                <Text>Bienvenido a la apliación de actas de la Facultad de Ingeniería de la Universidad Nacional de Colombia.</Text>
                <Text>Para continuar, por favor, ingrese su usuario y contraseña institucional.</Text>
        </div>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <Form.Item>
            {getFieldDecorator('username', {
              rules: [{ required: true, message: 'Por favor, ingrese su usuario.' }],
            })(
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Usuario SIA" onChange={(text) => {this.setState({username:text.target.value})}}
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Por favor, ingrese su contraseña.' }],
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password" placeholder="Contraseña" onChange={(text) => {this.setState({password:text.target.value})}}
              />,
            )}
          </Form.Item>
          <Form.Item>
            {
            getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,           
            }, '')(<Checkbox>Recuérdame</Checkbox>)}
            <a className="login-form-forgot" href="https://cuenta.unal.edu.co/index.php?p=recoverPassword">
              Olvidé mi contraseña
            </a>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Ingresar
            </Button>
            ¿No tiene un usuario? - <a href='/contact'>Contáctenos</a>
          </Form.Item>
        </Form>
      </div>
      </Col>
      <Col xs={4} sm={4} md={6} lg={8} xl={8}></Col>
    </Row>
    </div>
    );
  }
}

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(NormalLoginForm);

export default withRouter(Form.create()(WrappedNormalLoginForm));
