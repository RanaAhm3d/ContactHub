var avatar = document.getElementById("avatar");
var contactName = document.getElementById("contactName");
var contactPhone = document.getElementById("contactPhone");
var contactEmail = document.getElementById("contactEmail");
var contactAddress = document.getElementById("contactAddress");
var contactGroup = document.getElementById("contactGroup");
var contactNote = document.getElementById("contactNotes");
var contactFavorite = document.getElementById("contactFavorite");
var contactEmergency = document.getElementById("contactEmergency");
var contactForm = document.getElementById("contactForm");
var contactsBody = document.getElementById("contacts-body");
var favoriteBody = document.querySelector(".favorite-body");
var searchInput = document.getElementById("searchInput");
var emptyFavorites = document.querySelector(".empty-favorites");
var emergencyBody = document.querySelector(".emergency-body");
var emptyEmergency = document.querySelector(".empty-emergency");
var contactEmailError = document.getElementById("contactEmailError");
var contactPhoneError = document.getElementById("contactPhoneError");
var contactNameError = document.getElementById("contactNameError");
var emptyContact = document.querySelector(".contact-empty");
const modalInstance = new bootstrap.Modal(
  document.getElementById("exampleModal")
);

let contacts;
var editIndex = null;

const gradients = [
  "bg-gradient-fuchsia",
  "bg-gradient-blue",
  "bg-gradient-emerald",
  "bg-gradient-amber",
  "bg-gradient-rose",
  "bg-gradient-purple",
  "bg-gradient-cyan",
  "bg-gradient-orange",
  "bg-gradient-pink",
];

if (localStorage.getItem("contacts")) {
  contacts = JSON.parse(localStorage.getItem("contacts"));
} else {
  contacts = [];
}
displayContacts(contacts);
displayFavorites();
displayEmergency();
updateTotalContacts();
updateTotalFavorites();
updateTotalEmergency();

contactForm.addEventListener("submit", function (e) {
  e.preventDefault();
  if (
    !validateName() ||
    !validatePhone() ||
    !validateEmail() ||
    !duplicateNumber()
  ) {
    switch (true) {
      case !validateName():
        Swal.fire({
          icon: "error",
          title: "Invalid Name",
          text: "Name should contain only letters and spaces (2-50 characters)",
        });
        break;
      case !validatePhone():
        Swal.fire({
          icon: "error",
          title: "Invalid Phone",
          text: "Please enter a valid Egyptian phone number (e.g., 01012345678 or +201012345678)",
        });
        break;
      case !validateEmail():
        Swal.fire({
          icon: "error",
          title: "Invalid Email",
          text: "Please enter a valid email address",
        });
        break;
      case !duplicateNumber():
        duplicateNumber();
        break;
    }
    return;
  }
  const isEdit = editIndex !== null;
  var contact = {
    avatar: avatar?.files[0]?.name
      ? avatar.files[0].name
      : isEdit
      ? contacts[editIndex].avatar
      : null,
    name: contactName.value,
    phone: contactPhone.value,
    email: contactEmail.value,
    address: contactAddress.value,
    group: contactGroup.value,
    note: contactNote.value,
    favorite: contactFavorite.checked,
    emergency: contactEmergency.checked,
    gradient: isEdit ? contacts[editIndex].gradient : getRandomGradient(),
  };

  if (isEdit) {
    contacts[editIndex] = contact;
  } else {
    contacts.push(contact);
  }

  saveToLocalStorage();
  displayContacts(contacts);
  displayFavorites();
  displayEmergency();

  Swal.fire({
    title: isEdit ? "Updated" : "Added",
    text: isEdit
      ? "Contact has been updated successfully"
      : "Contact has been added successfully",
    icon: "success",
    timer: 1000,
    showConfirmButton: false,
  });

  editIndex = null;
  updateTotalContacts();
  updateTotalFavorites();
  updateTotalEmergency();
  resetAvatarPreview();
  modalInstance.hide();
  contactForm.reset();
});

