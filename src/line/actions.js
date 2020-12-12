import Line from "./models.js";
import { loadStations, useStation } from "../station/actions.js";
import {
  lineInputForm,
  lineList,
  lineListHeader,
  lineDeleteBtn,
} from "./templates.js";

const lineManagerBtn = document.getElementById("line-manager-button");

const loadLines = () => {
  return JSON.parse(lineManagerBtn.dataset.lines).map(
    (x) => new Line(x.name, x.inLineStations)
  );
};

const saveLines = (_lines) => {
  lineManagerBtn.dataset.lines = JSON.stringify(_lines);
};

const printLayout = () => {
  const managerContainer = document.getElementById("manager-container");

  managerContainer.innerHTML = lineInputForm + lineList;
};

const createStationSelector = (_stations) => {
  const startStationSelector = document.getElementById(
    "line-start-station-selector"
  );
  const endStationSelector = document.getElementById(
    "line-end-station-selector"
  );

  for (let i = 0; i < _stations.length; i++) {
    startStationSelector.innerHTML += `<option>${_stations[i].name}</option>`;
    endStationSelector.innerHTML += `<option>${_stations[i].name}</option>`;
  }
};

const createLineList = (_lines) => {
  const lineNames = document.getElementById("line-names");
  lineNames.innerHTML = lineListHeader;

  for (let i = 0; i < _lines.length; i++) {
    lineNames.innerHTML += `
    <tr data-station-index="${i}">
      <td>${_lines[i].name}</td>
      <td>${_lines[i].startStation()}</td>
      <td>${_lines[i].endStation()}</td>
      ${lineDeleteBtn}
    </tr>
    `;
  }
};

const updateLineList = (_lines) => {
  saveLines(_lines);
  createLineList(_lines);
};

const getLineName = () => {
  const lineNameInput = document.getElementById("line-name-input");
  const lineName = lineNameInput.value;

  lineNameInput.value = "";

  return lineName;
};

const getStartStation = () => {
  return document.getElementById("line-start-station-selector").value;
};

const getEndStation = () => {
  return document.getElementById("line-end-station-selector").value;
};

const createLine = () => {
  const lineName = getLineName();

  if (lineName) {
    const startStation = getStartStation();
    const endStation = getEndStation();

    useStation(startStation);
    useStation(endStation);

    return new Line(lineName, [startStation, endStation]);
  }
};

export default function LineManager() {
  printLayout();
  createStationSelector(loadStations());
  createLineList(loadLines());

  const lineAddBtn = document.getElementById("line-add-button");

  lineAddBtn.addEventListener("click", () => {
    const newLine = createLine();

    if (newLine) {
      updateLineList([...loadLines(), newLine]);
    }
  });
}
