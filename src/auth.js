class Auth {
  constructor() {
    this.authenticated = false;
    this.token = null;
  }

  login(cb) {
    this.authenticated = true;
    cb();
  }

  logout(cb) {
    this.authenticated = false;
    cb();
  }

  isAuthenticated() {
    return this.authenticated;
  }

  getToken() {
    return this.token;
  }

  setToken(token) {
    this.token = token;
  }
}

export default new Auth();
