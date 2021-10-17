let visible = [], hidden = [], inputs = [];

const datatable = new simpleDatatables.DataTable("table", {
  // Customise the display text
  labels: {
    placeholder: "Pesquisa...", // The search input placeholder
    perPage: "{select} Linhas por página", // per-page dropdown label
    noRows: "Entradas não encontradas", // Message shown when there are no search results
    info: "Mostrando {start} até {end} de {rows} linhas" //
  },
})

datatable.on("datatable.init", function () {
  setCheckboxes()
});

let containerSelect = util.createElement("div", { class: "container-select"});
let selection = util.createElement("div", { class: "multiple-selection"});
let selectionCheckBoxes = util.createElement("div", { class: "check-boxes"});
let selectBox = util.createElement("div", { class: "selectBox", onclick: "showCheckboxes()" });
let select = util.createElement("select");
let selectOption = util.createElement("option");
let overSelect = util.createElement("div", { class: "overSelect"});

selectOption.innerHTML = "Selecionar";
containerSelect.innerHTML = "&nbsp;Colunas exibidas";

select.appendChild(selectOption);

selectBox.append(select, overSelect);
selection.append(selectBox, selectionCheckBoxes);
containerSelect.appendChild(selection);

const checkboxes = document.getElementsByClassName("dataTable-top")[0];

checkboxes.insertBefore(containerSelect, checkboxes.children[1]);

datatable.on("datatable.init", function () {
  setCheckboxes()
});

function updateColumns() {
  try {
    datatable.columns().show(visible);
    datatable.columns().hide(hidden);
  } catch (e) {
    console.log(e);
  }
}

function setCheckboxes() {
  inputs = [];
  visible = [];
  selectionCheckBoxes.innerHTML = "";

  util.each(datatable.headings, function (i, heading) {
    let input = util.createElement("input", { class: "checkbox", type: "checkbox", id: "checkbox-" + i, name: "checkbox" });
    let label = util.createElement("label", { class: "checkbox", for: "checkbox-" + i, text: heading.textContent });

    input.idx = i;

    if (datatable.columns().visible(heading.cellIndex)) {
      input.checked = true;
      visible.push(i);
    } else {
      if (hidden.indexOf(i) < 0) {
        hidden.push(i);
      }
    }

    label.prepend(input);

    selectionCheckBoxes.appendChild(label);

    inputs.push(input);
  });

  util.each(inputs, function (i, input) {

    input.onchange = function (e) {
      if (input.checked) {
        hidden.splice(hidden.indexOf(input.idx), 1);
        visible.push(input.idx);
      } else {
        visible.splice(visible.indexOf(input.idx), 1);
        hidden.push(input.idx);
      }

      updateColumns();
    };
  });
}

// Select with checkboxes
let show = true;

function showCheckboxes() {
  
  let checkboxes = document.getElementsByClassName("check-boxes")[0];

  if (show) {
    checkboxes.style.display = "block";
    show = false;
  } else {
    checkboxes.style.display = "none";
    show = true;
  }
}

document.addEventListener("click", function (event) {
  const e = event.target.className;
  if (show === false && e !== "overSelect" && e !== "checkbox") {
    document.getElementsByClassName("check-boxes")[0].style.display = "none";
    show = true;
  }
});