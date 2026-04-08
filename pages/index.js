import { v4 as uuidv4 } from "https://jspm.dev/uuid";
import { initialTodos, validationConfig } from "../utils/constants.js";
import Todo from "../components/Todo.js";
import FormValidator from "../components/FormValidator.js";
import Section from "../components/Section.js";
import PopupWithForm from "../components/PopupWithForm.js";
import TodoCounter from "../components/TodoCounter.js";

const addTodoButton = document.querySelector(".button_action_add");
const addTodoFormElement = document.querySelector(
  "#add-todo-popup .popup__form",
);

const formValidator = new FormValidator(validationConfig, addTodoFormElement);
formValidator.enableValidation();

const todoCounter = new TodoCounter(initialTodos, ".counter__text");

const generateTodo = (data) => {
  const todo = new Todo(
    data,
    "#todo-template",
    (isCompleted) => {
      todoCounter.updateCompleted(isCompleted);
    },
    (deletedTodo) => {
      if (deletedTodo.completed) {
        todoCounter.updateCompleted(false);
      }
      todoCounter.updateTotal(false);
    },
  );

  return todo.getView();
};

const section = new Section({
  items: initialTodos,
  renderer: (item) => {
    const todoElement = generateTodo(item);
    section.addItem(todoElement);
  },
  containerSelector: ".todos__list",
});

const addTodoPopup = new PopupWithForm("#add-todo-popup", (inputValues) => {
  let date = "";

  if (inputValues.date) {
    date = new Date(inputValues.date);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
  }

  const values = {
    name: inputValues.name,
    date,
    id: uuidv4(),
    completed: false,
  };

  const todoElement = generateTodo(values);
  section.addItem(todoElement);
  todoCounter.updateTotal(true);
  addTodoPopup.close();
  formValidator.resetValidation();
});

addTodoPopup.setEventListeners();

addTodoButton.addEventListener("click", () => {
  formValidator.resetValidation();
  addTodoPopup.open();
});

section.renderItems();
