import React from "react";
import Backend from "../../../serviceBackend";
import { Table, Popconfirm, message } from "antd";
import { withRouter } from "react-router-dom";
import Functions from "../../../Functions";

class CaseTable extends React.Component {
  confirmCancel = archiveType => {
    if (archiveType) {
      message.success("Solicitud anulada exitosamente");
    } else {
      message.success("Solicitud desistida exitosamente");
    }
  };
  render() {
    var columns = [
      { title: "Tipo", dataIndex: "_cls_display", key: "_cls_display" },
      { title: "DNI", dataIndex: "student_dni", key: "student_dni" },
      { title: "Nombres", dataIndex: "student_name", key: "student_name" },
      { title: "Plan", dataIndex: "academic_program", key: "academic_program" },
      {
        title: "Creación",
        dataIndex: "date_stamp",
        key: "date_stamp",
        width: "10%"
      },
      { title: "Radicación", dataIndex: "date", key: "date", width: "10%" },
      {
        title: "Número",
        dataIndex: "consecutive_minute",
        key: "consecutive_minute"
      },
      { title: "Año", dataIndex: "year", key: "year" },
      {
        title: "Periodo",
        dataIndex: "academic_period",
        key: "academic_period",
        width: "8%"
      },
      {
        title: "Rta CF",
        dataIndex: "approval_status",
        key: "approval_status",
        width: "8%"
      },
      {
        title: "Rta CA",
        dataIndex: "advisor_response",
        key: "advisor_response",
        width: "8%"
      },
      {
        title: "Editar",
        key: "edit",
        width: "8%",
        render: (text, record) => (
          <span>
            {/* eslint-disable-next-line */}
            <a
              onClick={() =>
                this.props.history.push({
                  pathname: "/edit/" + record.id,
                  state: { _cls: record._cls }
                })
              }
            >
              Editar
            </a>
            <br />
            <Popconfirm
              title="¿Qué acción desea tomar con la solicitud?"
              onConfirm={() => this.confirmCancel(true)}
              onCancel={() => this.confirmCancel(false)}
              okText="Anular"
              cancelText="Desistir"
              placement="left"
            >
              {/* eslint-disable-next-line */}
              <a>Archivar</a>
            </Popconfirm>
            <br />
            <Popconfirm
              title="¿Qué tipo de vista previa desea generar?"
              onConfirm={() => Functions.generateCouncil(false, record.id)}
              onCancel={() => Functions.generateCouncil(true, record.id)}
              okText="Consejo"
              cancelText="Comité"
              placement="left"
            >
              {/* eslint-disable-next-line */}
              <a>Vista Previa</a>
            </Popconfirm>
          </span>
        )
      }
    ];
    return (
      <Table dataSource={this.props.dataSource} columns={columns} rowKey="id" />
    );
  }
}

export default withRouter(CaseTable);
