const body = document.body;
if (localStorage.getItem("darkMode") === "true") {
  body.classList.add("darkmode");
}

// ====== Canvas Initialization ======
canvas = new fabric.Canvas("certificate-canvas", {
  width: 900,
  height: 650,
  backgroundColor: "#ffffff",
  preserveObjectStacking: true,
});

// ====== Default Canvas Setup ======
function setupDefaultCanvas() {
  canvas.clear();
  canvas.setWidth(900);
  canvas.setHeight(650);
  canvas.setBackgroundColor("#ffffff", canvas.renderAll.bind(canvas));
  console.log("Default canvas setup complete");
  // Add a subtle default background or border to make canvas visible
  const defaultBorder = new fabric.Rect({
    left: 0,
    top: 0,
    width: canvas.width,
    height: canvas.height,
    fill: "transparent",
    stroke: "#e5e7eb",
    strokeWidth: 2,
    selectable: false,
    evented: false,
    strokeDashArray: [10, 5],
  });
  canvas.add(defaultBorder);

  // Add default text
  const defaultText = new fabric.Text("Certificate Editor", {
    left: canvas.width / 2,
    top: canvas.height / 2,
    originX: "center",
    originY: "center",
    fontSize: 32,
    fill: "#9ca3af",
    fontFamily: "Inter",
    selectable: true,
    evented: true,
  });
  canvas.add(defaultText);

  canvas.renderAll();
}

// ====== DOMContentLoaded: All Initialization Here ======
window.addEventListener("DOMContentLoaded", () => {
  // Load Template from URL (or default)
  // const urlParams = new URLSearchParams(window.location.search);
  // const templateId = 2;
  const pathParts = window.location.pathname.split("/");
  const templateId = pathParts[pathParts.length - 1];

  if (templateId) {
    fetch(`/api/template/${templateId}`)
      .then((res) => res.json())
      .then((data) => {
        const template = {
          background: data.background, // Flask returns `/static/backgrounds/xyz.jpg`
          jsonData: data.json_data, // JSON string
        };
        loadTemplateToCanvas(template);
      })
      .catch((err) => {
        console.error("Failed to fetch template data:", err);
        setupDefaultCanvas();
      });
  } else {
    setupDefaultCanvas();
  }

  // Setup all handlers and UI logic
  loadTemplates();
  setupSidebarNavigation();
  setupElementHandlers();
  setupTextHandlers();
  setupUploadHandler();
  setupObjectActionHandlers();
  setupFormattingToolbarHandlers();
  setupTitleEditable();

  // Save initial state for undo/redo
  saveState();
});

// ====== Load Template to Canvas ======
function loadTemplateToCanvas(template) {
  if (!template || !template.background) {
    console.warn("No valid template provided, setting up default canvas");
    setupDefaultCanvas();
    return;
  }

  canvas.clear();

  fabric.Image.fromURL(
    template.background,
    function (img) {
      if (!img) {
        console.error("Failed to load template background image");
        setupDefaultCanvas();
        return;
      }

      const originalWidth = img.width;
      const originalHeight = img.height;
      const scale = 0.5; // Display scale

      // Scaled-down canvas size
      canvas.setWidth(originalWidth * scale);
      canvas.setHeight(originalHeight * scale);

      // Apply matching CSS styles
      const widthPx = originalWidth * scale + "px";
      const heightPx = originalHeight * scale + "px";

      canvas.lowerCanvasEl.style.width = widthPx;
      canvas.lowerCanvasEl.style.height = heightPx;

      if (canvas.upperCanvasEl) {
        canvas.upperCanvasEl.style.width = widthPx;
        canvas.upperCanvasEl.style.height = heightPx;
      }

      if (canvas.wrapperEl) {
        canvas.wrapperEl.style.width = widthPx;
        canvas.wrapperEl.style.height = heightPx;
      }

      // Set scaled background image
      img.set({
        scaleX: scale,
        scaleY: scale,
        originX: "left",
        originY: "top",
        left: 0,
        top: 0,
        selectable: false,
        evented: false,
      });

      canvas.setBackgroundImage(img, () => {
        canvas.renderAll();

        // Load and scale objects
        if (template.jsonData) {
          try {
            const data = JSON.parse(template.jsonData);

            if (data.objects) {
              data.objects.forEach((obj) => {
                let fabricObj = null;

                if (obj.type === "i-text") {
                  fabricObj = new fabric.IText(obj.text, {
                    ...obj,
                    left: obj.left * scale,
                    top: obj.top * scale,
                    scaleX: (obj.scaleX || 1) * scale,
                    scaleY: (obj.scaleY || 1) * scale,
                    selectable: true,
                  });
                }

                if (fabricObj) {
                  canvas.add(fabricObj);
                }
              });

              canvas.renderAll();
            }
          } catch (err) {
            console.warn("Could not parse/load JSON text elements:", err);
          }
        }
      });
    },
    {
      crossOrigin: "anonymous",
    }
  );
}

