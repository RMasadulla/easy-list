function downloadPDF() {

    const BanglaFont = 'data:font/ttf;base64,...';

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'pt', 'a4');  // 'pt' for points, 'a4' for A4 size paper

    const margin = 72; // 1 inch margin (72 points = 1 inch)
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const noticeContent = document.getElementById('everyDayList').innerText;



    // Add the custom Bangla font
    doc.addFileToVFS("BanglaFont.ttf", BanglaFont);
    doc.addFont("BanglaFont.ttf", "BanglaFont", "normal");
    doc.setFont("BanglaFont");

    // Draw border
    doc.setLineWidth(1);
    doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);

    // Add title
    doc.setFontSize(16);
    doc.text("List", margin + 10, margin + 20);

    // Add notice content
    doc.setFontSize(14);
    const textYPosition = margin + 40;  // Adjust text position below the title
    doc.text(noticeContent, margin + 10, textYPosition, { maxWidth: pageWidth - 2 * margin - 20 });

    // Save the PDF
    doc.save("notice.pdf");
}

// function downloadPDF() {
//     var element = document.getElementById('pdfBox');
//     var opt = {
//         margin: .5,
//         filename: 'myfile.pdf',
//         image: { type: 'jpeg', quality: 0.98 },
//         html2canvas: { scale: 1 },
//         jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
//     };

//     // New Promise-based usage:
//     html2pdf().set(opt).from(element).save();
// }



function updateAndSaveData() {
    const formElements = document.querySelectorAll('#itemForm input[type="number"]');
    let formData = [];

    formElements.forEach(input => {
        formData.push({
            id: input.id,
            value: input.value
        });
    });

    // Save formData array to local storage
    localStorage.setItem('formData', JSON.stringify(formData));

    alert('Data saved successfully!');
}


function updateAndSaveDivideData() {

    // Retrieve the stored data
    const getItemVal = JSON.parse(localStorage.getItem('formData'));

    if (!getItemVal) {
        console.error('No form data found in localStorage');
        return;
    }

    // Initialize an empty array to store the updated values
    let formData = [];

    // Iterate over each item in the retrieved data
    getItemVal.forEach((item) => {
        let newValue = item.value;

        // Check the item id and update the value accordingly
        if (item.id === "egg") {
            newValue = item.value / 4;
        } else {
            newValue = item.value;
        }

        // Push the updated item into the formData array
        formData.push({
            id: item.id,
            value: newValue
        });
    });

    // Retrieve the input elements from the form
    const formElements = document.querySelectorAll('#itemDivideForm input[type="number"]');
    let itemDivideVal = [];

    formElements.forEach(input => {
        let newPerheadValue = parseFloat(input.value);

        // Check the item id and update the value accordingly
        if (input.id !== "p-egg") {
            newPerheadValue /= 1000;
        }

        // Format the value to ensure three decimal places if applicable
        newPerheadValue = newPerheadValue.toFixed(3);

        // Push the updated input into the itemDivideVal array
        itemDivideVal.push({
            id: input.id,
            value: newPerheadValue
        });
    });


    // Log the formatted values for verification
    console.log(itemDivideVal);

    // Optionally, save the itemDivideVal to localStorage
    localStorage.setItem('itemDivideVal', JSON.stringify(itemDivideVal));


    // Combine formData and itemDivideVal to calculate perHeadCost
    let perHeadCost = [];

    formData.forEach(formItem => {
        let itemDivide = itemDivideVal.find(item => item.id === `p-${formItem.id}` || `p-${formItem.id}-m` || `p-${formItem.id}-d` || `p-${formItem.id}-n`);
        if (itemDivide) {
            let combinedValue = (formItem.value * parseFloat(itemDivide.value)).toFixed(3);
            perHeadCost.push({
                id: formItem.id,
                perHeadCost: combinedValue
            });
        }
    });

    // Log the perHeadCost for verification
    console.log(perHeadCost);

    // Optionally, save the perHeadCost to localStorage
    localStorage.setItem('perHeadCost', JSON.stringify(perHeadCost));

}