function openAddModal() {
  editIndex = null;
  contactForm.reset();
  document.getElementById("exampleModalLabel").textContent = "Add New Contact";
  resetAvatarPreview();
  modalInstance.show();
}

function displayContacts(contacts) {
  contactsBody.innerHTML = "";
  if (contacts.length === 0) {
    emptyContact.classList.remove("d-none");
    emptyContact.classList.add("d-flex");
  } else {
    emptyContact.classList.add("d-none");
    contactsBody.classList.remove("d-none");
    for (var i = 0; i < contacts.length; i++) {
      var contact = contacts[i];
      var groupBadge = "";
      switch (contact.group) {
        case "family":
          groupBadge = `<div class="badge d-flex align-items-center justify-content-center bg-blue-100">
                    <span class="text-blue-700 fw-normal">Family</span>
                  </div>`;
          break;
        case "school":
          groupBadge = `<div class="badge d-flex align-items-center justify-content-center bg-amber-100">
                    <span class="text-amber-700 fw-normal">School</span>
                  </div>`;
          break;
        case "friends":
          groupBadge = `<div class="badge d-flex align-items-center justify-content-center bg-green-100">
                    <span class="text-green-700 fw-normal">Friends</span>
                  </div>`;
          break;
        case "work":
          groupBadge = `<div class="badge d-flex align-items-center justify-content-center bg-purple-100">
                    <span class="text-purple-700 fw-normal">Work</span>
                  </div>`;
          break;
        case "other":
          groupBadge = `<div class="badge d-flex align-items-center justify-content-center bg-gray-100">
                    <span class="text-gray-700 fw-normal">Other</span>
                  </div>`;
          break;
      }

      contactsBody.innerHTML += `
                      <div class="col-md-6">
                <div class="contact-card mb-2">
                  <div class="contact-body">
                    <div class="d-flex flex-row gap-3">
                      <div class="contact-avatar position-relative">
                        ${
                          contact.avatar
                            ? `<img src="images/${contact.avatar}" alt="user-img" class="img-fluid" />`
                            : `<div class="icon-56 rounded-2 ${
                                contact.gradient
                              } d-flex align-items-center justify-content-center">
             <span class="text-white fw-bold text-uppercase">${contact.name.slice(
               0,
               2
             )}</span>
           </div>`
                        }
${
  contact.favorite
    ? `                                                <div
                          class="star position-absolute bg-amber-400 d-flex align-items-center justify-content-center"
                        >
                          <i class="fa-solid fa-star text-white"></i>
                        </div>`
    : ""
}
${
  contact.emergency
    ? `                        <div
                          class="fav position-absolute bg-rose-500 d-flex align-items-center justify-content-center"
                        >
                          <i class="fa-solid fa-heart-pulse text-white"></i>
                        </div>`
    : ""
}
                      </div>
                      <div class="contact-content d-flex flex-column justify-content-center">
                        <h3 id="user-name" class="fw-bold text-truncate d-block mb-0">
                          ${contact.name}
                        </h3>
                        <div class="d-flex flex-row mt-1 gap-2">
                          <div
                            class="icon-24 rounded-1 bg-blue-100 d-flex align-items-center justify-content-center"
                          >
                            <i class="fa-solid fa-phone text-blue-600"></i>
                          </div>
                          <span
                            id="user-phone"
                            class="fw-medium text-gray-500 mb-0"
                          >
                            ${contact.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="contact-details">
                      <div
                        class="d-flex flex-row align-items-center mb-2 gap-2"
                      >
                        <div
                          class="icon-28 rounded-1 bg-violet-100 d-flex align-items-center justify-content-center"
                        >
                          <i class="fa-solid fa-envelope text-violet-600"></i>
                        </div>
                        <span
                          id="user-address"
                          class="text-gray-600 fs-14 mb-0"
                        >
                          ${contact.email}
                        </span>
                      </div>
                      <div
                        class="d-flex flex-row align-items-center mb-2 gap-2"
                      >
                        <div
                          class="icon-28 rounded-1 bg-emerald-100 d-flex align-items-center justify-content-center"
                        >
                          <i
                            class="fa-solid fa-location-dot text-emerald-600"
                          ></i>
                        </div>
                        <span
                          id="user-address"
                          class="text-gray-600 fs-14 mb-0"
                        >
                          ${contact.address}
                        </span>
                      </div>
                      <div class="badges d-flex flex-row gap-2">
                        ${groupBadge}
                        ${
                          contact.emergency
                            ? `<div class="badge d-flex align-items-center justify-content-center bg-rose-50">
       <span class="text-rose-600 fw-normal"><i class="fa-solid fa-heart-pulse"></i> Emergency</span>
     </div>`
                            : ""
                        }
                      </div>
                    </div>
                  </div>
                  <div class="contact-footer">
                    <div
                      class="d-flex flex-row align-items-center justify-content-between"
                    >
                      <div class="d-flex flex-row gap-2">
                        <a
                          href="tel:${contact.phone}"
                          title="Call"
                          class="call bg-emerald-50 icon-36 rounded-2 d-flex align-items-center justify-content-center text-decoration-none"
                          ><i
                            class="fa-solid fa-phone fs-14 text-emerald-600"
                          ></i
                        ></a>
                        <a
                          href="mailto:${contact.email}"
                          title="Email"
                          class="icon-36 mail bg-violet-50 rounded-2 d-flex align-items-center justify-content-center text-decoration-none"
                        >
                          <i
                            class="fa-solid fa-envelope fs-14 text-violet-600"
                          ></i>
                        </a>
                      </div>
                      <div class="buttons d-flex flex-row gap-3">
                        <button
                        onclick="toggleFavorite(${i})"
                          
                          title="Favorite"
                        >
                        ${
                          contact.favorite
                            ? `<div class="favorite-true bg-amber-50 icon-36 rounded-2 d-flex align-items-center justify-content-center">
                          <i class="fa-solid fa-star text-amber-400"></i>
                        </div>`
                            : `<div class="favorite icon-36 bg-gray-50 rounded-2 d-flex align-items-center justify-content-center">
                          <i class="fa-regular fa-star text-gray-400"></i>
                        </div>`
                        }
                          
                        </button>
                        <button
                        onclick="toggleEmergency(${i})"
                          title="Emergency"
                        > ${
                          contact.emergency
                            ? `<div class="emergency-true icon-36 bg-rose-50 rounded-2 d-flex align-items-center justify-content-center">
                          <i class="fa-solid fa-heart-pulse text-rose-500"></i>
                        </div>`
                            : `<div class="emergency bg-gray-50 icon-36 rounded-2 d-flex align-items-center justify-content-center">
                          <i class="fa-regular fa-heart text-gray-400"></i>
                        </div>`
                        }
                        
                        </button>
                        <button
                        onclick="editContact(${i})"
                          class="edit icon-36 rounded-2 d-flex align-items-center justify-content-center"
                          title="Edit"
                        >
                          <i class="fa-solid fa-pen text-gray-500"></i>
                        </button>
                        <button
                        onclick="deleteContact(${i})"
                          class="delete icon-36 rounded-2 d-flex align-items-center justify-content-center"
                          title="Delete"
                        >
                          <i class="fa-solid fa-trash text-gray-500"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
        `;
    }
  }
}

