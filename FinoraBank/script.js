document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
  const currentUrl = window.location.pathname.split("/").pop();

  navLinks.forEach(link => {
    if (link.getAttribute("href") === currentUrl) {
      link.classList.add("active");
    }
  });

  // Обновление кнопки "Личный кабинет"
  updateMenuButtons();
});

// Функция для получения GET-параметров из URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Автоматическая регистрация при наличии GET-параметров
function handleGetParams() {
  const name = getQueryParam('name');
  const email = getQueryParam('email');
  const password = getQueryParam('password');

  if (name && email && password) {
    registerUser({
      target: {
        elements: {
          name: { value: decodeURIComponent(name) },
          email: { value: decodeURIComponent(email) },
          password: { value: decodeURIComponent(password) }
        }
      }
    });
  }
}

// Проверяет, авторизован ли пользователь
function isUserLoggedIn() {
  return localStorage.getItem('currentUser') !== null;
}

// Обновляет видимость кнопки "Личный кабинет"
function updateMenuButtons() {
  const profileBtn = document.querySelector('.btn[href="profile.html"]');
  if (isUserLoggedIn()) {
    profileBtn.style.display = 'inline-block';
    profileBtn.classList.remove('btn-outline-primary');
    profileBtn.classList.add('btn-success');
  } else {
    profileBtn.style.display = 'none';
  }
}

// Регистрация нового пользователя
function registerUser(event) {
  event.preventDefault();

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  let isValid = true;

  if (!nameInput.value.trim()) {
    alert("Пожалуйста, введите ваше имя.");
    isValid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailInput.value)) {
    alert("Пожалуйста, введите корректный адрес электронной почты.");
    isValid = false;
  }

  if (!passwordInput.value.trim()) {
    alert("Пожалуйста, введите пароль.");
    isValid = false;
  } else if (passwordInput.value.length < 6) {
    alert("Пароль должен содержать не менее 6 символов.");
    isValid = false;
  }

  if (isValid) {
    const user = {
      name: nameInput.value,
      email: emailInput.value,
      password: passwordInput.value
    };

    let users = JSON.parse(localStorage.getItem('users')) || [];

    const existingUser = users.find(u => u.email === user.email);

    if (existingUser) {
      alert("Пользователь с таким email уже существует!");
      return;
    }

    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));

    alert("Вы успешно зарегистрированы!");
    window.location.href = "login.html";
  }
}

// Авторизация
function loginUser(event) {
  event.preventDefault();

  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  let users = JSON.parse(localStorage.getItem('users')) || [];
  const foundUser = users.find(
    user => user.email === emailInput.value && user.password === passwordInput.value
  );

  if (foundUser) {
    localStorage.setItem('currentUser', JSON.stringify(foundUser));
    window.location.href = "profile.html";
  } else {
    alert("Неверный email или пароль.");
  }
}

// Проверка авторизации и заполнение профиля
function checkLogin() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  const usernameEl = document.getElementById("username");
  const useremailEl = document.getElementById("useremail");
  const userpasswordEl = document.getElementById("userpassword");

  if (usernameEl && useremailEl && userpasswordEl) {
    usernameEl.innerText = currentUser.name || "Не указано";
    useremailEl.innerText = currentUser.email || "Не указано";
    userpasswordEl.innerText = currentUser.password || "Не указано";
  } else {
    console.warn("Элементы #username, #useremail, #userpassword не найдены!");
  }
}

// Выход из аккаунта
function logout() {
  if (confirm("Вы уверены, что хотите выйти из аккаунта?")) {
    localStorage.removeItem('currentUser');
    window.location.href = "login.html";
  }
}

// Отправка сообщения через контактную форму
function sendContactEmail(event) {
  event.preventDefault();

  const form = event.target;
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');

  let isValid = true;

  if (!nameInput.value.trim()) {
    alert("Пожалуйста, введите ваше имя.");
    isValid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailInput.value)) {
    alert("Пожалуйста, введите корректный адрес электронной почты.");
    isValid = false;
  }

  if (!messageInput.value.trim()) {
    alert("Пожалуйста, введите сообщение.");
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  const formData = new FormData(form);
  const name = formData.get('name');
  const email = formData.get('email');
  const message = formData.get('message');

  window.location.href = `mailto:infofinora@bk.ru?subject=Сообщение%20от%20пользователя&body=Имя:%20${encodeURIComponent(name)}%0D%0AEmail:%20${encodeURIComponent(email)}%0D%0АСообщение:%20${encodeURIComponent(message)}`;

  alert("Ваше сообщение отправлено!");

  setTimeout(() => {
    window.location.href = "index.html";
  }, 2000);
}

// Функция для переключения доступного режима
function toggleAccessibleMode() {
  document.body.classList.toggle('accessible-mode');
}
document.getElementById("toggleAccessibility")?.addEventListener("click", function () {
  toggleAccessibleMode();
});

// Валидация форм Bootstrap
(() => {
  'use strict';
  const forms = document.querySelectorAll('.needs-validation');
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });
})();

// Инициализация при загрузке страницы
window.addEventListener("DOMContentLoaded", function () {
  handleGetParams(); // Если есть GET-параметры
  updateMenuButtons(); // Обновление кнопок
});