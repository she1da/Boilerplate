function ElementBuilder(name) {
  this.element = document.createElement(name);

  this.text = function (text) {
    this.element.textContent = text;
    return this;
  };

  this.name = function (name) {
    this.element.name = name;
    return this;
  };

  this.getValue = function () {
    return this.element.value;
  };

  this.setValue = function (value) {
    this.element.value = value;
    return this;
  };

  this.appendTo = function (parent) {
    parent.append(this.element);
    return this;
  };

  this.placeholder = function (placeholder) {
    this.element.placeholder = placeholder;
    return this;
  };

  this.type = function (type) {
    this.element.type = type;
    return this;
  };

  this.styles = function (...styles) {
    this.element.classList.add(...styles);
    return this;
  };

  this.id = function (id) {
    this.element.id = id;
    return this;
  };

  this.onclick = function (func) {
    this.element.onclick = func;
    return this;
  };

  this.build = function () {
    return this.element;
  };
}

const builder = {
  create: function (name) {
    return new ElementBuilder(name);
  },
};

function CalorieRecord(type, amount) {
  this.type = type;
  this.amount = amount;
}

function CalorieTracker() {
  this.records = JSON.parse(localStorage.getItem("calorieRecords") || "[]");

  this.add = function (type, amount) {
    const newRecord = new CalorieRecord(type, parseFloat(amount));
    this.records.unshift(newRecord);
    this.updateLocalStorage();
  };

  this.remove = function (index) {
    if (index >= 0 && index < this.records.length) {
      this.records.splice(index, 1);
      this.updateLocalStorage();
    }
  };

  this.edit = function (index, newAmount) {
    if (index >= 0 && index < this.records.length) {
      const parsedAmount = parseFloat(newAmount);
      if (!isNaN(parsedAmount) && parsedAmount > 0) {
        this.records[index].amount = parsedAmount;
        this.updateLocalStorage();
      }
    }
  };

  this.updateLocalStorage = function () {
    localStorage.setItem("calorieRecords", JSON.stringify(this.records));
  };
}

function Render(container) {
  this.container = container;
  let divDetails, errMessage;
  const calorieTracker = new CalorieTracker();

  this.init = function () {
    const divContent = builder
      .create("div")
      .styles("content")
      .appendTo(this.container)
      .build();

    const contentTitle = builder
      .create("h1")
      .text("Calorie Tracker")
      .styles("title-custom")
      .appendTo(divContent)
      .build();

    const inputAmount = builder
      .create("input")
      .styles("inp")
      .type("number")
      .name("amount")
      .placeholder("Enter calories")
      .appendTo(divContent);

    errMessage = builder
      .create("p")
      .styles("err-message")
      .appendTo(divContent)
      .build();

    const addGainedBtn = builder
      .create("button")
      .text("Add Gained Calories")
      .onclick(() => {
        const amount = inputAmount.getValue();
        if (checkValue(amount)) {
          calorieTracker.add("gained", amount);
          inputAmount.setValue(null);
          updateCalorieList();
        }
      })
      .styles("tracker-button")
      .appendTo(divContent);

    const addBurnedBtn = builder
      .create("button")
      .text("Add Burned Calories")
      .onclick(() => {
        const amount = inputAmount.getValue();
        if (checkValue(amount)) {
          calorieTracker.add("burned", amount);
          inputAmount.setValue(null);
          updateCalorieList();
        }
      })
      .styles("tracker-button")
      .appendTo(divContent);

    divDetails = builder
      .create("div")
      .id("divDetails")
      .styles("tracker-table")
      .appendTo(divContent)
      .build();

    updateCalorieList();
  };

  function checkValue(amount) {
    errMessage.textContent = "";
    if (amount === null || amount === "" || isNaN(amount) || amount <= 0) {
      errMessage.textContent = "Please enter a valid calorie amount!";
      return false;
    }
    return true;
  }

  function updateCalorieList() {
    divDetails.innerHTML = "";
    if (calorieTracker.records.length === 0) {
      divDetails.textContent = "No calorie records found.";
      return;
    }

    const listContainer = builder
      .create("ul")
      .styles("calorie-list")
      .appendTo(divDetails)
      .build();

    calorieTracker.records.forEach((item, index) => {
      const listItem = builder
        .create("li")
        .styles("calorie-item")
        .appendTo(listContainer)
        .build();

      const itemText = `${item.type === "gained" ? "+" : "-"}${
        item.amount
      } calories`;

      const detailText = builder
        .create("span")
        .text(itemText)
        .appendTo(listItem)
        .build();

      const editBtn = builder
        .create("button")
        .text("Edit")
        .styles("btn-edit")
        .onclick(() => {
          const newAmount = prompt("Enter new amount", item.amount);
          if (newAmount !== null) {
            calorieTracker.edit(index, newAmount);
            updateCalorieList();
          }
        })
        .appendTo(listItem)
        .build();

      const deleteBtn = builder
        .create("button")
        .text("Delete")
        .styles("btn-delete")
        .onclick(() => {
          calorieTracker.remove(index);
          updateCalorieList();
        })
        .appendTo(listItem)
        .build();
    });
  }
}

const calorieTrackerContainer = document.getElementById(
  "calorie-tracker-container"
);
const app = new Render(calorieTrackerContainer);
app.init();
