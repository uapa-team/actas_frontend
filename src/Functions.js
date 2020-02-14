import { message } from "antd";
import Backend from "./serviceBackend";

export default class Functions {
  static generateCouncil(isPre, recordId) {
    Backend.sendRequest("GET", `generate?pre=${isPre}&id=${recordId}`)
      .then(response => response.json())
      .then(data => {
        Backend.openLink(data.url);
      });
    if (isPre) {
      message.success("Acta de Comité Asesor Generada exitosamente");
    } else {
      message.success("Acta de Consejo de Facultad Generada exitosamente");
    }
  }
}
