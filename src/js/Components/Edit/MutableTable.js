import React from "react";
import {
  Form,
  Input,
  Table,
  Popconfirm,
  Button,
  Icon,
  Select,
  InputNumber,
} from "antd";
import { withRouter } from "react-router-dom";
import { PrimButton } from "../Home/HomeStyles";
import _ from "lodash";
import "./Edit.css";

const { Option } = Select;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false,
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  save = (e) => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        console.log(error);
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };

  renderCell = (form) => {
    this.form = form;
    const {
      children,
      dataIndex,
      title,
      dataType,
      choices,
      record,
    } = this.props;
    const { editing } = this.state;
    if (!editing) {
      return (
        <div
          className="editable-cell-value-wrap"
          style={{ paddingRight: 24 }}
          onClick={this.toggleEdit}
        >
          {children}
        </div>
      );
    } else {
      if (dataType === "String") {
        if (choices) {
          return (
            <Form.Item>
              {form.getFieldDecorator(dataIndex, {
                initialValue: record[dataIndex],
                rules: [
                  {
                    required: true,
                    message: `${title} es requerido.`,
                  },
                ],
              })(
                <Select
                  showSearch
                  placeholder={title}
                  ref={(node) => (this.input = node)}
                  onPressEnter={this.save}
                  onBlur={this.save}
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
                  {(() => {
                    return choices.map((ch) => {
                      return (
                        <Option value={ch} key={ch}>
                          {ch.normalize("NFD").replace(/[\u0300-\u036f]/g, "")}
                        </Option>
                      );
                    });
                  })()}
                </Select>
              )}
            </Form.Item>
          );
        } else {
          return (
            <Form.Item>
              {form.getFieldDecorator(dataIndex, {
                initialValue: record[dataIndex],
                rules: [
                  {
                    required: true,
                    message: `${title} es requerido.`,
                  },
                ],
              })(
                <Input
                  ref={(node) => (this.input = node)}
                  onPressEnter={this.save}
                  onBlur={this.save}
                  placeholder={title}
                />
              )}
            </Form.Item>
          );
        }
      } else if (dataType === "Integer") {
        return (
          <Form.Item>
            {form.getFieldDecorator(dataIndex, {
              initialValue: record[dataIndex],
              rules: [
                {
                  required: true,
                  message: `${title} es requerido.`,
                },
              ],
            })(
              <InputNumber
                ref={(node) => (this.input = node)}
                onPressEnter={this.save}
                onBlur={this.save}
              />
            )}
          </Form.Item>
        );
      } else if (dataType === "Boolean") {
        return (
          <Form.Item>
            {form.getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `${title} es requerido.`,
                },
              ],
            })(
              <Select
                showSearch
                placeholder={title}
                ref={(node) => (this.input = node)}
                onPressEnter={this.save}
                onBlur={this.save}
                optionFilterProp="children"
              >
                <Option value="True">Si</Option>
                <Option value="False">No</Option>
              </Select>
            )}
          </Form.Item>
        );
      } else {
        return (
          <div>Esto es un error, por favor contacte la extensión 13578.</div>
        );
      }
    }
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      dataType,
      choices,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}

class MutableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: this.props.dataSource,
      editingKey: "",
    };
    this.columns = [];
    Object.entries(this.props.metadata.fields).forEach((fld) => {
      if (fld[1].display === "Tipología") {
        this.columns.push({
          title: fld[1].display,
          dataIndex: fld[0],
          editable: true,
          dataType: fld[1].type,
          choices: fld[1].choices,
          width: 250,
        });
      } else if (fld[1].display === "Créditos" || fld[1].display === "Grupo") {
        this.columns.push({
          title: fld[1].display,
          dataIndex: fld[0],
          editable: true,
          dataType: fld[1].type,
          choices: fld[1].choices,
          width: 110,
        });
      } else if (fld[1].display === "Código") {
        this.columns.push({
          title: fld[1].display,
          dataIndex: fld[0],
          editable: true,
          dataType: fld[1].type,
          choices: fld[1].choices,
          width: 200,
        });
      } else {
        this.columns.push({
          title: fld[1].display,
          dataIndex: fld[0],
          editable: true,
          dataType: fld[1].type,
          choices: fld[1].choices,
          width: 250,
        });
      }
    });

    this.columns[0]["fixed"] = "left";
    this.columns[0]["width"] = 300;

    this.columns.push({
      title: "Eli.",
      dataIndex: "operation",
      fixed: "right",
      render: (text, record) =>
        this.state.dataSource.length >= 1 ? (
          <Popconfirm
            title="¿Está seguro?"
            okText="Sí"
            cancelText="No"
            onConfirm={() => this.handleDelete(record.key)}
          >
            {/* eslint-disable-next-line */}
            <Icon type="delete" />
          </Popconfirm>
        ) : null,
    });
  }

  handleAdd = () => {
    let newItem = { key: this.state.dataSource.length };
    Object.entries(this.props.metadata.fields).forEach((fld) => {
      newItem[fld[0]] = fld[1]["default"];
      if (newItem[fld[0]] === "" || fld[1]["default"] === null) {
        if (fld[1]["type"] === "Integer") {
          newItem[fld[0]] = 1;
        } else {
          newItem[fld[0]] = fld[1]["display"];
        }
      }
    });

    let newDataSource = this.state.dataSource.concat(newItem);
    this.setState({
      dataSource: newDataSource,
    });
  };

  handleDelete = (key) => {
    const dataSource = [...this.state.dataSource];
    this.setState({
      dataSource: dataSource.filter((item) => item.key !== key),
    });
  };

  handleSave = (row) => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ dataSource: newData });
    this.saveInForm();
  };

  saveInForm() {
    var toReturn = {};
    var dataAux = _.cloneDeep(this.state.dataSource);
    toReturn[`${this.props.fieldName}`] = {
      value: dataAux,
      errors: [],
    };
    toReturn[`${this.props.fieldName}`].value.forEach((i) => {
      delete i.key;
    });
    this.props.form.setFields(toReturn);
  }

  isEditing = (record) => record.key === this.state.editingKey;

  edit(key) {
    this.setState({ editingKey: key });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map((col) => {
      console.log(col);
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
          dataType: col.dataType,
          choices: col.choices,
        }),
      };
    });
    return (
      <div>
        <div
          style={{
            position: "absolute",
            display: "flex",
            justifyContent: "flex-end",
            width: "100%",
            zIndex: "1",
          }}
        >
          <PrimButton>
            <Button
              onClick={this.handleAdd}
              type="primary"
              style={{ marginBottom: 16 }}
              icon="plus-circle"
            >
              {`Añadir ${this.props.metadata.display}`}
            </Button>
          </PrimButton>
        </div>
        <Form.Item label={this.props.metadata.display}>
          {getFieldDecorator(this.props.fieldName, {
            initialValue: this.props.metadata.default,
          })(
            <Table
              components={components}
              rowClassName={() => "editable-row"}
              bordered
              dataSource={dataSource}
              columns={columns}
              scroll={{ x: 1800, y: 300 }}
            />
          )}
        </Form.Item>
      </div>
    );
  }

  componentDidMount() {
    this.saveInForm();
  }
}

export default withRouter(Form.create({ name: "mutable_table" })(MutableTable));