// ====== Template Data & Loading ======
const certificateTemplates = [
  {
    id: 1,
    name: "Academic",
    thumbnail: "/static/thumbnails/thumbnail.png",
    background: "/static/backgrounds/bg.png",
    json: "/static/jsons/data.json",
  },
  {
    id: 2,
    name: "Professional",
    thumbnail: "/static/thumbnails/thumbnail copy.png",
    background: "/static/backgrounds/bg copy.png",
    json: "/static/jsons/data copy.json",
  },,
  {
    id: 3,
    name: "Achievement",
    thumbnail: "/static/thumbnails/thumbnail1.png",
    background: "/static/backgrounds/background1.png",
    json: "/static/jsons/data copy 2.json",
  },
  {
    id: 4,
    name: "Custom",
    thumbnail: "/static/thumbnails/thumbnail2.png",
    background: "/static/backgrounds/background2.png",
    json: "/static/jsons/data copy 3.json",
  },
  {
    id: 5,
    name: "Event",
    thumbnail: "/static/thumbnails/thumbnail3.png",
    background: "/static/backgrounds/background3.png",
    json: "/static/jsons/data copy 4.json",
  },
  {
    id: 6,
    name: "Corporate",
    thumbnail: "/static/thumbnails/thumbnail4.png",
    background: "/static/backgrounds/background4.png",
    json: "/static/jsons/data copy 5.json",
  },
  {
    id: 7,
    name: "Sports",
    thumbnail: "/static/thumbnails/thumbnail5.png",
    background: "/static/backgrounds/background5.png",
    json: "/static/jsons/data copy 6.json",
  },
];

function loadTemplates() {
  const templateGrid = document.querySelector(".template-grid");
  if (!templateGrid) return;

  templateGrid.innerHTML = "";
  certificateTemplates.forEach((template) => {
    const templateItem = document.createElement("div");
    templateItem.className = "template-item";
    templateItem.innerHTML = `<img src="${template.thumbnail}" alt="${template.name}">`;
    templateItem.addEventListener("click", () =>
      loadTemplateToCanvas(template)
    );
    templateGrid.appendChild(templateItem);
  });
}

//Title Editable
const editorTitle = document.getElementById("editorTitle");

editorTitle.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault(); // Prevent newline
    editorTitle.blur(); // Remove focus (simulate "done editing")
  }
});

// ====== Sidebar Navigation ======
function setupSidebarNavigation() {
  document.querySelectorAll(".sidebar-tool").forEach((tool) => {
    tool.addEventListener("click", function () {
      // Remove active state from all
      document
        .querySelectorAll(".sidebar-tool")
        .forEach((t) => t.classList.remove("active"));
      this.classList.add("active");

      // Hide all panels
      document.querySelectorAll(".panel-content").forEach((panel) => {
        panel.style.display = "none";
      });

      // Show the selected panel
      const panelId = this.dataset.tool + "-panel";
      const panel = document.getElementById(panelId);
      if (panel) {
        panel.style.display = "block";

        // Check for layer panel and call populateLayers
        if (
          panelId === "layers-panel" &&
          typeof populateLayers === "function"
        ) {
          populateLayers();
        }
      }
    });
  });
}

// Call this function when your DOM is ready
setupSidebarNavigation();

// ====== Elements (Shapes/Graphics) ======
function setupElementHandlers() {
  document.querySelectorAll(".element-item").forEach((item) => {
    item.addEventListener("click", function () {
      const shape = this.dataset.shape;
      addShape(shape);
    });
  });
}

function addShape(shape) {
  let object;
  switch (shape) {
    case "rect":
      object = new fabric.Rect({
        left: 300,
        top: 200,
        fill: "#3B82F6",
        width: 120,
        height: 80,
        rx: 8,
        ry: 8,
        stroke: "#000",
        strokeWidth: 1,
      });
      break;
    case "circle":
      object = new fabric.Circle({
        left: 350,
        top: 250,
        fill: "rgba(59,130,246,0.5)",
        radius: 48,
        stroke: "#000",
        strokeWidth: 1,
      });
      break;
    case "triangle":
      object = new fabric.Triangle({
        left: 350,
        top: 250,
        fill: "#3B82F6",
        width: 100,
        height: 90,
        stroke: "#000",
        strokeWidth: 1,
      });
      break;
    case "line":
      object = new fabric.Line([0, 0, 120, 0], {
        left: 320,
        top: 320,
        stroke: "#000",
        strokeWidth: 4,
      });
      break;
    case "star":
      let points = [];
      let cx = 60,
        cy = 60,
        spikes = 5,
        outerRadius = 40,
        innerRadius = 18;
      for (let i = 0; i < spikes * 2; i++) {
        let radius = i % 2 === 0 ? outerRadius : innerRadius;
        let angle = (Math.PI / spikes) * i;
        points.push({
          x: cx + Math.cos(angle) * radius,
          y: cy + Math.sin(angle) * radius,
        });
      }
      object = new fabric.Polygon(points, {
        left: 320,
        top: 220,
        fill: "#3B82F6",
        stroke: "#000",
        strokeWidth: 1,
      });
      break;
    default:
      return;
  }
  canvas.add(object);
  canvas.setActiveObject(object);
  canvas.renderAll();
}

// ====== Add Text ======
function setupTextHandlers() {
  document.getElementById("add-heading").onclick = () =>
    addText("Add a heading", { fontSize: 40, fontWeight: "bold" });
  document.getElementById("add-subheading").onclick = () =>
    addText("Add a subheading", { fontSize: 28 });
  document.getElementById("add-body-text").onclick = () =>
    addText("Add a little bit of body text", { fontSize: 20 });
}

function addText(text, options = {}) {
  const textObj = new fabric.IText(text, {
    ...options,
    left: canvas.width / 2,
    top: canvas.height / 2,
    originX: "center",
    originY: "center",
    fill: "#111827",
    fontFamily: "Inter",
    editable: true,
  });
  canvas.add(textObj);
  canvas.setActiveObject(textObj);
  textObj.enterEditing();
  textObj.selectAll();
  canvas.renderAll();
}

