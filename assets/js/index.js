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

// function updateAndSaveDivideData() {

//     // Retrieve the stored data
//     const getItemVal = JSON.parse(localStorage.getItem('formData'));

//     if (!getItemVal) {
//         console.error('No form data found in localStorage');
//         return;
//     }

//     // Initialize an empty array to store the updated values
//     let formData = [];

//     // Iterate over each item in the retrieved data
//     getItemVal.forEach((item) => {
//         let newValue = item.value;

//         // Check the item id and update the value accordingly
//         if (item.id === "egg") {
//             newValue = item.value / 4;
//         } else {
//             newValue = item.value
//         }

//         // Push the updated item into the formData array
//         formData.push({
//             id: item.id,
//             value: newValue
//         });
//     });

//     // Retrieve the input elements from the form
//     const formElements = document.querySelectorAll('#itemDivideForm input[type="number"]');
//     let itemDivideVal = [];

//     formElements.forEach(input => {
//         let newPerheadValue = parseFloat(input.value);

//         // Check the item id and update the value accordingly
//         if (input.id !== "p-egg") {
//             newPerheadValue /= 1000;
//         }

//         // Format the value to ensure three decimal places if applicable
//         newPerheadValue = newPerheadValue.toFixed(3);

//         // Push the updated input into the itemDivideVal array
//         itemDivideVal.push({
//             id: input.id,
//             value: newPerheadValue
//         });
//     });

//     // Log the formatted values for verification
//     console.log(itemDivideVal);

//     // Optionally, save the formatted values to localStorage
//     localStorage.setItem('perHeadCost', JSON.stringify(itemDivideVal));

// }




// function updateAndSaveDivideData() {
//     // Retrieve the input elements from the form
//     const formElements = document.querySelectorAll('#itemDivideForm input[type="number"]');
//     let itemDivideVal = [];

//     formElements.forEach(input => {
//         let newPerheadValue = parseFloat(input.value);

//         // Check the item id and update the value accordingly
//         if (input.id !== "egg") {
//             newPerheadValue /= 1000;
//         }

//         // Format the value to ensure three decimal places if applicable
//         newPerheadValue = newPerheadValue.toFixed(3);

//         // Push the updated input into the itemDivideVal array
//         itemDivideVal.push({
//             id: input.id,
//             value: newPerheadValue
//         });
//     });

//     // Log the formatted values for verification
//     console.log(itemDivideVal);

//     // Optionally, save the formatted values to localStorage
//     localStorage.setItem('itemPerHead', JSON.stringify(itemDivideVal));
// }



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
        let itemDivide = itemDivideVal.find(item => item.id === `p-${formItem.id}`);
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
}


// Function to get data from local storage for use on other pages
// function getData() {
//     return JSON.parse(localStorage.getItem('formData'));
// }



document.addEventListener('DOMContentLoaded', (event) => {
    // Load data from local storage when the page loads
    loadData();
});