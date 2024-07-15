// add-inventory-validation.js

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('addInventoryForm');
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      if (validateForm()) {
        this.submit();
      }
    });
  
    function validateForm() {
      let isValid = true;
      const make = document.getElementById('inv_make').value.trim();
      const model = document.getElementById('inv_model').value.trim();
      const year = document.getElementById('inv_year').value.trim();
      const classification = document.getElementById('classification_id').value.trim();
      const image = document.getElementById('inv_image').value.trim();
      const thumbnail = document.getElementById('inv_thumbnail').value.trim();
  
      // Basic validation
      if (!make || !model || !year || !classification || !image || !thumbnail) {
        alert('All fields are required.');
        isValid = false;
      }
  
      return isValid;
    }
  });
  