// ====== Layer Management ======
const layerPanel = document.getElementById("layers-panel");
const layersList = document.getElementById("layers-list");
const layerButton = document.querySelector('[data-tool="layers"]');

// Populate layer list
function populateLayers() {
  layersList.innerHTML = "";

  canvas
    .getObjects()
    .slice()
    .reverse()
    .forEach((obj, index) => {
      const li = document.createElement("li");
      li.classList.add("layer-item");
      // Highlight selected object
      if (obj === canvas.getActiveObject()) {
        li.classList.add("active");
      }

      li.textContent =
        obj.type + " - " + (obj.text || obj.id || "Object " + index);

      // On click, select this object
      li.addEventListener("click", () => {
        canvas.setActiveObject(obj);
        canvas.renderAll();
        populateLayers();
      });

      // Up/Down buttons
      const upBtn = document.createElement("button");
      upBtn.textContent = "↑";
      upBtn.classList.add("layer-btn");
      upBtn.onclick = (e) => {
        e.stopPropagation();
        moveObjectUp(obj);
        populateLayers();
      };

      const downBtn = document.createElement("button");
      downBtn.textContent = "↓";
      downBtn.classList.add("layer-btn");
      downBtn.onclick = (e) => {
        e.stopPropagation();
        moveObjectDown(obj);
        populateLayers();
      };

      li.prepend(upBtn);
      li.appendChild(downBtn);
      layersList.appendChild(li);
    });
}

function moveObjectUp(obj) {
  const index = canvas.getObjects().indexOf(obj);
  if (index < canvas.getObjects().length - 1) {
    canvas.moveTo(obj, index + 1);
    canvas.renderAll();
  }
}

function moveObjectDown(obj) {
  const index = canvas.getObjects().indexOf(obj);
  if (index > 0) {
    canvas.moveTo(obj, index - 1);
    canvas.renderAll();
  }
}

// Panel visibility check
function isLayerPanelVisible() {
  return layerPanel && layerPanel.style.display === "block";
}

// Conditional update
function updateLayersIfVisible() {
  if (isLayerPanelVisible()) {
    populateLayers();
  }
}

// Fabric.js event-based updates
canvas.on("object:added", updateLayersIfVisible);
canvas.on("object:removed", updateLayersIfVisible);
canvas.on("object:modified", updateLayersIfVisible);
canvas.on("object:moving", updateLayersIfVisible); // optional
canvas.on("selection:created", updateLayersIfVisible);
canvas.on("selection:updated", updateLayersIfVisible);
canvas.on("selection:cleared", updateLayersIfVisible);

// 🔁 Monkey patching canvas.add/remove to always trigger refresh
const originalAdd = canvas.add;
canvas.add = function (...args) {
  const result = originalAdd.apply(this, args);
  updateLayersIfVisible();
  return result;
};

const originalRemove = canvas.remove;
canvas.remove = function (...args) {
  const result = originalRemove.apply(this, args);
  updateLayersIfVisible();
  return result;
};

// ====== Uploads ======
function setupUploadHandler() {
  document.getElementById("file-upload").onchange = function (e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (evt) {
      fabric.Image.fromURL(evt.target.result, function (img) {
        img.set({
          left: canvas.width / 2,
          top: canvas.height / 2,
          originX: "center",
          originY: "center",
        });
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
      });
    };
    reader.readAsDataURL(file);
  };
}

// ====== Background Color Picker ======
document
  .getElementById("bg-color-picker")
  .addEventListener("input", function () {
    const selectedColor = this.value;
    canvas.setBackgroundColor(selectedColor, canvas.renderAll.bind(canvas));
  });

// ====== Object Actions Top Bar Logic ======
let clipboard = null;

function updateObjectActions() {
  const actions = document.getElementById("object-actions");
  const copyBtn = document.getElementById("copy-btn");
  const duplicateBtn = document.getElementById("duplicate-btn");
  const pasteBtn = document.getElementById("paste-btn");
  const deleteBtn = document.getElementById("delete-btn");
  const lockBtn = document.getElementById("lock-btn");
  const unlockBtn = document.getElementById("unlock-btn");
  const obj = canvas.getActiveObject();

  if (obj) {
    actions.style.display = "";
    if (
      obj.lockMovementX &&
      obj.lockMovementY &&
      obj.lockScalingX &&
      obj.lockScalingY &&
      obj.lockRotation
    ) {
      // Locked: show only unlock
      copyBtn.style.display = "none";
      duplicateBtn.style.display = "none";
      pasteBtn.style.display = "none";
      deleteBtn.style.display = "none";
      lockBtn.style.display = "none";
      unlockBtn.style.display = "";
    } else {
      // Unlocked: show all except unlock
      copyBtn.style.display = "";
      duplicateBtn.style.display = "";
      pasteBtn.style.display = "";
      deleteBtn.style.display = "";
      lockBtn.style.display = "";
      unlockBtn.style.display = "none";
    }
  } else {
    actions.style.display = "none";
  }
}

