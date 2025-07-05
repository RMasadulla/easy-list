// assets/js/index.js

// Global Variables
let customItems = [];
let selectedVegetables = [];

// DOM Content Loaded
document.addEventListener("DOMContentLoaded", () => {
  loadData();
  listUpdate();
  setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
  // For daily-bazar.html
  if (document.getElementById("addNewItem")) {
    document
      .getElementById("addNewItem")
      .addEventListener("click", addCustomItem);

    // Vegetable checkboxes
    const vegCheckboxes = document.querySelectorAll(
      '.bg-green-100 input[type="checkbox"]'
    );
    vegCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", handleVegetableSelection);
    });

    // Meal count inputs
    ["dayCount", "nightCount", "morningCount"].forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener("input", generateBazarList);
      }
    });
  }
}

// Load Data from Local Storage
function loadData() {
  // Load form data
  const savedData = JSON.parse(localStorage.getItem("formData"));
  if (savedData) {
    savedData.forEach((item) => {
      const inputElement = document.getElementById(item.id);
      if (inputElement) {
        inputElement.value = item.value;
      }
    });
  }

  // Load per head data
  const perHeadNeed = JSON.parse(localStorage.getItem("itemDivideVal"));
  if (perHeadNeed) {
    perHeadNeed.forEach((item) => {
      const inputElement = document.getElementById(item.id);
      if (inputElement) {
        if (inputElement.id === "p-egg") {
          inputElement.value = Math.round(item.value);
        } else {
          inputElement.value = Math.round(item.value * 1000);
        }
      }
    });
  }

  // Load mess info
  const localMessName = localStorage.getItem("messName");
  const localmanagerName = localStorage.getItem("managerName");
  if (localMessName && document.getElementById("messName")) {
    document.getElementById("messName").value = localMessName;
    document.getElementById("messDetails").textContent = localMessName;
  }
  if (localmanagerName && document.getElementById("managerName")) {
    document.getElementById("managerName").value = localmanagerName;
    document.getElementById("managerDetails").textContent = localmanagerName;
  }

  // Load custom items
  const savedCustomItems = JSON.parse(localStorage.getItem("customItems"));
  if (savedCustomItems) {
    customItems = savedCustomItems;
  }

  // Load selected vegetables
  const savedVegetables = JSON.parse(
    localStorage.getItem("selectedVegetables")
  );
  if (savedVegetables) {
    selectedVegetables = savedVegetables;
    // Check the checkboxes
    savedVegetables.forEach((veg) => {
      const checkbox = document.querySelector(
        `.bg-green-100 input[value="${veg}"]`
      );
      if (checkbox) checkbox.checked = true;
    });
  }
}

// Update and Save Price Data
function updateAndSaveData() {
  const formElements = document.querySelectorAll(
    '#itemForm input[type="number"]'
  );
  let formData = [];

  formElements.forEach((input) => {
    formData.push({
      id: input.id,
      value: input.value,
    });
  });

  localStorage.setItem("formData", JSON.stringify(formData));
  alert("ডেটা সফলভাবে সংরক্ষণ করা হয়েছে!");
}

// Update and Save Per Head Data
function updateAndSaveDivideData() {
  const formElements = document.querySelectorAll(
    '#itemDivideForm input[type="number"]'
  );
  let itemDivideVal = [];

  formElements.forEach((input) => {
    let value = parseFloat(input.value);

    // Convert to kg (except for eggs)
    if (input.id !== "p-egg") {
      value = value / 1000; // Convert grams to kg
    }

    itemDivideVal.push({
      id: input.id,
      value: value.toFixed(3),
    });
  });

  localStorage.setItem("itemDivideVal", JSON.stringify(itemDivideVal));
  alert("সদস্য প্রতি ডেটা সফলভাবে সংরক্ষণ করা হয়েছে!");
}

// List Update for PDF
function listUpdate() {
  const currentDate = document.getElementById("currentDate");
  const messNameInput = document.getElementById("messName");
  const messDetails = document.getElementById("messDetails");
  const managerNameInput = document.getElementById("managerName");
  const managerDetails = document.getElementById("managerDetails");

  // Set current date
  if (currentDate) {
    const date = new Date();
    const formattedDate = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    currentDate.textContent = formattedDate;
  }

  // Mess name update
  if (messNameInput && messDetails) {
    messNameInput.addEventListener("input", () => {
      messDetails.textContent = messNameInput.value || "মেসের নাম";
      localStorage.setItem("messName", messNameInput.value);
    });
  }

  // Manager name update
  if (managerNameInput && managerDetails) {
    managerNameInput.addEventListener("input", () => {
      managerDetails.textContent = managerNameInput.value || "Manager Name";
      localStorage.setItem("managerName", managerNameInput.value);
    });
  }
}