function displayFavorites() {
  favoriteBody.innerHTML = "";

  const favorites = contacts.filter((contact) => contact.favorite);

  if (favorites.length === 0) {
    emptyFavorites.classList.remove("d-none");
    favoriteBody.classList.add("d-none");
    return;
  }

  emptyFavorites.classList.add("d-none");
  favoriteBody.classList.remove("d-none");

  favorites.forEach((contact) => {
    favoriteBody.innerHTML += `
      <div class="d-flex flex-column">
        <div
          class="fav-inner d-flex flex-row justify-content-between align-items-center text-black text-decoration-none"
        >
          <div class="d-flex flex-row gap-2">
<div class="contact-avatar">
${
  contact.avatar
    ? `<img src="images/${contact.avatar}" alt="user-img" class="img-fluid" />`
    : `<div class="icon-56 rounded-2 ${
        contact.gradient
      } d-flex align-items-center justify-content-center">
             <span class="text-white fw-bold text-uppercase">${contact.name.slice(
               0,
               2
             )}</span>
           </div>`
}</div>
            <div class="d-flex flex-column justify-content-center">
              <h4   class="fw-medium text-black fs-14 mb-0 text-truncate d-block ">
                ${contact.name}
              </h4>
              <span class="text-gray-500 fs-12">${contact.phone}</span>
            </div>
          </div>
          <a
          href="tel:${contact.phone}"
            class="icon-32 d-flex align-items-center justify-content-center bg-emerald-100 rounded-2 text-decoration-none"
          >
            <i class="fa-solid fa-phone text-emerald-600"></i>
          </a>
        </div>
      </div>`;
  });
}

