import React from "react";
import { Table } from "antd";
import { withRouter } from "react-router-dom";

class CaseTable extends React.Component {
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
            <a href="delete">Anular</a>
            <br />
            <a href="preview">Vista previa</a>
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
