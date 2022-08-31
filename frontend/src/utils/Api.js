class Api {
  constructor(config) {
    this._baseUrl = config.baseUrl;
    this._headers = config.headers;
  }

  // .then((res) => {
  //   if (res.ok) {
  //     return res.json();
  //   }
  //   // если ошибка, отклоняем промис
  //   return Promise.reject(`Ошибка: ${res.status}`);
  // });

  handleResponse(res) {
    if (res.ok) {      
      return res.json();
      
    }
    // если ошибка, отклоняем промис
    return Promise.reject(`Ошибка: ${res.status}`);
  };

  //получаем данные карточек для дальнейшей вставки
  getInitialCards() {
    return fetch(`${this._baseUrl}cards`, {
      method: "GET",
      headers: this._headers,
    }).then((res) => this.handleResponse(res));
  }

  //!!!USER  получаем данные с сервера о пользователе
  getInitialUser() {
    return fetch(`${this._baseUrl}users/me`, {
      method: "GET",
      headers: this._headers,
    }).then((res) => this.handleResponse(res));
  }

  //!!USER

  patchUserInfoNameAbout(name, profession) {
    return fetch(`${this._baseUrl}users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        name: name,
        about: profession,
      }),
    }).then((res) => this.handleResponse(res));
  }

  postCard(name, link) {
    return fetch(`${this._baseUrl}cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        name: name,
        link: link,
      }),
    }).then((res) => this.handleResponse(res));
  }

  deleteCard(id) {
    return fetch(`${this._baseUrl}cards/${id}`, {
      method: "DELETE",
      headers: this._headers,
    }).then((res) => this.handleResponse(res));
  }

  getOneCard(id) {
    return fetch(`${this._baseUrl}cards/${id}`, {
      method: "GET",
      headers: this._headers,
    }).then((res) => this.handleResponse(res));
  }

  changeLikeCardStatus(id, met) {
    return fetch(`${this._baseUrl}cards/${id}/likes`, {
      method: met,
      headers: this._headers,
    }).then((res) => this.handleResponse(res));
  }

  deleteLikeCard(id) {
    return fetch(`${this._baseUrl}cards/${id}/likes`, {
      method: "DELETE",
      headers: this._headers,
    }).then((res) => this.handleResponse(res));
  }

  //!!!USER
  patchAvatar(link) {
    return fetch(`${this._baseUrl}users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        avatar: link,
      }),
    }).then((res) => this.handleResponse(res));
  }
}

let jwt = localStorage.getItem("jwt");

const api = new Api({
  baseUrl: "https://api.kukreshma.students.nomoredomains.sbs/",
  headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      }
});

export { Api };

export { api };