// Add Custom Item
function addCustomItem() {
  const itemName = document.getElementById("newItemName").value.trim();
  const itemValue = document.getElementById("newItemVal").value.trim();

  if (!itemName || !itemValue) {
    alert("দয়া করে আইটেমের নাম এবং মান পূরণ করুন");
    return;
  }

  customItems.push({
    name: itemName,
    value: itemValue,
    unit: isNaN(itemValue) ? "টাকা" : "কেজি",
  });

  localStorage.setItem("customItems", JSON.stringify(customItems));

  // Clear inputs
  document.getElementById("newItemName").value = "";
  document.getElementById("newItemVal").value = "";

  // Regenerate list
  generateBazarList();
}

// Handle Vegetable Selection
function handleVegetableSelection(event) {
  const vegetable = event.target.value;

  if (event.target.checked) {
    if (!selectedVegetables.includes(vegetable)) {
      selectedVegetables.push(vegetable);
    }
  } else {
    selectedVegetables = selectedVegetables.filter((v) => v !== vegetable);
  }

  localStorage.setItem(
    "selectedVegetables",
    JSON.stringify(selectedVegetables)
  );
  generateBazarList();
}

// Generate Bazar List
function generateBazarList() {
  const bazarItemList = document.getElementById("bazarItemList");
  if (!bazarItemList) return;

  // Clear current list
  bazarItemList.innerHTML = "";

  // Get counts
  const dayCount = parseFloat(document.getElementById("dayCount").value) || 0;
  const nightCount =
    parseFloat(document.getElementById("nightCount").value) || 0;
  const morningCount =
    parseFloat(document.getElementById("morningCount").value) || 0;

  // Get per head data
  const perHeadCost = JSON.parse(localStorage.getItem("itemDivideVal")) || [];

  // Generate list items
  let itemCount = 1;

  // Rice - Morning
  const riceM = perHeadCost.find((item) => item.id === "p-rice-m");
  if (riceM && riceM.value > 0 && morningCount > 0) {
    const total = (riceM.value * morningCount).toFixed(3);
    addListItem(bazarItemList, itemCount++, "চাল", "(সকাল)", total, "কেজি");
  }

  // Rice - Day
  const riceD = perHeadCost.find((item) => item.id === "p-rice-d");
  if (riceD && riceD.value > 0 && dayCount > 0) {
    const total = (riceD.value * dayCount).toFixed(3);
    addListItem(bazarItemList, itemCount++, "চাল", "(দুপুর)", total, "কেজি");
  }

  // Rice - Night
  const riceN = perHeadCost.find((item) => item.id === "p-rice-n");
  if (riceN && riceN.value > 0 && nightCount > 0) {
    const total = (riceN.value * nightCount).toFixed(3);
    addListItem(bazarItemList, itemCount++, "চাল", "(রাত)", total, "কেজি");
  }

  // Other items
  const otherItems = perHeadCost.filter(
    (item) =>
      !["p-rice-m", "p-rice-d", "p-rice-n"].includes(item.id) && item.value > 0
  );

  otherItems.forEach((item) => {
    const total = (item.value * dayCount).toFixed(3);
    const itemName = getItemName(item.id);
    const unit = item.id === "p-egg" ? "পিস" : "কেজি";

    if (itemName) {
      addListItem(bazarItemList, itemCount++, itemName, "", total, unit);
    }
  });

  // Vegetables
  selectedVegetables.forEach((veg) => {
    addListItem(bazarItemList, itemCount++, veg, "", "প্রয়োজনমত", "");
  });

  // Custom items
  customItems.forEach((item) => {
    addListItem(
      bazarItemList,
      itemCount++,
      item.name,
      "",
      item.value,
      item.unit
    );
  });

  // Show PDF box
  document.getElementById("pdfBox").classList.remove("hidden");
}