function setupObjectActionHandlers() {
  document.getElementById("copy-btn").onclick = function () {
    const obj = canvas.getActiveObject();
    if (obj) {
      obj.clone(function (cloned) {
        clipboard = cloned;
      });
    }
  };

  document.getElementById("duplicate-btn").onclick = function () {
    const obj = canvas.getActiveObject();
    if (obj) {
      obj.clone(function (cloned) {
        cloned.set({ left: obj.left + 30, top: obj.top + 30, evented: true });
        canvas.add(cloned);
        canvas.setActiveObject(cloned);
        canvas.renderAll();
      });
    }
  };

  document.getElementById("paste-btn").onclick = function () {
    if (clipboard) {
      clipboard.clone(function (clonedObj) {
        canvas.discardActiveObject();
        clonedObj.set({
          left: clipboard.left + 30,
          top: clipboard.top + 30,
          evented: true,
        });
        if (clonedObj.type === "activeSelection") {
          clonedObj.canvas = canvas;
          clonedObj.forEachObject(function (obj) {
            canvas.add(obj);
          });
          clonedObj.setCoords();
        } else {
          canvas.add(clonedObj);
        }
        canvas.setActiveObject(clonedObj);
        canvas.requestRenderAll();
      });
    }
  };

  document.getElementById("delete-btn").onclick = function () {
    const obj = canvas.getActiveObject();
    if (obj) {
      canvas.remove(obj);
      canvas.discardActiveObject();
      canvas.renderAll();
    }
  };

  document.getElementById("lock-btn").onclick = function () {
    const obj = canvas.getActiveObject();
    if (obj) {
      obj.set({
        lockMovementX: true,
        lockMovementY: true,
        lockScalingX: true,
        lockScalingY: true,
        lockRotation: true,
        hasControls: false,
        editable: false,
      });
      canvas.renderAll();
      updateObjectActions();
    }
  };

  document.getElementById("unlock-btn").onclick = function () {
    const obj = canvas.getActiveObject();
    if (obj) {
      obj.set({
        lockMovementX: false,
        lockMovementY: false,
        lockScalingX: false,
        lockScalingY: false,
        lockRotation: false,
        hasControls: true,
        editable: true,
      });
      canvas.renderAll();
      updateObjectActions();
    }
  };

  // Update actions on selection events
  canvas.on("selection:created", updateObjectActions);
  canvas.on("selection:updated", updateObjectActions);
  canvas.on("selection:cleared", updateObjectActions);
}

// ====== Formatting Toolbar Logic ======
function isText(obj) {
  return (
    obj &&
    (obj.type === "i-text" || obj.type === "textbox" || obj.type === "text")
  );
}
function isShape(obj) {
  return (
    obj &&
    (obj.type === "rect" ||
      obj.type === "circle" ||
      obj.type === "triangle" ||
      obj.type === "polygon" ||
      obj.type === "line")
  );
}

function updateFormattingToolbar() {
  const toolbar = document.getElementById("formatting-toolbar");
  const textDiv = document.getElementById("text-formatting");
  const shapeDiv = document.getElementById("shape-formatting");
  const obj = canvas.getActiveObject();

  if (!obj) {
    toolbar.style.display = "none";
    textDiv.style.display = "none";
    shapeDiv.style.display = "none";
    return;
  }
  toolbar.style.display = "flex";

  if (isText(obj)) {
    textDiv.style.display = "";
    shapeDiv.style.display = "none";
    // Set text controls to current values
    document.getElementById("font-family").value = obj.fontFamily || "Inter";
    document.getElementById("font-size").value = obj.fontSize || 32;
    document.getElementById("text-color").value = obj.fill || "#111827";
    document
      .getElementById("bold-btn")
      .classList.toggle("active", obj.fontWeight === "bold");
    document
      .getElementById("italic-btn")
      .classList.toggle("active", obj.fontStyle === "italic");
    document
      .getElementById("underline-btn")
      .classList.toggle("active", obj.underline === true);
  } else if (isShape(obj)) {
    textDiv.style.display = "none";
    shapeDiv.style.display = "";
    document.getElementById("shape-fill-color").value = obj.fill || "#3B82F6";
  } else {
    textDiv.style.display = "none";
    shapeDiv.style.display = "none";
  }
}