function displayEmergency() {
  emergencyBody.innerHTML = "";
  const emergencies = contacts.filter((contact) => contact.emergency);

  if (emergencies.length === 0) {
    emptyEmergency.classList.remove("d-none");
  } else {
    emptyEmergency.classList.add("d-none");
    emergencyBody.classList.remove("d-none");

    emergencies.forEach((contact) => {
      emergencyBody.innerHTML += `
                        <div class="d-flex flex-column">
                  <div
                    class="emergency-inner d-flex flex-row justify-content-between align-items-center text-black "
                  >
                    <div class="d-flex flex-row gap-2">
<div class="contact-avatar">${
        contact.avatar
          ? `<img src="images/${contact.avatar}" alt="user-img" class="img-fluid" />`
          : `<div class="icon-56 rounded-2 ${
              contact.gradient
            } d-flex align-items-center justify-content-center">
             <span class="text-white fw-bold text-uppercase">${contact.name.slice(
               0,
               2
             )}</span>
           </div>`
      }</div>
                      <div class="d-flex flex-column justify-content-center">
                        <h4 class="fw-medium text-black fs-14 mb-0 text-truncate d-block ">
                          ${contact.name}
                        </h4>
                        <span class="text-gray-500 fs-12">${
                          contact.phone
                        }</span>
                      </div>
                    </div>
                    <a
                    href="tel:${contact.phone}"
                      class="icon-32 d-flex align-items-center justify-content-center bg-rose-100 rounded-2 text-decoration-none"
                    >
                      <i class="fa-solid fa-phone text-rose-600"></i>
                    </a>
                  </div>
                </div>`;
    });
  }
}

