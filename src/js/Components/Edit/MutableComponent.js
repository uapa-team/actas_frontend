import React from "react";
import {
  Form,
  Input,
  Checkbox,
  Typography,
  DatePicker,
  Select,
  InputNumber
} from "antd";
import { Row, Col } from "antd";
import { withRouter } from "react-router-dom";

const { Text } = Typography;
const { Option } = Select;
const children = [];

class MutableComponent extends React.Component {
  checkNumber = (rule, value, callback) => {
    if (value.number > 0) {
      return callback();
    }
    callback("El valor debe ser numérico");
  };

  selectItem = i => {
    return (
      <Option value={i}>
        {i.normalize("NFD").replace(/[\u0300-\u036f]/g, "")}
      </Option>
    );
  };

  menuJS = () => {
    if (Object.keys(this.props.metadata).includes("choices")) {
      return this.props.metadata.choices.map(this.selectItem);
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    if (this.props.metadata.type === "String") {
      if (Object.keys(this.props.metadata).includes("choices")) {
        return (
          <Row type="flex" align="middle">
            <Col span={12} style={{ textAlign: "right", paddingRight: "10px" }}>
              <Text>{this.props.metadata.display}</Text>
            </Col>
            <Col span={12}>
              <Form.Item style={{ marginBottom: "0px", paddingLeft: "10px" }}>
                <Select
                  showSearch
                  placeholder={this.props.metadata.display}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(
                      input
                        .toLowerCase()
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                    ) >= 0
                  }
                >
                  {this.menuJS()}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        );
      } else {
        return (
          <Row type="flex" align="middle">
            <Col span={12} style={{ textAlign: "right", paddingRight: "10px" }}>
              <Text>{this.props.metadata.display}</Text>
            </Col>
            <Col span={12}>
              <Form.Item style={{ marginBottom: "0px", paddingLeft: "10px" }}>
                <Input
                  placeholder={this.props.metadata.display}
                  defaultValue={this.props.metadata.default}
                />
              </Form.Item>
            </Col>
          </Row>
        );
      }
    } else if (this.props.metadata.type === "Integer") {
      return (
        <Row type="flex" align="middle">
          <Col span={12} style={{ textAlign: "right", paddingRight: "10px" }}>
            <Text>{this.props.metadata.display}</Text>
          </Col>
          <Col span={12}>
            <Form.Item style={{ marginBottom: "0px", paddingLeft: "10px" }}>
              <InputNumber defaultValue={this.props.metadata.default} />
            </Form.Item>
          </Col>
        </Row>
      );
    } else if (this.props.metadata.type === "Float") {
      return (
        <Row type="flex" align="middle">
          <Col span={12} style={{ textAlign: "right", paddingRight: "10px" }}>
            <Text>{this.props.metadata.display}</Text>
          </Col>
          <Col span={12}>
            <Form.Item style={{ marginBottom: "0px", paddingLeft: "10px" }}>
              <InputNumber
                defaultValue={this.props.metadata.default}
                step={0.1}
              />
            </Form.Item>
          </Col>
        </Row>
      );
    } else if (this.props.metadata.type === "Date") {
      return (
        <Row type="flex" align="middle">
          <Col span={12} style={{ textAlign: "right", paddingRight: "10px" }}>
            <Text>{this.props.metadata.display}</Text>
          </Col>
          <Col span={12}>
            <Form.Item style={{ marginBottom: "0px", paddingLeft: "10px" }}>
              {getFieldDecorator(this.props.fieldName)(
                <DatePicker placeholder="Seleccione fecha" />
              )}
            </Form.Item>
          </Col>
        </Row>
      );
    } else if (this.props.metadata.type === "Boolean") {
      return (
        <Row type="flex" align="middle">
          <Col span={12} style={{ textAlign: "right", paddingRight: "10px" }}>
            <Text>{this.props.metadata.display}</Text>
          </Col>
          <Col span={12}>
            <Form.Item style={{ marginBottom: "0px", paddingLeft: "10px" }}>
              {getFieldDecorator(this.props.fieldName)(
                <Checkbox defaultChecked={this.props.metadata.default} />
              )}
            </Form.Item>
          </Col>
        </Row>
      );
    } else if (this.props.metadata.type === "List:String") {
      return (
        <Row type="flex" align="middle">
          <Col span={12} style={{ textAlign: "right", paddingRight: "10px" }}>
            <Text>{this.props.metadata.display}</Text>
          </Col>
          <Col span={12}>
            <Form.Item style={{ marginBottom: "0px", paddingLeft: "10px" }}>
              <Select
                mode="tags"
                style={{ width: "100%" }}
                tokenSeparators={[","]}
              >
                {children}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      );
    } else {
      return (
        <Row type="flex" align="middle">
          <Col span={12}>
            <Text>{this.props.metadata.display}</Text>
          </Col>
          <Col span={12}>
            <Form.Item style={{ marginBottom: "0px", paddingLeft: "10px" }}>
              <Input placeholder={this.props.fieldName} />
            </Form.Item>
          </Col>
        </Row>
      );
    }
  }
}

const WrappedComponent = Form.create({ name: "mutable_component" })(
  MutableComponent
);

export default withRouter(Form.create()(WrappedComponent));