function setupFormattingToolbarHandlers() {
  // Text controls
  document.getElementById("font-family").onchange = function () {
    const obj = canvas.getActiveObject();
    if (isText(obj)) {
      obj.set("fontFamily", this.value);
      canvas.renderAll();
    }
  };
  document.getElementById("font-size").onchange = function () {
    const obj = canvas.getActiveObject();
    if (isText(obj)) {
      obj.set("fontSize", parseInt(this.value, 10));
      canvas.renderAll();
    }
  };
  document.getElementById("increase-font").onclick = function () {
    const obj = canvas.getActiveObject();
    if (isText(obj) && obj.fontSize < 200) {
      obj.set("fontSize", obj.fontSize + 1);
      document.getElementById("font-size").value = obj.fontSize;
      canvas.renderAll();
    }
  };
  document.getElementById("decrease-font").onclick = function () {
    const obj = canvas.getActiveObject();
    if (isText(obj) && obj.fontSize > 8) {
      obj.set("fontSize", obj.fontSize - 1);
      document.getElementById("font-size").value = obj.fontSize;
      canvas.renderAll();
    }
  };
  document.getElementById("bold-btn").onclick = function () {
    const obj = canvas.getActiveObject();
    if (isText(obj)) {
      obj.set("fontWeight", obj.fontWeight === "bold" ? "normal" : "bold");
      canvas.renderAll();
      updateFormattingToolbar();
    }
  };
  document.getElementById("italic-btn").onclick = function () {
    const obj = canvas.getActiveObject();
    if (isText(obj)) {
      obj.set("fontStyle", obj.fontStyle === "italic" ? "normal" : "italic");
      canvas.renderAll();
      updateFormattingToolbar();
    }
  };
  document.getElementById("underline-btn").onclick = function () {
    const obj = canvas.getActiveObject();
    if (isText(obj)) {
      obj.set("underline", !obj.underline);
      canvas.renderAll();
      updateFormattingToolbar();
    }
  };
  document.getElementById("text-color").addEventListener("input", function () {
    const obj = canvas.getActiveObject();
    if (isText(obj)) {
      obj.set("fill", this.value);
      canvas.renderAll();
    }
  });
  document.getElementById("text-case").addEventListener("change", function () {
    const activeObject = canvas.getActiveObject();
    const caseOption = this.value;
    if (
      !activeObject ||
      typeof activeObject.setSelectionStyles !== "function"
    ) {
      alert("Select a text object first!");
      this.value = "none";
      return;
    }

    // Get current text
    let currentText = activeObject.text;

    // Apply casing carefully:
    let newText;
    switch (caseOption) {
      case "uppercase":
        newText = currentText.toUpperCase();
        break;
      case "lowercase":
        newText = currentText.toLowerCase();
        break;
      case "capitalize":
        // Capitalize first letter of each word, lowercase others
        newText = currentText
          .toLowerCase()
          .replace(/\b\w/g, (char) => char.toUpperCase());
        break;
      case "normal":
      default:
        newText = currentText; // no change
        break;
    }

    if (newText !== currentText) {
      // Update the text property fully and reset selection to avoid glitches
      activeObject.set({ text: newText });

      // Optional: clear any selection to avoid weird cursor issues
      if (activeObject.setSelectionStart && activeObject.setSelectionEnd) {
        activeObject.setSelectionStart(0);
        activeObject.setSelectionEnd(0);
      }

      // Update and rerender canvas
      activeObject.dirty = true;
      canvas.requestRenderAll();
    }
  });

  // Shape controls
  document
    .getElementById("shape-fill-color")
    .addEventListener("input", function () {
      const obj = canvas.getActiveObject();
      if (isShape(obj)) {
        obj.set("fill", this.value);
        canvas.renderAll();
      }
    });

  // Canvas selection events
  canvas.on("selection:created", updateFormattingToolbar);
  canvas.on("selection:updated", updateFormattingToolbar);
  canvas.on("selection:cleared", function () {
    document.getElementById("formatting-toolbar").style.display = "none";
    document.getElementById("text-formatting").style.display = "none";
    document.getElementById("shape-formatting").style.display = "none";
  });
}

// ====== Download and Save ======
// ======= Download button & dropdown elements =======
const downloadBtn = document.getElementById("download-btn");
const downloadDropdown = document.createElement("div");
downloadDropdown.id = "download-dropdown";
downloadDropdown.style.cssText = `
  display: none;
  position: absolute;
  background: white;
  border: 1px solid #ccc;
  padding: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  z-index: 1000;
`;
downloadDropdown.innerHTML = `
  <button class="format-option" data-format="png" style="background:var(--accent);border:none;padding:6px 12px;width:100%;text-align:left;margin-bottom:2px;cursor:pointer;">Download as PNG</button><br/>
  <button class="format-option" data-format="pdf" style="background:var(--accent);border:none;padding:6px 12px;width:100%;text-align:left;cursor:pointer;">Download as PDF</button>
`;
document.body.appendChild(downloadDropdown);

// Position the dropdown below the download button
function positionDropdown() {
  const rect = downloadBtn.getBoundingClientRect();
  downloadDropdown.style.top = rect.bottom + window.scrollY + "px";
  downloadDropdown.style.left = rect.left + window.scrollX + "px";
}

// Toggle dropdown visibility when download button clicked
downloadBtn.addEventListener("click", () => {
  if (downloadDropdown.style.display === "none") {
    positionDropdown();
    downloadDropdown.style.display = "block";
  } else {
    downloadDropdown.style.display = "none";
  }
});

// Hide dropdown when clicking outside
document.addEventListener("click", (e) => {
  if (!downloadBtn.contains(e.target) && !downloadDropdown.contains(e.target)) {
    downloadDropdown.style.display = "none";
  }
});

// Handle format selection and trigger download
downloadDropdown.querySelectorAll(".format-option").forEach((btn) => {
  btn.addEventListener("click", () => {
    const format = btn.getAttribute("data-format");
    downloadCertificate(format);
    downloadDropdown.style.display = "none";
  });
});

// Download function for PNG or PDF
// function downloadCertificate(format) {
//   const { jsPDF } = window.jspdf;

//   const originalBg = canvas.backgroundColor;
//   const needsWhiteBg =
//     !originalBg ||
//     originalBg === "transparent" ||
//     originalBg === "rgba(0,0,0,0)";

