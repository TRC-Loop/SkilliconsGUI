/**
 * author: AK
 * created on 23-05-2024-19h-08m
 * github: https://github.com/TRC-Loop
 * email: ak@stellar-code.com
 * copyright 2024
*/

document.addEventListener('DOMContentLoaded', function () {
    var themeSwitch = document.getElementById('themeSwitch');
    // Function to allow dropping elements
    function allowDrop(event) {
        event.preventDefault();
    }

    // Function to handle dragging an element
    function drag(event) {
        event.dataTransfer.setData("text", event.target.id);
    }

    function setTooltips() {
        var items = document.querySelectorAll(".drag-item");

        items.forEach(function (item) {
            item.title = item.id.charAt(0).toUpperCase() + item.id.slice(1);
        });
    }

    setTooltips();



    function filterItems() {
        var searchInput = document.getElementById("searchInput").value.toLowerCase();
        var items = document.querySelectorAll("#box1 .drag-item");

        items.forEach(function (item) {
            if (item.id.toLowerCase().includes(searchInput)) {
                item.style.display = "";
            } else {
                item.style.display = "none";
            }
        });
    }

    // Add an event listener to the search input
    document.getElementById("searchInput").addEventListener("input", filterItems);


    // Function to handle dropping an element
    function drop(event) {
        event.preventDefault();
        var data = event.dataTransfer.getData("text");
        var draggedElement = document.getElementById(data);
        var targetBox = event.target.closest('.box');

        if (targetBox.id === "box2") {
            // Add the dragged icon to box2
            targetBox.appendChild(draggedElement);
        } else {
            // If dropped outside of box2, move back to original position in box1
            var originalBox = document.getElementById("box1");
            originalBox.appendChild(draggedElement);
            sortBox1();
        }
        updateGeneratedUrl();
    }

    // Function to enable dragging for items in box2
    function enableDraggingBox2() {
        var items = document.querySelectorAll('#box2 .drag-item');

        items.forEach(function (item) {
            item.draggable = true;

            item.addEventListener('dragstart', function (event) {
                event.dataTransfer.setData('text/plain', null);
                item.style.opacity = '0.4'; // Set opacity during drag
            });

            item.addEventListener('dragend', function () {
                item.style.opacity = '1'; // Reset opacity after drag
            });
        });
    }

    // Function to sort items in box1 alphabetically
    function sortBox1() {
        var box1 = document.getElementById("box1");
        var items = Array.from(box1.querySelectorAll(".drag-item"));
        items.sort((a, b) => a.id.localeCompare(b.id));
        items.forEach(item => box1.appendChild(item));
        updateGeneratedUrl();
    }

    // Function to update the generated URL
    function updateGeneratedUrl() {
        var box2 = document.getElementById("box2");
        var iconsInBox2 = box2.querySelectorAll(".drag-item");
        var perline = document.getElementById("iconsPerLineRange").value;
        var theme = themeSwitch.checked ? 'dark' : 'light';

        // Construct the base URL
        var baseUrl = "https://skillicons.dev/icons?i=";

        // Add icons to the URL
        iconsInBox2.forEach(function (icon, index) {
            if (index !== 0) {
                baseUrl += ",";
            }
            baseUrl += icon.id;
        });

        // Add perline and theme parameters
        baseUrl += "&perline=" + perline + "&theme=" + theme;

        // Update the generated URL element
        var generatedUrlElement = document.getElementById("generatedUrl");
        generatedUrlElement.textContent = baseUrl;
        if (baseUrl.length <= 54) {
            document.getElementById("previewImg").src = "https://next.stellar-cloud.com/index.php/s/Z8KPbfjSFJfb4Rr/download/Logo.png";
        } else {
            document.getElementById("previewImg").src = baseUrl;
        }
        
    }

    // Function to copy generated URL to clipboard
    function copyToClipboard() {
        var generatedUrlElement = document.getElementById("generatedUrl");
        var tempInput = document.createElement("input");
        tempInput.value = generatedUrlElement.textContent;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);

        // Change tooltip text to indicate copy action
        var tooltip = document.querySelector(".copy .tooltip");
        tooltip.setAttribute("data-text-end", "Copied!");
        tooltip.setAttribute("data-text-initial", "Copied!");
    }

    document.getElementById('box1').addEventListener('drop', drop);
    document.getElementById('box1').addEventListener('dragover', allowDrop);
    document.getElementById('box2').addEventListener('drop', drop);
    document.getElementById('box2').addEventListener('dragover', allowDrop);
    document.querySelector('.copy').addEventListener('click', copyToClipboard);

    // Add drag event listener to box2
    document.getElementById('box2').addEventListener('drag', function (event) {
        updateGeneratedUrl();
    });

    themeSwitch.addEventListener('change', function () {
        var themelbl = document.getElementById('themelbl');
        if (themeSwitch.checked) {
            themelbl.textContent = 'Dark';
        }
        else {
            themelbl.textContent = 'Light';
        }
        updateGeneratedUrl();
    });

    // Enable dragging for items in box1 and box2
    enableDraggingBox2();

    // Initialize Sortable for box1 and box2 with draggable elements
    new Sortable(document.getElementById('box1'), {
        group: 'shared',
        animation: 150,
        draggable: '.drag-item',
        sort: false // Prevent sorting in box1
    });

    new Sortable(document.getElementById('box2'), {
        group: 'shared',
        animation: 150,
        draggable: '.drag-item',
        onUpdate: function (event) {
            updateGeneratedUrl();
        }
    });

    // Function to update the generated URL when icons per line range changes
    document.getElementById('iconsPerLineRange').addEventListener('input', function () {
        var value = this.value;
        updateGeneratedUrl();
        if (value < 10) {
            value = '0' + value;
        }
        document.getElementById('iconsPerLineValue').textContent = value;
    });

    // Initial call to update the generated URL
    updateGeneratedUrl();
});
