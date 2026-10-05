const noThanksButton = document.querySelector("#no-thanks");

const carousel = document.querySelector("#ice-cream-carousel");

if (carousel) {
	const slides = [...carousel.querySelectorAll(".carousel-slide")];
	const dots = [...carousel.querySelectorAll(".carousel-dot")];
	let activeSlide = 0;

	const showSlide = (nextSlide) => {
		activeSlide = (nextSlide + slides.length) % slides.length;
		slides.forEach((slide, index) => {
			const isActive = index === activeSlide;
			slide.classList.toggle("is-active", isActive);
			slide.setAttribute("aria-hidden", String(!isActive));
			dots[index].classList.toggle("is-active", isActive);
			dots[index].setAttribute("aria-pressed", String(isActive));
		});
	};

	carousel.querySelector(".carousel-prev").addEventListener("click", () => showSlide(activeSlide - 1));
	carousel.querySelector(".carousel-next").addEventListener("click", () => showSlide(activeSlide + 1));
	dots.forEach((dot, index) => dot.addEventListener("click", () => showSlide(index)));
}

if (noThanksButton) {
	const response = document.querySelector("#no-response");
	const messages = [
		"Por que não?",
		"Tem certeza?",
		"Só dessa vez?",
		"Vai, por favor",
		"Prometo que vai ser legal",
		"Por favorzinho?",
		"Só uma chance",
		"Não custa tentar",
	];
	let messageIndex = 0;
	let lastMoveAt = 0;

	const moveButton = (event) => {
		const padding = 8;
		const maxLeft = Math.max(padding, window.innerWidth - noThanksButton.offsetWidth - padding);
		const maxTop = Math.max(padding, window.innerHeight - noThanksButton.offsetHeight - padding);
		let left = padding + Math.random() * (maxLeft - padding);
		let top = padding + Math.random() * (maxTop - padding);

		for (let attempt = 0; attempt < 20; attempt += 1) {
			left = padding + Math.random() * (maxLeft - padding);
			top = padding + Math.random() * (maxTop - padding);
			const pointerX = event.clientX;
			const pointerY = event.clientY;
			if (Math.hypot(left + noThanksButton.offsetWidth / 2 - pointerX, top + noThanksButton.offsetHeight / 2 - pointerY) > 120) break;
		}

		noThanksButton.classList.add("is-dodging");
		noThanksButton.style.left = `${left}px`;
		noThanksButton.style.top = `${top}px`;
		response.textContent = messages[messageIndex];
		response.hidden = false;
		messageIndex = (messageIndex + 1) % messages.length;
		lastMoveAt = Date.now();
	};

	noThanksButton.addEventListener("pointerenter", (event) => {
		if (event.pointerType !== "touch") moveButton(event);
	});
	noThanksButton.addEventListener("pointerdown", (event) => {
		event.preventDefault();
		moveButton(event);
	});
	noThanksButton.addEventListener("click", (event) => {
		event.preventDefault();
		if (Date.now() - lastMoveAt > 500) moveButton(event);
	});
}

const dateForm = document.querySelector("#date-form");