//   if (needsWhiteBg) {
//     canvas.setBackgroundColor("white", canvas.renderAll.bind(canvas));
//   }
function downloadCertificate(format) {
  const { jsPDF } = window.jspdf;

  const originalBg = canvas.backgroundColor;
  const needsWhiteBg =
    !originalBg || originalBg === "transparent" || originalBg === "rgba(0,0,0,0)";

  if (needsWhiteBg) {
    canvas.setBackgroundColor("white", canvas.renderAll.bind(canvas));
  }

  const filename = `certificate.${format}`;
  const filePath = `/static/generated/${filename}`; // Full path for Flask

  if (format === "png") {
    canvas.toBlob((blob) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();

      const formData = new FormData();
      formData.append("template", blob, filename);

      fetch("/upload-template", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.text())
        .then((msg) => {
          console.log("✅ Uploaded:", msg);

          // Set file path in hidden input
          document.getElementById("filePathInput").value = filePath;

          // Open modal
          openEmailModal(filename);
        });
    }, "image/png");
  }

  if (format === "pdf") {
    const dataUrl = canvas.toDataURL({ format: "png", multiplier: 2 });
    const pdf = new jsPDF("l", "pt", [canvas.width, canvas.height]);
    pdf.addImage(dataUrl, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(filename);

    const pdfBlob = pdf.output("blob");

    const formData = new FormData();
    formData.append("template", pdfBlob, filename);

    fetch("/upload-template", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.text())
      .then((msg) => {
        console.log("✅ Uploaded:", msg);

        // Set file path in hidden input
        document.getElementById("filePathInput").value = filePath;

        // Open modal
        openEmailModal(filename);
      });
  }
}



// Store current view dimensions and scale
const viewScale = 0.5;
const viewWidth = canvas.getWidth();
const viewHeight = canvas.getHeight();
const fullWidth = viewWidth / viewScale;
const fullHeight = viewHeight / viewScale;

// Step 1: Scale canvas up for full-res export
canvas.setWidth(fullWidth);
canvas.setHeight(fullHeight);

canvas.lowerCanvasEl.style.width = fullWidth + "px";
canvas.lowerCanvasEl.styleheight = fullHeight + "px"; // Note: corrected below

if (canvas.upperCanvasEl) {
  canvas.upperCanvasEl.style.width = fullWidth + "px";
  canvas.upperCanvasEl.style.height = fullHeight + "px";
}

if (canvas.wrapperEl) {
  canvas.wrapperEl.style.width = fullWidth + "px";
  canvas.wrapperEl.style.height = fullHeight + "px";
}

// Scale background image to 100%
if (canvas.backgroundImage) {
  canvas.backgroundImage.scaleX = 1;
  canvas.backgroundImage.scaleY = 1;
}

// Scale all objects to full size
canvas.getObjects().forEach((obj) => {
  obj.scaleX /= viewScale;
  obj.scaleY /= viewScale;
  obj.left /= viewScale;
  obj.top /= viewScale;
  obj.setCoords();
});

// Correct typo in above code
canvas.lowerCanvasEl.style.height = fullHeight + "px";

canvas.renderAll();

// Step 2: Download
setTimeout(() => {
  const dataURL = canvas.toDataURL({ format: "png", quality: 1 });

  if (format === "png") {
    const link = document.createElement("a");
    link.download = "certificate.png";
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else if (format === "pdf") {
    if (typeof jsPDF === "undefined") {
      alert("Error: jsPDF library is not loaded.");
      return;
    }

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [fullWidth, fullHeight],
    });
    pdf.addImage(dataURL, "PNG", 0, 0, fullWidth, fullHeight);
    pdf.save("certificate.pdf");
  }

  // Step 3: Restore everything back to view state (0.5x)
  canvas.setWidth(viewWidth);
  canvas.setHeight(viewHeight);

  canvas.lowerCanvasEl.style.width = viewWidth + "px";
  canvas.lowerCanvasEl.style.height = viewHeight + "px";

  if (canvas.upperCanvasEl) {
    canvas.upperCanvasEl.style.width = viewWidth + "px";
    canvas.upperCanvasEl.style.height = viewHeight + "px";
  }

  if (canvas.wrapperEl) {
    canvas.wrapperEl.style.width = viewWidth + "px";
    canvas.wrapperEl.style.height = viewHeight + "px";
  }

  // Restore background scaling
  if (canvas.backgroundImage) {
    canvas.backgroundImage.scaleX = viewScale;
    canvas.backgroundImage.scaleY = viewScale;
  }

  // Scale all objects back down
  canvas.getObjects().forEach((obj) => {
    obj.scaleX *= viewScale;
    obj.scaleY *= viewScale;
    obj.left *= viewScale;
    obj.top *= viewScale;
    obj.setCoords();
  });

  canvas.renderAll();

  // Restore transparent background if needed
  if (needsWhiteBg) {
    canvas.setBackgroundColor(originalBg, canvas.renderAll.bind(canvas));
  }
}, 100);


// ====== Editor Title Editable ======
function setupTitleEditable() {
  document.querySelector(".editor-title").addEventListener("blur", function () {
    if (this.textContent.trim() === "") {
      this.textContent = "Untitled design";
    }
  });
}

// ====== Undo/Redo Implementation ======
let undoStack = [];
let redoStack = [];
let isRestoring = false;

function saveState() {
  if (isRestoring) return;
  undoStack.push(JSON.stringify(canvas));
  if (undoStack.length > 50) undoStack.shift(); // Limit history
  redoStack = [];
}
function restoreState(state) {
  isRestoring = true;
  canvas.loadFromJSON(state, () => {
    canvas.renderAll();
    isRestoring = false;
  });
}

// Save state on changes
canvas.on("object:added", saveState);
canvas.on("object:modified", saveState);
canvas.on("object:removed", saveState);

