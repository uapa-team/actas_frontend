import React from "react";
import auth from "../../../auth";
import BackEndUrl from "../../../backendurl";
import { Table, Popconfirm, message } from "antd";
import { withRouter } from "react-router-dom";

class CaseTable extends React.Component {
  confirmCancel = () => {
    message.success("Solicitud anulada exitosamente");
  };
  generateCouncil = (isPre, recordId) => {
    fetch(BackEndUrl + `generate?pre=${isPre}&id=${recordId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Token " + auth.getToken()
      }
    })
      .then(response => response.json())
      .then(data => {
        let link = BackEndUrl + data.url;
        window.open(link, "_blank");
      });
    if (isPre) {
      message.success("Acta de Comité Asesor Generada exitosamente");
    } else {
      message.success("Acta de Consejo de Facultad Generada exitosamente");
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
            {/* eslint-disable-next-line */}
            <Popconfirm
              title="¿Está seguro que desea anular la solicitud?"
              onConfirm={this.confirmCancel}
              okText="Sí"
              cancelText="No"
              placement="left"
            >
              <a>Anular</a>
            </Popconfirm>
            <br />
            {/* eslint-disable-next-line */}
            <Popconfirm
              title="¿Qué tipo de vista previa desea?"
              onConfirm={() => this.generateCouncil(false, record.id)}
              onCancel={() => this.generateCouncil(true, record.id)}
              okText="Consejo"
              cancelText="Comité"
              placement="left"
            >
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
