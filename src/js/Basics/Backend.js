import { message } from "antd";

export default class Backend {
  // For local env:
  //static backEndUrl = "http://127.0.0.1:8000/council_minutes/";

  // Test env:
  //static backEndUrl = "http://168.176.26.91:9900/council_minutes/";

  // Deploy env:
  static backEndUrl = "https://ingenieria.unal.edu.co/actas-api/";

  // Mailer:
  static uapappUrl = "https://www.ingenieria.unal.edu.co/uapapp_api/";

  static openLink(url) {
    window.open(this.backEndUrl + url, "_blank");
  }

  static sendRequest(method, path, body) {
    let headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    if (path !== "make_suggestion") {
      headers["Authorization"] = "Token " + localStorage.getItem("jwt");
    }

    return this.request(method, path, headers, body);
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
    let fullURL = this.backEndUrl + path;
    if (path === "make_suggestion") {
      fullURL = this.uapappUrl + path;
    }
    let answer = fetch(fullURL, {
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