// Undo/Redo button handlers
document.getElementById("undo-btn").onclick = function () {
  if (undoStack.length > 1) {
    redoStack.push(undoStack.pop());
    restoreState(undoStack[undoStack.length - 1]);
  }
};
document.getElementById("redo-btn").onclick = function () {
  if (redoStack.length > 0) {
    const state = redoStack.pop();
    undoStack.push(state);
    restoreState(state);
  }
};

// Keyboard shortcuts
document.addEventListener("keydown", function (e) {
  if (e.ctrlKey && !e.shiftKey && e.key.toLowerCase() === "z") {
    e.preventDefault();
    document.getElementById("undo-btn").click();
  }
  if (
    e.ctrlKey &&
    (e.key.toLowerCase() === "y" || (e.shiftKey && e.key.toLowerCase() === "z"))
  ) {
    e.preventDefault();
    document.getElementById("redo-btn").click();
  }
});

// Save initial state
window.addEventListener("DOMContentLoaded", () => saveState());

// ====== Snap-to-Grid with Zoom Support ======
let snapToGrid = false;
const gridSize = 30; // Set your preferred grid size

function drawGridLines() {
  // Remove previous grid lines
  canvas.getObjects("line").forEach((line) => {
    if (line.gridLine) canvas.remove(line);
  });
  if (!snapToGrid) return;

  const zoom = canvas.getZoom();
  const vpt = canvas.viewportTransform;

  // Calculate the visible area in canvas coordinates
  const left = -vpt[4] / zoom;
  const top = -vpt[5] / zoom;
  const right = left + canvas.width / zoom;
  const bottom = top + canvas.height / zoom;

  // Calculate start and end points for grid lines
  const startX = Math.floor(left / gridSize) * gridSize;
  const endX = Math.ceil(right / gridSize) * gridSize;
  const startY = Math.floor(top / gridSize) * gridSize;
  const endY = Math.ceil(bottom / gridSize) * gridSize;

  // Draw vertical lines
  for (let x = startX; x <= endX; x += gridSize) {
    let vLine = new fabric.Line([x, top, x, bottom], {
      stroke: "#e5e7eb",
      selectable: false,
      evented: false,
      gridLine: true,
      excludeFromExport: true,
    });
    canvas.add(vLine);
    vLine.sendToBack();
  }

  // Draw horizontal lines
  for (let y = startY; y <= endY; y += gridSize) {
    let hLine = new fabric.Line([left, y, right, y], {
      stroke: "#e5e7eb",
      selectable: false,
      evented: false,
      gridLine: true,
      excludeFromExport: true,
    });
    canvas.add(hLine);
    hLine.sendToBack();
  }
}

// Toggle snap to grid and redraw
document.getElementById("snap-grid-btn").onclick = function () {
  snapToGrid = !snapToGrid;
  this.classList.toggle("active", snapToGrid);
  drawGridLines();
};

// Snap objects to grid on move if enabled
canvas.on("object:moving", function (options) {
  if (!snapToGrid) return;
  options.target.set({
    left: Math.round(options.target.left / gridSize) * gridSize,
    top: Math.round(options.target.top / gridSize) * gridSize,
  });
});

// Redraw grid lines on viewport changes (zoom, pan)
canvas.on("after:render", function () {
  if (!snapToGrid) {
    canvas.getObjects("line").forEach((line) => {
      if (line.gridLine) canvas.remove(line);
    });
    return;
  }
  drawGridLines();
});

// ====== Bulk Generation ======
let namePlaceholder;
let bulkData = [];
let generatedImages = [];

// CSV File Upload Handling
document
  .getElementById("bulk-file-upload")
  .addEventListener("change", handleCSV);

function handleCSV(e) {
  const file = e.target.files[0];
  if (!file) return;

  document.getElementById("file-name-display").textContent = `📄 ${file.name}`;

  const reader = new FileReader();
  reader.onload = function (event) {
    const lines = event.target.result
      .split("\n")
      .filter((line) => line.trim() !== "");
    const names = lines.map((line) => line.split(",")[0].trim());
    const longestName = names.reduce((a, b) => (a.length > b.length ? a : b));

    bulkData = names;
    insertNamePlaceholder(longestName);
  };
  reader.readAsText(file);
}

// Insert Name Placeholder
function insertNamePlaceholder(name) {
  if (namePlaceholder) canvas.remove(namePlaceholder);

  namePlaceholder = new fabric.Text(name, {
    left: 450,
    top: 325,
    fontSize: 32,
    fill: "#000000",
    fontFamily: "Arial",
    fontWeight: "normal",
    fontStyle: "",
    underline: false,
    originX: "center",
    originY: "center",
    selectable: true,
    hasControls: true,
    lockScalingX: false,
    lockScalingY: false,
    lockRotation: false,
  });

  canvas.add(namePlaceholder);
  canvas.setActiveObject(namePlaceholder);
  canvas.renderAll();
}

