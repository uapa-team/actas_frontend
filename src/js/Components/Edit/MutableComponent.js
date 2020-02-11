import React from "react";
import moment from "moment";
import {
  Form,
  Input,
  DatePicker,
  Select,
  InputNumber,
  Radio,
  Button,
  Modal,
  Table,
  Popconfirm
} from "antd";
import { withRouter } from "react-router-dom";
import { StyledFormItem } from "./EditStyles";

const { Option } = Select;
const children = [];
class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {
          key: "0",
          name: "Cálculo Diferencial",
          code: "1000002",
          tipology: "B"
        },
        {
          key: "1",
          name: "Cálculo Integral",
          code: "1000003",
          tipology: "B"
        }
      ],
      editingKey: ""
    };
    this.columns = [
      {
        title: "Código",
        dataIndex: "code",
        width: "50%",
        editable: true
      },
      {
        title: "Tipología",
        dataIndex: "tipology",
        width: "25%",
        editable: true
      },
      {
        title: "Nombre",
        dataIndex: "name",
        width: "120%",
        editable: true
      },
      {
        title: "Operación",
        dataIndex: "operation",
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return editable ? (
            <span>
              <EditableContext.Consumer>
                {form => (
                  // eslint-disable-next-line
                  <a
                    onClick={() => this.save(form, record.key)}
                    style={{ marginRight: 8 }}
                  >
                    Guardar
                  </a>
                )}
              </EditableContext.Consumer>
              <Popconfirm
                title="Seguro que desea cancelar?"
                onConfirm={() => this.cancel(record.key)}
                okText="Sí"
                cancelText="No"
              >
                {/* eslint-disable-next-line */}
                <a>Cancelar</a>
              </Popconfirm>
            </span>
          ) : (
            // eslint-disable-next-line
            <a
              disabled={editingKey !== ""}
              onClick={() => this.edit(record.key)}
            >
              Editar
            </a>
          );
        }
      }
    ];
  }

  isEditing = record => record.key === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: "" });
  };

  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row
        });
        this.setState({ data: newData, editingKey: "" });
      } else {
        newData.push(row);
        this.setState({ data: newData, editingKey: "" });
      }
    });
  }

  edit(key) {
    this.setState({ editingKey: key });
  }

  render() {
    const components = {
      body: {
        cell: EditableCell
      }
    };

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === "age" ? "number" : "text",
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record)
        })
      };
    });

    return (
      <EditableContext.Provider value={this.props.form}>
        <Table
          components={components}
          bordered
          dataSource={this.state.data}
          columns={columns}
          rowClassName="editable-row"
          pagination={{
            onChange: this.cancel
          }}
        />
      </EditableContext.Provider>
    );
  }
}

