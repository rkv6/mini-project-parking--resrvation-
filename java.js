let selectedSlot = null;
let reservedSlots = JSON.parse(localStorage.getItem("reservedSlots")) || {};

document.addEventListener("DOMContentLoaded", () => {
    console.log("JavaScript Loaded");
    loadReservedSlots();
});

// Open Payment Popup
function openPaymentPopup(slot) {
    if (reservedSlots[slot]) {
        alert("This slot is already reserved!");
        return;
    }

    selectedSlot = slot;
    document.getElementById("slotNumber").textContent = slot;
    document.getElementById("paymentPopup").style.display = "block";
}

// Close Payment Popup
function closePaymentPopup() {
    document.getElementById("paymentPopup").style.display = "none";
}

// Process Payment
function processPayment() {
    let cardNumber = document.getElementById("cardNumber").value.trim();
    let expiry = document.getElementById("expiry").value.trim();
    let cvv = document.getElementById("cvv").value.trim();
    let startTime = document.getElementById("startTime").value;

    if (!cardNumber || !expiry || !cvv || !startTime) {
        alert("Please enter all details.");
        return;
    }

    alert(`Payment successful! Slot ${selectedSlot} reserved from ${startTime}.`);

    reservedSlots[selectedSlot] = { startTime: startTime };
    localStorage.setItem("reservedSlots", JSON.stringify(reservedSlots));

    updateSlotDisplay(selectedSlot);
    moveToLeftSidebar(selectedSlot);
    closePaymentPopup();
}

// Move Reserved Slot to Left Sidebar
function moveToLeftSidebar(slot) {
    let reservedSlotsList = document.getElementById("reservedSlotsList");

    // Check if slot already exists in the sidebar
    let existingSlot = document.getElementById(`reserved-${slot}`);
    if (existingSlot) return;

    let reservedSlotDiv = document.createElement("div");
    reservedSlotDiv.classList.add("reserved-slot-item");
    reservedSlotDiv.id = `reserved-${slot}`;
    reservedSlotDiv.innerHTML = `
        <p>Slot ${slot} (Reserved)</p>
        <div id="qr-${slot}"></div> 
        <br>
        <button onclick="cancelReservation(${slot})" id="cancel" >Cancel</button>
    `;
    reservedSlotsList.appendChild(reservedSlotDiv);

    generateQRCode(slot);
}

// Generate QR Code
function generateQRCode(slot) {
    let qrData = JSON.stringify({ slot: slot, startTime: reservedSlots[slot].startTime });
    let qrCodeDiv = document.getElementById(`qr-${slot}`);
    qrCodeDiv.innerHTML = ""; // Clear previous QR code

    new QRCode(qrCodeDiv, {
        text: qrData,
        width: 100,
        height: 100,
    });
}

// Cancel Reservation
function cancelReservation(slot) {
    if (confirm(`Are you sure you want to cancel the reservation for Slot ${slot}?`)) {
        delete reservedSlots[slot];
        localStorage.setItem("reservedSlots", JSON.stringify(reservedSlots));

        // Reset the middle grid slot
        let slotElement = document.getElementById(`slot-${slot}`);
        if (slotElement) {
            slotElement.classList.remove("reserved");
            slotElement.innerText = slot;
        }

        // Remove from left box
        let reservedSlotDiv = document.getElementById(`reserved-${slot}`);
        if (reservedSlotDiv) {
            reservedSlotDiv.remove();
        }

        alert(`Reservation for Slot ${slot} has been canceled.`);
    }
}

// Load Reserved Slots on Page Load
function loadReservedSlots() {
    for (let slot in reservedSlots) {
        updateSlotDisplay(slot);
        moveToLeftSidebar(slot);
    }
}

// Update Slot Display in Grid
function updateSlotDisplay(slot) {
    let slotElement = document.getElementById(`slot-${slot}`);
    if (!slotElement) return;

    let reservation = reservedSlots[slot];
    let startTime = new Date(reservation.startTime).toLocaleTimeString();

    slotElement.classList.add("reserved");
    slotElement.innerHTML = `Reserved <br> (Starts: ${startTime})`;
}