// Handle Generate Button Click
document
  .getElementById("generate-cert-btn")
  .addEventListener("click", async () => {
    if (!bulkData.length) {
      alert("⚠️ Please upload a CSV file first!");
      return;
    }

    if (!namePlaceholder) {
      alert("⚠️ Please add and format the name placeholder!");
      return;
    }

    // Extract formatting and position from placeholder
    const {
      left,
      top,
      fontSize,
      fill,
      fontFamily,
      fontWeight,
      fontStyle,
      underline,
      originX,
      originY,
      textAlign,
      shadow,
      stroke,
      strokeWidth,
      scaleX,
      scaleY,
      angle,
      flipX,
      flipY,
      opacity,
    } = namePlaceholder;

    const casingType = detectCasing(namePlaceholder.text);
    const canvasBg = canvas.backgroundColor || "#ffffff";

    generatedImages = [];

    showSpinner("Generating certificates...");

    canvas.remove(namePlaceholder); // temporarily remove placeholder

    for (let i = 0; i < bulkData.length; i++) {
      const originalName = bulkData[i];
      const finalName = applyCasing(originalName, casingType);

      const tempText = new fabric.Text(finalName, {
        left,
        top,
        fontSize,
        fill,
        fontFamily,
        fontWeight,
        fontStyle,
        underline,
        originX,
        originY,
        textAlign,
        shadow,
        stroke,
        strokeWidth,
        scaleX,
        scaleY,
        angle,
        flipX,
        flipY,
        opacity,
        selectable: false,
        editable: false,
      });

      canvas.add(tempText);
      canvas.setBackgroundColor(canvasBg, canvas.renderAll.bind(canvas));

      await new Promise((resolve) => setTimeout(resolve, 100));

      const dataURL = canvas.toDataURL({
        format: "png",
        quality: 1.0,
        multiplier: 3,
      });

      generatedImages.push({ name: originalName, dataURL });
      canvas.remove(tempText);
    }

    canvas.add(namePlaceholder); // re-add placeholder
    canvas.renderAll();
    showFinalOptions();
  });

// Text casing utils
function detectCasing(text) {
  if (text === text.toUpperCase()) return "upper";
  if (text === text.toLowerCase()) return "lower";
  if (text === capitalize(text)) return "capital";
  return "none";
}

function applyCasing(text, casing) {
  switch (casing) {
    case "upper":
      return text.toUpperCase();
    case "lower":
      return text.toLowerCase();
    case "capital":
      return capitalize(text);
    default:
      return text;
  }
}

function capitalize(str) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

// Spinner UI
function showSpinner(message) {
  const panel = document.getElementById("status-panel");
  panel.innerHTML = `
    <div style="display: flex; align-items: center; gap: 10px;">
      <div class="spinner" style="
        border: 4px solid #f3f3f3;
        border-top: 4px solid #3498db;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        animation: spin 1s linear infinite;">
      </div>
      <span>${message}</span>
    </div>
  `;
  panel.style.display = "block";
}

// Show final options
function showFinalOptions() {
  const panel = document.getElementById("status-panel");
  panel.innerHTML = `
    <p>✅ Bulk generation complete.</p>
    <button id="download-png-zip-btn" style="margin-bottom: 10px; margin-top:10px">Download PNG ZIP</button>
    <button id="download-pdf-zip-btn" style="margin-bottom: 10px">Download PDF ZIP</button>
    <button id="share-btn" style="margin-bottom: 10px">Share</button>
  `;

  document
    .getElementById("download-png-zip-btn")
    .addEventListener("click", downloadPngZip);
  document
    .getElementById("download-pdf-zip-btn")
    .addEventListener("click", downloadPdfZip);
  document
    .getElementById("share-btn")
    .addEventListener("click", shareCertificates);
}

// Download PNG ZIP
function downloadPngZip() {
  const zip = new JSZip();
  generatedImages.forEach(({ name, dataURL }) => {
    const base64Data = dataURL.split(",")[1];
    zip.file(`${name}.png`, base64Data, { base64: true });
  });

  zip.generateAsync({ type: "blob" }).then(function (content) {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(content);
    link.download = "certificates_png.zip";
    link.click();
  });
}

// Download PDF ZIP
async function downloadPdfZip() {
  if (!window.jspdf) {
    alert("Error: jsPDF library is not loaded. Please include jsPDF script.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const zip = new JSZip();

  for (let i = 0; i < generatedImages.length; i++) {
    const { name, dataURL } = generatedImages[i];
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(dataURL, "PNG", 0, 0, canvas.width, canvas.height);
    const pdfBlob = pdf.output("blob");
    zip.file(`${name}.pdf`, pdfBlob);
  }

  zip.generateAsync({ type: "blob" }).then(function (content) {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(content);
    link.download = "certificates_pdf.zip";
    link.click();
  });
}

// Placeholder Share Button
function shareCertificates() {
  alert("🔗 Share feature coming soon!");
}

//Preview Button Logic
document.getElementById("preview-btn").addEventListener("click", () => {
  const dataURL = canvas.toDataURL({
    format: "png",
    quality: 1.0,
  });

  const previewWindow = window.open("", "_blank");
  if (previewWindow) {
    previewWindow.document.write(`
      <html>
        <head><title>Certificate Preview</title></head>
        <body style="margin:0; display:flex; justify-content:center; align-items:center; height:100vh; background:#f0f0f0;">
          <img src="${dataURL}" alt="Certificate Preview" style="max-width:100%; max-height:100vh;" />
        </body>
      </html>
    `);
    previewWindow.document.close();
  } else {
    alert("Popup blocked! Please allow popups for this website.");
  }
});

// ====== Initialization ======
function init() {
  setupSidebarNavigation();
  setupElementHandlers();
  setupTextHandlers();
  setupUploadHandler();
  setupObjectActionHandlers();
  setupFormattingToolbarHandlers();
  setupTitleEditable();
}
init();
// nbew
function openEmailModal() {
  document.getElementById("shareModal").style.display = "block";
}
function closeEmailModal() {
  document.getElementById("shareModal").style.display = "none";
}
