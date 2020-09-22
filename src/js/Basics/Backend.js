import { message } from "antd";

export default class Backend {
  static backEndUrl = "https://ingenieria.bogota.unal.edu.co/actas-api/";
  //static backEndUrl = "http://127.0.0.1:8000/council_minutes/";

  static openLink(url) {
    window.open(this.backEndUrl + url, "_blank");
  }

  static sendRequest(method, path, body) {
    return this.request(
      method,
      path,
      {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Token " + localStorage.getItem("jwt"),
      },
      body
    );
  }

  static sendLogin(username, password) {
    return this.request(
      "POST",
      "login",
      {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      {
        username: username,
        password: password,
      }
    );
  }

  static generateCouncil(isPre, recordId) {
    this.sendRequest("GET", `generate?pre=${isPre}&id=${recordId}`)
      .then((response) => response.json())
      .then((data) => {
        this.openLink(data.url);
      });
    if (isPre) {
      message.success("Acta de Comité Asesor generada exitosamente.");
    } else {
      message.success("Acta de Consejo de Facultad generada exitosamente.");
    }
  }

  static request(method, path, headers, body) {
    let answer = fetch(this.backEndUrl + path, {
      method: method,
      headers: headers,
      body: JSON.stringify(body),
    });
    answer.then((res) => {
      if (res.status === 401) {
        localStorage.removeItem("jwt");
        window.location.reload();
      }
    });
    return answer;
  }
}
