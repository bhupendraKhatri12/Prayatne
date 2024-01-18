const btn = document.querySelector("#insertButton");
btn.addEventListener("click", () => {
	const name = document.querySelector("#name").value;
	const email = document.querySelector("#email").value;
	const creditCardNumber = document.querySelector("#ccn").value;

	//  data validation
	if (name === "" || email === "" || creditCardNumber === "") {
		alert("Please fill all the fields");
		return;
	} else if (name.length < 3) {
		alert("Name must be longer than 3 characters");
		return;
	} else if (email.length < 5 || !email.includes("@") || !email.includes(".")) {
		alert("Please enter a valid email");
		return;
	} else if (creditCardNumber.length !== 16) {
		alert("Please enter a valid credit card number");
		return;
	}

	const data = {
		name,
		email,
		creditCardNumber,
	};
	fetch("http://localhost:3000/api/user", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	})
		.then(res => res.json())
		.then(data => {
			console.log(data);
			if (data.success === true) {
				alert("Data inserted successfully");
			} else {
				alert("Data insertion failed");
			}
		})
		.catch(err => console.log(err));
});