function deleteContact(index) {
  Swal.fire({
    title: "Delete?",
    text: `Are you sure you want to delete ${contacts[index].name}? This action cannot be undone.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#6B7280",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      contacts.splice(index, 1);
      saveToLocalStorage();
      displayContacts(contacts);
      displayFavorites();
      displayEmergency();
      updateTotalContacts();
      updateTotalFavorites();
      updateTotalEmergency();

      Swal.fire({
        title: "Deleted!",
        text: "The contact has been deleted.",
        icon: "success",
        timer: 1000,
        showConfirmButton: false,
      });
    }
  });
}

function saveToLocalStorage() {
  localStorage.setItem("contacts", JSON.stringify(contacts));
}

function updateTotalContacts() {
  document.getElementById("totalContacts").textContent = contacts.length;
  document.getElementById("contacts").textContent = contacts.length;
}

function updateTotalFavorites() {
  const favorites = contacts.filter((contact) => contact.favorite === true);
  document.getElementById("totalFavorites").textContent = favorites.length;
}

function updateTotalEmergency() {
  const emergencies = contacts.filter((contact) => contact.emergency === true);
  document.getElementById("totalEmergency").textContent = emergencies.length;
}

function toggleFavorite(index) {
  contacts[index].favorite = !contacts[index].favorite;
  saveToLocalStorage();
  displayContacts(contacts);
  displayFavorites();
  updateTotalFavorites();
}

function toggleEmergency(index) {
  contacts[index].emergency = !contacts[index].emergency;
  saveToLocalStorage();
  displayContacts(contacts);
  displayEmergency();
  updateTotalEmergency();
}

function editContact(index) {
  editIndex = index;

  document.getElementById("exampleModalLabel").textContent =
    editIndex !== null ? "Edit Contact" : "Add New Contact";

  const avatarPreview = document.getElementById("avatarPreview");
  if (contacts[index].avatar) {
    avatarPreview.innerHTML = `
      <img
        src="images/${contacts[index].avatar}"
        alt="user-img"
        class="img-fluid rounded-circle"
      />
    `;
  } else {
    avatarPreview.innerHTML = `
      <div class="d-flex flex-column gap-3 align-items-center justify-content-center">
        <div class="icon-96 rounded-circle ${
          contacts[index].gradient
        } d-flex align-items-center justify-content-center">
          <span class="text-white fw-bold text-uppercase">
            ${contacts[index].name.slice(0, 2)}
          </span>
        </div>
      </div>
    `;
  }
  contactName.value = contacts[index].name;
  contactPhone.value = contacts[index].phone;
  contactEmail.value = contacts[index].email;
  contactAddress.value = contacts[index].address;
  contactGroup.value = contacts[index].group;
  contactNote.value = contacts[index].note;
  contactFavorite.checked = contacts[index].favorite;
  contactEmergency.checked = contacts[index].emergency;

  modalInstance.show();
}

function search() {
  const value = searchInput.value.toLowerCase();
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(value) ||
      contact.phone.includes(value) ||
      contact.email.toLowerCase().includes(value)
  );
  displayContacts(filteredContacts);
}

function validateName() {
  const regex = /^[a-zA-Z\s]{2,50}$/;
  if (regex.test(contactName.value) || contactName.value === "") {
    contactNameError.classList.replace("d-block", "d-none");
    return true;
  } else {
    contactNameError.classList.replace("d-none", "d-block");
    return false;
  }
}

function validatePhone() {
  const regex = /^01[0-2,5][0-9]{8}$/;
  if (regex.test(contactPhone.value) || contactPhone.value === "") {
    contactPhoneError.classList.replace("d-block", "d-none");
    return true;
  } else {
    contactPhoneError.classList.replace("d-none", "d-block");
    return false;
  }
}

function validateEmail() {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (regex.test(contactEmail.value) || contactEmail.value === "") {
    contactEmailError.classList.replace("d-block", "d-none");
    return true;
  } else {
    contactEmailError.classList.replace("d-none", "d-block");
    return false;
  }
}

function duplicateNumber() {
  const isDuplicate = contacts.some(
    (contact, index) =>
      contact.phone === contactPhone.value && index !== editIndex
  );

  if (isDuplicate) {
    const existingContact = contacts.find(
      (contact, index) =>
        contact.phone === contactPhone.value && index !== editIndex
    );

    Swal.fire({
      icon: "error",
      title: "Duplicate Phone Number",
      text: `A contact with this phone number already exists: ${existingContact.name}`,
    });
    return false;
  }

  return true;
}

function getRandomGradient() {
  const randomIndex = Math.floor(Math.random() * gradients.length);
  return gradients[randomIndex];
}

function resetAvatarPreview() {
  const avatarPreview = document.getElementById("avatarPreview");

  avatarPreview.innerHTML = `<i class="fa-solid fa-user"></i>`;
  avatarPreview.className =
    "avatarPreview d-flex align-items-center justify-content-center";
}
