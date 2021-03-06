import React from "react";
import {
  Table,
  Popconfirm,
  message,
  Input,
  Button,
  Row,
  Col,
  Modal,
  Form,
} from "antd";
import { SearchOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { withRouter } from "react-router-dom";
import Backend from "../Basics/Backend";

import moment from "moment";
const { TextArea } = Input;

class HomeCaseTable extends React.Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      info_case: {},
      visible: false,
      id_case_modal: "",
    };
  }

  showModal = (id) => {
    this.setState({
      visible: true,
      id_case_modal: id,
    });
  };

  handleSend = (archiveType, id) => {
    var values = {};
    values["id"] = id;

    if (archiveType === "Anular") {
      Backend.sendRequest("GET", `case?id=${id}`)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          data.cases[0]["approval_status"] = "Anular";
          data.cases[0]["archive_note"] = this.formRef.current.getFieldsValue(
            "archive_note"
          )["archive_note"];

          //Fix for tables (request returns each element in table within 'cases'):
          for (const key in data.cases[0]) {
            if (data.cases[0].hasOwnProperty(key)) {
              const element = data.cases[0][key];
              if (element[0] !== undefined) {
                if (typeof element[0][0] == "object") {
                  data.cases[0][key] = element[0];
                }
              }
            }
          }
          return this.setState({ info_case: data.cases[0] });
        })
        .then((_) => {
          Backend.sendRequest("PATCH", "case", {
            items: [this.state.info_case],
          }).then((response) => {
            if (response.status === 200) {
              message.success("Solicitud anulada exitosamente.");
              this.props.makeCasesQuery();
              this.formRef.current.setFieldsValue({
                archive_note: "",
              });
            } else if (response.status === 401) {
              message.error("Usuario sin autorización.");
            } else {
              message.error("Ha ocurrido un error anulando el caso.");
              console.error(
                "Login Error: Backend HTTP code " + response.status
              );
            }
          });
        });
    } else {
      Backend.sendRequest("GET", `case?id=${id}`)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          data.cases[0]["approval_status"] = "Desistir";
          data.cases[0]["archive_note"] = this.formRef.current.getFieldsValue(
            "archive_note"
          )["archive_note"];

          //Fix for tables (request returns each element in table within 'cases'):
          for (const key in data.cases[0]) {
            if (data.cases[0].hasOwnProperty(key)) {
              const element = data.cases[0][key];
              if (element[0] !== undefined) {
                if (typeof element[0][0] == "object") {
                  data.cases[0][key] = element[0];
                }
              }
            }
          }
          return this.setState({ info_case: data.cases[0] });
        })
        .then((_) => {
          Backend.sendRequest("PATCH", "case", {
            items: [this.state.info_case],
          }).then((response) => {
            if (response.status === 200) {
              message.success("Solicitud desistida exitosamente.");
              this.props.makeCasesQuery();
              this.formRef.current.setFieldsValue({
                archive_note: "",
              });
            } else if (response.status === 401) {
              message.error("Usuario sin autorización.");
            } else {
              message.error("Ha ocurrido un error desistiendo el caso.");
            }
          });
        });
    }
    this.setState({
      visible: false,
    });
  };

  getColumnSearchProps = (dataIndex, searchTerm) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`Buscar por ${searchTerm}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            this.handleSearch(selectedKeys, confirm, dataIndex)
          }
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Buscar
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters, dataIndex)}
          size="small"
          style={{ width: 90 }}
        >
          Limpiar
        </Button>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : "#000000" }} />
    ),
    onFilter: (value, record) => true,
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: (text) => text,
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.props.findCases(selectedKeys, dataIndex);
  };

  handleReset = (clearFilters, dataIndex) => {
    clearFilters();
    this.props.cleanQuery(dataIndex);
  };

  date_diff_indays = (now, created) => {
    created = created.replace(
      /(\d{4})-(\d{1,2})-(\d{1,2})/,
      function (match, y, m, d) {
        return m + "/" + d + "/" + y;
      }
    );
    var dt1 = new Date(now);
    var dt2 = new Date(created);
    return parseInt((dt1 - dt2) / (1000 * 60 * 60 * 24), 10);
  };

  markAsRecieved = (id, show) => {
    Backend.sendRequest("PATCH", `mark_received?id=${id}`).then((response) => {
      if (response.status === 200) {
        if (show) {
          message.success("Solicitud recibida correctamente.");
        }
        this.props.updateDataSource(id);
      } else {
        if (show) {
          message.error(
            "No se ha podido marcar como recibido. Es posible que falte un campo por llenar."
          );
        }
      }
    });
  };

  renderForm = () => {
    return (
      <Form layout="vertical" ref={this.formRef}>
        <Form.Item label="Motivo" name="archive_note" initialValue="">
          <TextArea
            placeholder="Inserte el motivo para desistir o anular el caso."
            rows={4}
          ></TextArea>
        </Form.Item>
      </Form>
    );
  };

  render() {
    var columns = [
      {
        title: "Tipo de solicitud",
        dataIndex: "_cls_display",
        key: "_cls_display",
        width: "25%",
        ...this.getColumnSearchProps("_cls_display", "tipo de solicitud"),
      },
      {
        title: "DNI",
        dataIndex: "student_dni",
        key: "student_dni",
        width: "10%",
        ...this.getColumnSearchProps("student_dni", "DNI"),
      },
      {
        title: "Nombres",
        dataIndex: "student_name",
        key: "student_name",
        width: "10%",
        ...this.getColumnSearchProps("student_name", "nombres"),
      },
      {
        title: "Plan de estudios",
        dataIndex: "academic_program",
        key: "academic_program",
        width: "10%",
        ...this.getColumnSearchProps("academic_program", "programa"),
      },
      {
        title: "Acta #",
        dataIndex: "consecutive_minute",
        key: "consecutive_minute",
        width: "8%",
        ...this.getColumnSearchProps("consecutive_minute", "acta"),
      },
      {
        title: "Año",
        dataIndex: "year",
        key: "year",
        width: "8%",
        ...this.getColumnSearchProps("year", "año"),
      },
      {
        title: "Periodo",
        dataIndex: "academic_period",
        key: "academic_period",
        width: "10%",
        ...this.getColumnSearchProps("academic_period", "periodo"),
      },
      {
        title: "Editar",
        key: "edit",
        width: "10%",
        render: (text, record) =>
          record.received_date !== "None" ? ( //If it has been recieved:
            <span>
              {/* eslint-disable-next-line */}
              <a
                onClick={() =>
                  this.props.history.push({
                    pathname: "/edit/" + record.id,
                    state: { _cls: record._cls },
                  })
                }
              >
                Editar
              </a>
              <br />
              {/* eslint-disable-next-line */}
              <a onClick={() => this.showModal(record.id)}>Archivar</a>
              <br />
              <Popconfirm
                title="¿Qué tipo de vista previa desea generar?"
                onConfirm={() => Backend.generateCouncil(false, record.id)}
                onCancel={() => Backend.generateCouncil(true, record.id)}
                okText="Consejo"
                cancelText="Comité"
                placement="left"
              >
                {/* eslint-disable-next-line */}
                <a>Vista Previa</a>
              </Popconfirm>
            </span>
          ) : (
            //Else - If it hasn't being marked as recieved:
            <span>
              <Popconfirm
                title="¿Desea marcar como recibido?"
                onConfirm={() => this.markAsRecieved(record.id, true)}
                okText="Sí"
                cancelText="No"
                placement="left"
              >
                {/* eslint-disable-next-line */}
                <a>Marcar como recibido</a>
              </Popconfirm>
            </span>
          ),
      },
    ];

    var columnsSecretary = [
      {
        title: "Tipo de solicitud",
        dataIndex: "_cls_display",
        key: "_cls_display",
        width: "25%",
        ...this.getColumnSearchProps("_cls_display", "tipo de solicitud"),
      },
      {
        title: "DNI",
        dataIndex: "student_dni",
        key: "student_dni",
        width: "10%",
        ...this.getColumnSearchProps("student_dni", "DNI"),
      },
      {
        title: "Nombres",
        dataIndex: "student_name",
        key: "student_name",
        width: "10%",
        ...this.getColumnSearchProps("student_name", "nombres"),
      },
      {
        title: "Plan de estudios",
        dataIndex: "academic_program",
        key: "academic_program",
        width: "10%",
        ...this.getColumnSearchProps("academic_program", "programa"),
      },
      {
        title: "Acta #",
        dataIndex: "consecutive_minute",
        key: "consecutive_minute",
        width: "8%",
        ...this.getColumnSearchProps("consecutive_minute", "acta"),
      },
      {
        title: "Año",
        dataIndex: "year",
        key: "year",
        width: "8%",
        ...this.getColumnSearchProps("year", "año"),
      },
      {
        title: "Periodo",
        dataIndex: "academic_period",
        key: "academic_period",
        width: "10%",
        ...this.getColumnSearchProps("academic_period", "periodo"),
      },
      {
        title: "Editar",
        key: "edit",
        width: "10%",
        render: (text, record) => (
          <span>
            {/* eslint-disable-next-line */}
            <a onClick={() => this.showModal(record.id)}>Archivar caso</a>
          </span>
        ),
      },
    ];

    return (
      <>
        <Table
          loading={this.props.loading}
          tableLayout="fixed"
          dataSource={this.props.dataSource}
          rowKey="id"
          bordered={true}
          size="small"
          columns={
            localStorage.getItem("type") !== "secretary"
              ? columns
              : columnsSecretary
          }
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            locale: { items_per_page: "por página" },
            pageSizeOptions: ["10", "20", "50", "100"],
            position: "bottom",
            size: "small",
            showTotal: showTotal,
            onChange: this.props.pagChange,
            onShowSizeChange: this.props.pagChange,
          }}
          expandedRowRender={(record) => (
            <>
              <Row>
                <Col span={1} />
                <Col span={8}>
                  <div>
                    <b>Fecha de radicación:</b> {record.date.substring(0, 10)}.
                  </div>
                  <div>
                    <b>Respuesta del Consejo de Facultad:</b>{" "}
                    {record.approval_status}.
                  </div>
                </Col>
                <Col span={8}>
                  <div>
                    <b>Existe respuesta del Comité Asesor: </b>
                    {record.advisor_response === "En espera" ? "No" : "Si"}.
                  </div>
                  <div>
                    <b>Instancia que decide:</b> {record.decision_maker}.
                  </div>
                </Col>
                <Col span={7}>
                  <div>
                    <b>Días desde la radicación:</b>{" "}
                    {this.date_diff_indays(
                      moment().format("MM/DD/YYYY"),
                      record.date
                    )}
                    .
                  </div>
                  <div>
                    <b>ID del caso:</b> {record.id}.
                  </div>
                </Col>
              </Row>

              {record.notes !== "None" ? (
                <Row>
                  <Col span={1} />
                  <Col span={23}>
                    <div>
                      <b>Nota adicionada al caso:</b> {record.notes}
                    </div>
                  </Col>
                </Row>
              ) : null}
            </>
          )}
        />
        <Modal
          visible={this.state.visible}
          title="Archivar caso"
          onCancel={() => this.setState({ visible: false })}
          footer={[
            <Button
              key="desistir"
              type="primary"
              onClick={() =>
                this.handleSend("Desistir", this.state.id_case_modal)
              }
            >
              Desistir caso
            </Button>,
            <Button
              key="anular"
              type="primary"
              onClick={() =>
                this.handleSend("Anular", this.state.id_case_modal)
              }
            >
              Anular caso
            </Button>,
            <Button
              icon={<CloseCircleOutlined />}
              key="cancelar"
              onClick={() => this.setState({ visible: false })}
            >
              Cancelar acción
            </Button>,
          ]}
        >
          {this.renderForm()}
        </Modal>
      </>
    );
  }
}

function showTotal(total) {
  return `Hay ${total} solicitudes`;
}

export default withRouter(HomeCaseTable);