// Add List Item
function addListItem(container, number, name, time, quantity, unit) {
  const li = document.createElement("li");
  li.className = "my-3 flex items-baseline";

  li.innerHTML = `
  <span class="text-base" style="white-space: nowrap;">${number}.</span>
  <span class="ml-1" id="listItemName" style="overflow-wrap: break-word;">${name}</span>
  <span class="text-sm mx-2 text-yellow-800" id="listItemTime">${time}</span>
  <span>-</span>
  <span class="mx-2" id="listItemQuantity">${quantity}</span>
  <span>${unit}</span>
`;

  container.appendChild(li);
}

// Get Item Name from ID
function getItemName(id) {
  const itemMap = {
    "p-dal": "ডাল",
    "p-oil": "তেল",
    "p-salt": "লবণ",
    "p-chicken-meat": "মুরগির মাংস",
    "p-beef": "গরুর মাংস",
    "p-egg": "ডিম",
    "p-green-chillies": "কাঁচা মরিচ",
    "p-dry-chili": "শুকনা মরিচ",
    "p-chilli-powder": "গুড়া মরিচ",
    "p-yellow-powder": "গুড়া হলুদ",
    "p-onion": "পেঁয়াজ",
    "p-garlic": "রসুন",
    "p-ginger": "আদা",
  };

  return itemMap[id] || "";
}

// Generate PDF
// async function generatePDF() {
//   // Show loading state
//   const pdfButton = document.querySelector('button[onclick="generatePDF()"]');
//   const originalText = pdfButton.textContent;
//   pdfButton.textContent = "PDF তৈরি হচ্ছে...";
//   pdfButton.disabled = true;

//   try {
//     const { jsPDF } = window.jspdf;
//     const pdfBox = document.getElementById("pdfBox");

//     // Temporarily show the PDF box if hidden
//     const wasHidden = pdfBox.classList.contains("hidden");
//     if (wasHidden) {
//       pdfBox.classList.remove("hidden");
//       // Generate a basic list if empty
//       if (document.getElementById("bazarItemList").children.length === 0) {
//         generateBazarList();
//       }
//     }

//     // Create canvas from HTML
//     const canvas = await html2canvas(pdfBox, {
//       scale: 2,
//       useCORS: true,
//       logging: false,
//       allowTaint: true,
//     });

//     // const canvas = await html2canvas(pdfBox, {
//     //   scale: window.innerWidth < 768 ? 1.5 : 2, // use smaller scale on mobile
//     //   width: 794,
//     //   scrollY: 0,
//     //   useCORS: true,
//     // });

//     // Create PDF
//     const pdf = new jsPDF("p", "pt", "a4");
//     const imgData = canvas.toDataURL("image/png");

//     // Calculate aspect ratio to fit the PDF
//     const imgWidth = pdf.internal.pageSize.getWidth();
//     const imgHeight = (canvas.height * imgWidth) / canvas.width;

//     pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

//     // Get filename
//     const messName = localStorage.getItem("messName") || "bazar_list";
//     const date = new Date().toISOString().split("T")[0];

//     // Save PDF
//     pdf.save(`${messName}_bazar_${date}.pdf`);
//   } catch (error) {
//     console.error("PDF generation error:", error);
//     alert("PDF তৈরি করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।");
//   } finally {
//     // Restore button state
//     pdfButton.textContent = originalText;
//     pdfButton.disabled = false;
//   }
// }
async function generatePDF() {
  const pdfButton = document.querySelector('button[onclick="generatePDF()"]');
  const originalText = pdfButton.textContent;
  pdfButton.textContent = "PDF তৈরি হচ্ছে...";
  pdfButton.disabled = true;

  try {
    const { jsPDF } = window.jspdf;
    const pdfBox = document.getElementById("pdfBox");

    // Force desktop layout temporarily
    pdfBox.classList.add("pdf-desktop");

    const wasHidden = pdfBox.classList.contains("hidden");
    if (wasHidden) {
      pdfBox.classList.remove("hidden");
      generateBazarList();
    }

    window.scrollTo(0, 0);

    const canvas = await html2canvas(pdfBox, {
      scale: 2, // keep high resolution
      scrollY: 0,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "pt", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

    const messName = localStorage.getItem("messName") || "bazar_list";
    const date = new Date().toISOString().split("T")[0];
    pdf.save(`${messName}_bazar_${date}.pdf`);
  } catch (error) {
    console.error("PDF generation error:", error);
    alert("PDF তৈরি করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
  } finally {
    pdfBox.classList.remove("pdf-desktop"); // Reset layout after PDF
    pdfButton.textContent = originalText;
    pdfButton.disabled = false;
  }
}