if (dateForm) {
	const dateInput = document.querySelector("#meet-date");
	const customTimeField = document.querySelector("#custom-time-field");
	const customTimeInput = document.querySelector("#custom-meet-time");
	const timeInputs = [...document.querySelectorAll("input[name='meet-time']")];
	const today = new Date();
	dateInput.min = new Date(today.getTime() - today.getTimezoneOffset() * 60_000)
		.toISOString()
		.slice(0, 10);

	const formatCustomTime = (timeValue) => {
		if (!timeValue) return "Ainda não tenho certeza";
		const [hours, minutes] = timeValue.split(":").map(Number);
		const formattedTime = `${String(hours).padStart(2, "0")}h${minutes ? String(minutes).padStart(2, "0") : ""}`;
		return `às ${formattedTime}`;
	};

	const syncCustomTimeField = () => {
		const selectedTime = dateForm.querySelector("input[name='meet-time']:checked");
		const isCustomTime = selectedTime?.dataset.custom === "true";
		customTimeField.hidden = !isCustomTime;
		customTimeInput.required = isCustomTime;
		if (!isCustomTime) customTimeInput.value = "";
	};

	timeInputs.forEach((timeInput) => timeInput.addEventListener("change", syncCustomTimeField));
	syncCustomTimeField();

	dateForm.addEventListener("submit", async (event) => {
		event.preventDefault();
		const selectedTimeInput = dateForm.querySelector("input[name='meet-time']:checked");
		if (!selectedTimeInput) return;
		if (selectedTimeInput.dataset.custom === "true" && !customTimeInput.value) {
			customTimeField.hidden = false;
			customTimeInput.focus();
			return;
		}
		document.querySelector("#celebration").hidden = false;
		const submitButton = dateForm.querySelector("[type='submit']");
		submitButton.disabled = true;
		submitButton.textContent = "Preparando o convite…";

		const chosenDate = new Date(`${dateInput.value}T12:00:00`).toLocaleDateString("pt-BR", {
			weekday: "long",
			day: "numeric",
			month: "long",
			year: "numeric",
		});
		const chosenTime = selectedTimeInput.dataset.custom === "true"
			? formatCustomTime(customTimeInput.value)
			: selectedTimeInput.value;
		const title = "Um sorvetinho?";
		const signature = "Sophia";
		const smallPhrase = "Vai ser uma tarde bem docinha.";
		const message = `Oi! Aqui estão minhas ideias para o nosso sorvete 🍦\n\nData: ${chosenDate}\nHorário: ${chosenTime}\n\n♡`;

		try {
			if (!window.jspdf?.jsPDF) throw new Error("PDF indisponível");

			const pdf = new window.jspdf.jsPDF();
			const pageWidth = 210;
			const pageHeight = 297;
			const margin = 16;
			const cardX = 13;
			const cardY = 16;
			const cardWidth = 184;
			const cardHeight = 265;

			pdf.setFillColor(242, 233, 216);
			pdf.rect(0, 0, pageWidth, pageHeight, "F");
			pdf.setFillColor(249, 242, 230);
			pdf.roundedRect(cardX, cardY, cardWidth, cardHeight, 6, 6, "F");
			pdf.setDrawColor(127, 82, 49);
			pdf.setLineWidth(1.1);
			pdf.roundedRect(cardX, cardY, cardWidth, cardHeight, 6, 6, "S");

			pdf.setDrawColor(127, 82, 49);
			pdf.setLineWidth(0.7);
			pdf.line(cardX + 18, cardY + 18, cardX + 42, cardY + 18);
			pdf.line(cardX + cardWidth - 18, cardY + 18, cardX + cardWidth - 42, cardY + 18);
			pdf.line(cardX + 18, cardY + cardHeight - 18, cardX + 42, cardY + cardHeight - 18);
			pdf.line(cardX + cardWidth - 18, cardY + cardHeight - 18, cardX + cardWidth - 42, cardY + cardHeight - 18);
			pdf.line(cardX + 18, cardY + 18, cardX + 18, cardY + 42);
			pdf.line(cardX + cardWidth - 18, cardY + 18, cardX + cardWidth - 18, cardY + 42);
			pdf.line(cardX + 18, cardY + cardHeight - 18, cardX + 18, cardY + cardHeight - 42);
			pdf.line(cardX + cardWidth - 18, cardY + cardHeight - 18, cardX + cardWidth - 18, cardY + cardHeight - 42);
			pdf.circle(cardX + 16, cardY + 16, 7, "S");
			pdf.circle(cardX + cardWidth - 16, cardY + 16, 7, "S");
			pdf.circle(cardX + 16, cardY + cardHeight - 16, 7, "S");
			pdf.circle(cardX + cardWidth - 16, cardY + cardHeight - 16, 7, "S");

			pdf.setFont("times", "bold");
			pdf.setFontSize(24);
			pdf.text(title, 105, 70, { align: "center" });
			pdf.setFont("times", "normal");
			pdf.setFontSize(10);

			pdf.setFillColor(255, 248, 240);
			pdf.roundedRect(34, 100, 142, 30, 5, 5, "F");
			pdf.setDrawColor(127, 82, 49);
			pdf.roundedRect(34, 100, 142, 30, 5, 5, "S");
			pdf.setFont("helvetica", "bold");
			pdf.setTextColor(127, 82, 49);
			pdf.setFontSize(9);
			pdf.text("DATA", 105, 112, { align: "center" });
			pdf.setFont("helvetica", "normal");
			pdf.setFontSize(12);
			pdf.text(pdf.splitTextToSize(chosenDate, 120), 105, 121, { align: "center" });

			pdf.setFillColor(255, 244, 232);
			pdf.roundedRect(34, 146, 142, 30, 5, 5, "F");
			pdf.setDrawColor(127, 82, 49);
			pdf.roundedRect(34, 146, 142, 30, 5, 5, "S");
			pdf.setFont("helvetica", "bold");
			pdf.setTextColor(127, 82, 49);
			pdf.setFontSize(9);
			pdf.text("HORÁRIO", 105, 158, { align: "center" });
			pdf.setFont("helvetica", "normal");
			pdf.setFontSize(12);
			pdf.text(pdf.splitTextToSize(chosenTime, 120), 105, 167, { align: "center" });

			pdf.setDrawColor(127, 82, 49);
			pdf.setLineWidth(0.8);
			pdf.line(55, 205, 155, 205);
			pdf.setFont("times", "bold");
			pdf.setFontSize(12);
			pdf.text(`Com carinho, ${signature}`, 105, 242, { align: "center" });

			const pdfBlob = pdf.output("blob");
			const pdfFile = new File([pdfBlob], "sorvete.pdf", { type: "application/pdf" });

			if (navigator.canShare?.({ files: [pdfFile] }) && navigator.share) {
				await navigator.share({ title: "Nosso sorvetinho", text: message, files: [pdfFile] });
			} else {
				pdf.save("sorvete.pdf");
				window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener");
				document.querySelector("#share-status").textContent = "O PDF foi baixado. No WhatsApp, escolha a conversa e anexe o arquivo sorvete.pdf.";
			}
		} catch (error) {
			if (error.name === "AbortError") return;
			document.querySelector("#share-status").textContent = "Não consegui preparar o PDF agora. Confira sua conexão e tente novamente.";
		} finally {
			submitButton.disabled = false;
			submitButton.textContent = "Compartilhar meu convite";
		}
	});
}
