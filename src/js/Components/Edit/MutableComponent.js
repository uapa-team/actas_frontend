import React from "react";
import moment from "moment";
import "@ant-design/compatible/assets/index.css";
import { Input, DatePicker, Select, InputNumber, Radio, Form } from "antd";
import { withRouter } from "react-router-dom";
import { StyledFormItem } from "./EditStyles";

const { Option } = Select;
const children = [];
class MutableComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableVisible: false,
    };
  }
  checkNumber = (rule, value, callback) => {
    if (value.number > 0) {
      return callback();
    }
    callback("El valor debe ser numérico");
  };

  selectItem = (i) => {
    return (
      <Option value={i} key={i}>
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
    if (this.props.metadata.type === "String") {
      if (Object.keys(this.props.metadata).includes("choices")) {
        return (
          <StyledFormItem>
            <Form.Item
              label={this.props.metadata.display}
              name={this.props.fieldName}
              initialValue={this.props.metadata.default}
            >
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
              ¿
            </Form.Item>
          </StyledFormItem>
        );
      } else {
        return (
          <StyledFormItem>
            <Form.Item
              label={this.props.metadata.display}
              name={this.props.fieldName}
              initialValue={this.props.metadata.default}
            >
              <Input placeholder={this.props.metadata.display} />
            </Form.Item>
          </StyledFormItem>
        );
      }
    } else if (this.props.metadata.type === "Integer") {
      return (
        <StyledFormItem>
          <Form.Item
            label={this.props.metadata.display}
            name={this.props.fieldName}
            initialValue={this.props.metadata.default}
          >
            <InputNumber />
          </Form.Item>
        </StyledFormItem>
      );
    } else if (this.props.metadata.type === "Float") {
      return (
        <StyledFormItem>
          <Form.Item
            label={this.props.metadata.display}
            name={this.props.fieldName}
            initialValue={this.props.metadata.default}
          >
            <InputNumber step={0.1} />
          </Form.Item>
        </StyledFormItem>
      );
    } else if (this.props.metadata.type === "Date") {
      return (
        <StyledFormItem>
          <Form.Item
            label={this.props.metadata.display}
            name={this.props.fieldName}
            initialValue={moment(this.props.metadata.default, "YYYY-MM-DD")}
          >
            <DatePicker placeholder="Seleccione fecha" />)
          </Form.Item>
        </StyledFormItem>
      );
    } else if (this.props.metadata.type === "Boolean") {
      return (
        <StyledFormItem>
          <Form.Item
            label={this.props.metadata.display}
            name={this.props.fieldName}
            initialValue={this.props.metadata.default === "True"}
          >
            <Radio.Group buttonStyle="solid">
              <Radio.Button value={true}>Sí</Radio.Button>
              <Radio.Button value={false}>No</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </StyledFormItem>
      );
    } else if (this.props.metadata.type === "List:String") {
      return (
        <StyledFormItem>
          <Form.Item
            label={this.props.metadata.display}
            name={this.props.fieldName}
            initialValue={this.props.metadata.default}
          >
            <Select
              mode="tags"
              style={{ width: "100%" }}
              tokenSeparators={[","]}
            >
              {children}
            </Select>
          </Form.Item>
        </StyledFormItem>
      );
    } else if (this.props.metadata.type === "Table") {
      return <div />;
    } else {
      return <p>Ha ocurrido un error, por favor contáctenos.</p>;
    }
  }
}

export default withRouter(MutableComponent);