const EditableContext = React.createContext();
class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === "number") {
      return <InputNumber />;
    }
    return <Input />;
  };

  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`
                }
              ],
              initialValue: record[dataIndex]
            })(this.getInput())}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  render() {
    return (
      <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
    );
  }
}
const EditableFormTable = Form.create()(EditableTable);
class MutableComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableVisible: false
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
    const { getFieldDecorator } = this.props.form;
    if (this.props.metadata.type === "String") {
      if (Object.keys(this.props.metadata).includes("choices")) {
        return (
          <StyledFormItem>
            <Form.Item
              label={this.props.metadata.display}
              // style={{ marginBottom: "0px", paddingLeft: "10px" }}
            >
              {getFieldDecorator(this.props.fieldName, {
                initialValue: this.props.metadata.default
              })(
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
              )}
            </Form.Item>
          </StyledFormItem>
        );
      } else {
        return (
          <StyledFormItem>
            <Form.Item
              label={this.props.metadata.display}
              // style={{ marginBottom: "0px", paddingLeft: "10px" }}
            >
              {getFieldDecorator(this.props.fieldName, {
                initialValue: this.props.metadata.default
              })(<Input placeholder={this.props.metadata.display} />)}
            </Form.Item>
          </StyledFormItem>
        );
      }
    } else if (this.props.metadata.type === "Integer") {
      return (
        <StyledFormItem>
          <Form.Item
            label={this.props.metadata.display}
            // style={{ marginBottom: "0px", paddingLeft: "10px" }}
          >
            {getFieldDecorator(this.props.fieldName, {
              initialValue: this.props.metadata.default
            })(<InputNumber />)}
          </Form.Item>
        </StyledFormItem>
      );
    } else if (this.props.metadata.type === "Float") {
      return (
        <StyledFormItem>
          <Form.Item
            label={this.props.metadata.display}
            // style={{ marginBottom: "0px", paddingLeft: "10px" }}
          >
            {getFieldDecorator(this.props.fieldName, {
              initialValue: this.props.metadata.default
            })(<InputNumber step={0.1} />)}
          </Form.Item>
        </StyledFormItem>
      );
    } else if (this.props.metadata.type === "Date") {
      return (
        <StyledFormItem>
          <Form.Item
            label={this.props.metadata.display}
            // style={{ marginBottom: "0px", paddingLeft: "10px" }}
          >
            {getFieldDecorator(this.props.fieldName, {
              initialValue: moment(this.props.metadata.default, "YYYY-MM-DD")
            })(<DatePicker placeholder="Seleccione fecha" />)}
          </Form.Item>
        </StyledFormItem>
      );
    } else if (this.props.metadata.type === "Boolean") {
      return (
        <StyledFormItem>
          <Form.Item
            label={this.props.metadata.display}
            // style={{ marginBottom: "0px", paddingLeft: "10px" }}
          >
            {getFieldDecorator(this.props.fieldName, {
              initialValue: this.props.metadata.default
            })(
              <Radio.Group buttonStyle="solid">
                <Radio.Button value={true}>Sí</Radio.Button>
                <Radio.Button value={false}>No</Radio.Button>
              </Radio.Group>
            )}
          </Form.Item>
        </StyledFormItem>
      );
    } else if (this.props.metadata.type === "List:String") {
      return (
        <StyledFormItem>
          <Form.Item
            label={this.props.metadata.display}
            // style={{ marginBottom: "0px", paddingLeft: "10px" }}
          >
            {getFieldDecorator(
              this.props.fieldName,
              {}
            )(
              <Select
                mode="tags"
                style={{ width: "100%" }}
                tokenSeparators={[","]}
              >
                {children}
              </Select>
            )}
          </Form.Item>
        </StyledFormItem>
      );
    } else if (this.props.metadata.type === "Table") {
      return (
        <StyledFormItem>
          <Form.Item label={this.props.metadata.display}>
            <Button
              onClick={e => {
                e.preventDefault();
                this.setState({ tableVisible: true });
              }}
              type="primary"
            >
              {`Añadir ${this.props.metadata.display}`}
            </Button>
            <Modal
              title={`Añadir ${this.props.metadata.display}`}
              visible={this.state.tableVisible}
              onCancel={() => {
                this.setState({ tableVisible: false });
              }}
              onOk={() => {
                this.setState({ tableVisible: false });
              }}
              footer={[
                <Button
                  key="cancel"
                  onClick={() => {
                    this.setState({ tableVisible: false });
                  }}
                >
                  Cancelar
                </Button>,
                <Button
                  key="save"
                  type="primary"
                  onClick={() => {
                    this.setState({ tableVisible: false });
                  }}
                >
                  {`Guardar ${this.props.metadata.display}`}
                </Button>
              ]}
            >
              <EditableFormTable />
            </Modal>
          </Form.Item>
        </StyledFormItem>
      );
    } else {
      return (
        <StyledFormItem>
          <Form.Item
            label={this.props.metadata.display}
            // style={{ marginBottom: "0px", paddingLeft: "10px" }}
          >
            {getFieldDecorator(this.props.fieldName)(<Input />)}
          </Form.Item>
        </StyledFormItem>
      );
    }
  }
}

const WrappedComponent = Form.create({ name: "mutable_component" })(
  MutableComponent
);

export default withRouter(Form.create()(WrappedComponent));