function loadData() {
    const savedData = JSON.parse(localStorage.getItem('formData'));
    const perHeadNeed = JSON.parse(localStorage.getItem('itemDivideVal'));
    const localMessName = localStorage.getItem('messName');
    const localmanagerName = localStorage.getItem('managerName');

    if (savedData) {
        savedData.forEach(item => {
            const inputElement = document.getElementById(item.id);
            if (inputElement) {
                inputElement.value = item.value;
            }
        });
    }

    if (perHeadNeed) {
        perHeadNeed.forEach(item => {
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

    if (localMessName) {
        document.getElementById("messName").value = localMessName
        document.getElementById("messDetails").textContent = localMessName
    }
    if (localmanagerName) {
        document.getElementById("managerName").value = localmanagerName
        document.getElementById("managerDetails").textContent = localmanagerName
    }
}


function listUpdate() {

    let pdfList = [];

    const currentDate = document.getElementById('currentDate');

    const messNameInput = document.getElementById("messName")
    const messDetails = document.getElementById("messDetails")

    const managerNameInput = document.getElementById('managerName');
    const managerDetails = document.getElementById("managerDetails")

    const renderDate = () => {
        const date = new Date();
        const formattedDate = date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
        currentDate.textContent = formattedDate;
    }

    messNameInput.addEventListener('input', () => {
        messDetails.textContent = messNameInput.value || 'মেসের নাম'
        localStorage.setItem("messName", messDetails.textContent)
    });


    managerNameInput.addEventListener('input', () => {
        managerDetails.textContent = managerNameInput.value || 'Manager Name';
        localStorage.setItem("managerName", managerDetails.textContent)
    });

    renderDate()
}


// function memberAdd() {
//     const bazarItemList = document.getElementById("bazarItemList")
//     const dayCount = document.getElementById("dayCount")
//         // const perHeadCost = JSON.parse(localStorage.getItem('perHeadCost'));
//         const perHeadCost = JSON.parse(localStorage.getItem('itemDivideVal'));

//     perHeadCost.forEach((val, i) => {

//         const totalCost = (val.value * dayCount.value);
//         const morningText = val.showMorning ? '(সকাল)' : '';
//         const itemQty = val.id === "p-egg" ? 'পিস' : 'কেজি';

//         bazarItemList.innerHTML += `
//            <li id="listItemNumber" class="my-3">
//             <span class="text-base">${i + 1}.</span><span class="ml-1" id="listItemName">${val.id}</span><span
//                 class="text-sm mx-2 text-yellow-800" id="listItemTime">(সকাল)</span>-<span class="mx-2"
//                     id="listItemQuantity">${totalCost}</span>${itemQty}
//         </li>
//         `;
//     });
// }

document.addEventListener('DOMContentLoaded', () => {
    const bazarItemList = document.getElementById("bazarItemList");
    const dayCount = document.getElementById("dayCount");
    const nightCount = document.getElementById("nightCount");
    const morningCount = document.getElementById("morningCount");

    const memberAdd = () => {
        // Clear the current list
        bazarItemList.innerHTML = '';

        // Get the perHeadCost from localStorage
        const perHeadCost = JSON.parse(localStorage.getItem('itemDivideVal'));

        perHeadCost.forEach((val, i) => {
            const totalCost = (val.value * dayCount.value);
            const dayText = val.id === "p-rice-m" ? '(সকাল)' : val.id === "p-rice-d" ? '(দুপুর)' : val.id === "p-rice-n" ? '(রাত)' : '';

            const itemQty = val.id === "p-egg" ? 'পিস' : 'কেজি';

            const itemName = val.id === "p-rice-m" ? "চাল" :
                val.id === "p-rice-d" ? "চাল" :
                    val.id === "p-rice-n" ? "চাল" :
                        val.id === "p-dal" ? "ডাল" :
                            val.id === "p-oil" ? "তেল" :
                                val.id === "p-salt" ? "লবণ" :
                                    val.id === "p-chicken-meat" ? "মুরগির মাংস" :
                                        val.id === "p-beef" ? "গরুর মাংস" :
                                            val.id === "p-egg" ? "ডিম" :
                                                val.id === "p-green-chillies" ? "কাঁচা মরিচ" :
                                                    val.id === "p-dry-chili" ? "শুকনা মরিচ" :
                                                        val.id === "p-chilli-powder" ? "গুড়া মরিচ" :
                                                            val.id === "p-yellow-powder" ? "গুড়া হলুদ" :
                                                                val.id === "p-onion" ? "পেঁয়াজ" :
                                                                    val.id === "p-garlic" ? "রসুন" :
                                                                        val.id === "p-ginger" ? "আদা" : ""

            if (val.value > 0) {
                // Append the new list items
                bazarItemList.innerHTML += `
                <li id="listItemNumber" class="my-3">
                <span class="text-base">${i + 1}.</span><span class="ml-1" id="listItemName">${itemName}</span><span
                    class="text-sm mx-2 text-yellow-800" id="listItemTime">${dayText}</span>-<span class="mx-2"
                        id="listItemQuantity">${totalCost.toFixed(3)}</span>${itemQty}
                </li>
                `;
            }

        });
    }

    // Initial call to display the list
    memberAdd();

    // Add event listener to dayCount input to call memberAdd on value change
    dayCount.addEventListener('input', memberAdd);
});


// Function to get data from local storage for use on other pages
// function getData() {
//     return JSON.parse(localStorage.getItem('formData'));
// }



document.addEventListener('DOMContentLoaded', (event) => {
    // Load data from local storage when the page loads
    loadData();
    listUpdate()
});