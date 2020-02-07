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
import { Row } from "antd";
import { withRouter } from "react-router-dom";

const { Text } = Typography;
const { Option } = Select;
const children = [];

class MutableComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultDropDown: ""
    };
  }
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
          <Row>
            <Text>{this.props.metadata.display}</Text>
            <Form.Item>
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
          </Row>
        );
      } else {
        return (
          <Row>
            <Text>{this.props.metadata.display}</Text>
            <Form.Item>
              <Input
                placeholder={this.props.metadata.display}
                defaultValue={this.props.metadata.default}
              />
            </Form.Item>
          </Row>
        );
      }
    } else if (this.props.metadata.type === "Integer") {
      return (
        <Row>
          <Text>{this.props.metadata.display}</Text>
          <Form.Item>
            <InputNumber defaultValue={this.props.metadata.default} />
          </Form.Item>
        </Row>
      );
    } else if (this.props.metadata.type === "Float") {
      return (
        <Row>
          <Text>{this.props.metadata.display}</Text>
          <Form.Item>
            <InputNumber
              defaultValue={this.props.metadata.default}
              step={0.1}
            />
          </Form.Item>
        </Row>
      );
    } else if (this.props.metadata.type === "Date") {
      return (
        <Row>
          <Text>{this.props.metadata.display}</Text>
          <Form.Item>
            {getFieldDecorator(this.props.fieldName)(
              <DatePicker placeholder="Seleccione fecha" />
            )}
          </Form.Item>
        </Row>
      );
    } else if (this.props.metadata.type === "Boolean") {
      return (
        <Row>
          <Text>{this.props.metadata.display}</Text>
          <Form.Item>
            {getFieldDecorator(this.props.fieldName, {
              initialValue: this.props.metadata.default
            })(<Checkbox />)}
          </Form.Item>
        </Row>
      );
    } else if (this.props.metadata.type === "List:String") {
      return (
        <Row>
          <Text>{this.props.metadata.display}</Text>
          <Select mode="tags" style={{ width: "100%" }} tokenSeparators={[","]}>
            {children}
          </Select>
        </Row>
      );
    } else {
      return (
        <Row>
          <Text>{this.props.metadata.display}</Text>
          <Form.Item>
            <Input placeholder={this.props.fieldName} />
          </Form.Item>
        </Row>
      );
    }
  }
}

const WrappedComponent = Form.create({ name: "mutable_component" })(
  MutableComponent
);

export default withRouter(Form.create()(WrappedComponent));
