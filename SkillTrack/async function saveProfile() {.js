async function saveProfile() {
  const username = document.getElementById("username").value.trim();
  const about = document.getElementById("about").value.trim();
  const college = document.getElementById("college").value.trim();
  const email = localStorage.getItem('userEmail');
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];

  if (!username || !about || !college) {
    alert("Please fill all fields.");
    return;
  }
  if (!email) {
    alert("User email not found. Please login again.");
    return;
  }

  const formData = new FormData();
  formData.append('email', email);
  formData.append('username', username);
  formData.append('about', about);
  formData.append('college', college);
  if (file) {
    formData.append('profilePic', file);
  }

  try {
    const res = await fetch('http://localhost:5000/api/profile', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (res.ok) {
      alert('Profile saved!');
      window.location.href = 'page.html';
    } else {
      alert(data.error || 'Profile update failed');
    }
  } catch {
    alert('Server error. Please try again later.');
  }
  hideForm();
}